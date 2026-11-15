"""Makro Ofis sosyal medya kayıtlarını Codex ve Grok Bot'a iletir."""

from __future__ import annotations

import ctypes
from ctypes import wintypes
from contextlib import contextmanager
import json
import shutil
import sqlite3
import subprocess
import threading
import urllib.error
import urllib.request
import uuid
from datetime import datetime, timezone
from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox, ttk


DATA_DIR = Path(r"C:\Users\Guner Office\Desktop\Güner Ofis\04 Sosyal Medya\Instagram\Makro Ofis\Veri Köprüsü")
DB_PATH = DATA_DIR / "Kayıtlar.sqlite"
CONFIG_PATH = Path(__file__).with_name("ayarlar.json")
CODEX_THREAD = "01a163fa-10a8-77b2-8b8f-3667be385fc7"
KINDS = ("Fikir", "Post planı", "Görsel", "Yayın", "Sonuç", "Diğer")


class Blob(ctypes.Structure):
    _fields_ = [("cbData", wintypes.DWORD), ("pbData", ctypes.POINTER(ctypes.c_char))]


ctypes.windll.kernel32.LocalFree.argtypes = [ctypes.c_void_p]
ctypes.windll.kernel32.LocalFree.restype = ctypes.c_void_p


def protect(text: str) -> str:
    raw = text.encode("utf-8")
    source_buffer = ctypes.create_string_buffer(raw)
    source = Blob(len(raw), ctypes.cast(source_buffer, ctypes.POINTER(ctypes.c_char)))
    target = Blob()
    if not ctypes.windll.crypt32.CryptProtectData(ctypes.byref(source), None, None, None, None, 0, ctypes.byref(target)):
        raise ctypes.WinError()
    try:
        return ctypes.string_at(target.pbData, target.cbData).hex()
    finally:
        ctypes.windll.kernel32.LocalFree(target.pbData)


def unprotect(value: str) -> str:
    if not value:
        return ""
    raw = bytes.fromhex(value)
    source_buffer = ctypes.create_string_buffer(raw)
    source = Blob(len(raw), ctypes.cast(source_buffer, ctypes.POINTER(ctypes.c_char)))
    target = Blob()
    if not ctypes.windll.crypt32.CryptUnprotectData(ctypes.byref(source), None, None, None, None, 0, ctypes.byref(target)):
        raise ctypes.WinError()
    try:
        return ctypes.string_at(target.pbData, target.cbData).decode("utf-8")
    finally:
        ctypes.windll.kernel32.LocalFree(target.pbData)


def read_config() -> dict:
    if CONFIG_PATH.exists():
        config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    else:
        config = {"codex_thread": CODEX_THREAD, "grok_webhook_url": "", "grok_webhook_key_protected": ""}
    # Each brand can continue in its own chat; existing default remains the fallback.
    brand_thread = config.get("codex_threads", {}).get(DATA_DIR.parent.name)
    if brand_thread:
        config["codex_thread"] = brand_thread
    config["grok_enabled"] = DATA_DIR.parent.name not in config.get("grok_disabled_brands", [])
    return config


def save_config(config: dict) -> None:
    CONFIG_PATH.write_text(json.dumps(config, ensure_ascii=False, indent=2), encoding="utf-8")


def connect() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("""CREATE TABLE IF NOT EXISTS entries (
        id TEXT PRIMARY KEY, created_at TEXT NOT NULL, kind TEXT NOT NULL,
        title TEXT NOT NULL, detail TEXT NOT NULL, file_path TEXT NOT NULL,
        codex_status TEXT NOT NULL DEFAULT 'bekliyor',
        grok_status TEXT NOT NULL DEFAULT 'bekliyor',
        codex_error TEXT NOT NULL DEFAULT '', grok_error TEXT NOT NULL DEFAULT ''
    )""")
    conn.commit()
    return conn


@contextmanager
def database():
    conn = connect()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def add_entry(kind: str, title: str, detail: str, file_path: str) -> str:
    entry_id = str(uuid.uuid4())
    with database() as conn:
        conn.execute("INSERT INTO entries (id, created_at, kind, title, detail, file_path) VALUES (?, ?, ?, ?, ?, ?)",
                     (entry_id, datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"), kind, title, detail, file_path))
    return entry_id


def get_entry(entry_id: str) -> dict:
    with database() as conn:
        conn.row_factory = sqlite3.Row
        row = conn.execute("SELECT * FROM entries WHERE id = ?", (entry_id,)).fetchone()
    return dict(row)


def pending_ids() -> list[str]:
    condition = "codex_status != 'iletildi'"
    if read_config().get("grok_enabled", True):
        condition += " OR grok_status != 'iletildi'"
    with database() as conn:
        return [row[0] for row in conn.execute(
            "SELECT id FROM entries WHERE " + condition + " ORDER BY created_at")]


def summary(entry: dict) -> str:
    lines = [f"@macro.office — {entry['title']}",
             f"Kayıt kimliği: {entry['id']}", f"Tarih: {entry['created_at']}",
             f"Tür: {entry['kind']}", f"Başlık: {entry['title']}", f"Açıklama: {entry['detail']}"]
    if entry["file_path"]:
        lines.append(f"Yerel dosya yolu (dosya içeriği iletilmez): {entry['file_path']}")
    lines.append("Bu kayıt bilgi amaçlıdır. Kullanıcı ayrıca istemedikçe paylaşım yayımlama veya canlı hesapta değişiklik yapma.")
    return "\n".join(lines)


def set_status(entry_id: str, channel: str, status: str, error: str = "") -> None:
    assert channel in ("codex", "grok")
    with database() as conn:
        conn.execute(f"UPDATE entries SET {channel}_status = ?, {channel}_error = ? WHERE id = ?",
                     (status, error[:500], entry_id))


def deliver(entry_id: str) -> None:
    # A plan child is delivered only through its durable batch, also on manual retry.
    with database() as conn:
        if conn.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='notification_members'").fetchone():
            mapped = conn.execute('SELECT batch_id FROM notification_members WHERE entry_id=?',(entry_id,)).fetchone()
            if mapped: entry_id = mapped[0]
    entry = get_entry(entry_id)
    config = read_config()
    payload = summary(entry)
    if entry["codex_status"] != "iletildi":
        thread = config.get("codex_thread", "").strip()
        if thread:
            try:
                codex = shutil.which("codex.cmd") or "codex.cmd"
                run = subprocess.run([codex, "queue", "--thread", thread, "--message", payload],
                                     capture_output=True, text=True, timeout=25, creationflags=subprocess.CREATE_NO_WINDOW)
                if run.returncode:
                    raise RuntimeError((run.stderr or run.stdout).strip() or f"Çıkış kodu {run.returncode}")
                set_status(entry_id, "codex", "iletildi")
            except Exception as exc:
                set_status(entry_id, "codex", "hata", str(exc))
        else:
            set_status(entry_id, "codex", "ayar gerekli")
    if not config.get("grok_enabled", True):
        if entry["grok_status"] != "iletildi":
            set_status(entry_id, "grok", "devre dışı")
    elif entry["grok_status"] != "iletildi":
        url = config.get("grok_webhook_url", "").strip()
        protected_key = config.get("grok_webhook_key_protected", "")
        if url and protected_key:
            try:
                key = unprotect(protected_key)
                body = json.dumps({"id": entry_id, "source": "Sosyal Veri Köprüsü", "message": payload},
                                  ensure_ascii=False).encode("utf-8")
                request = urllib.request.Request(url, data=body, method="POST", headers={
                    "Authorization": f"Bearer {key}", "Content-Type": "application/json"})
                with urllib.request.urlopen(request, timeout=20) as response:
                    if response.status != 200:
                        raise RuntimeError(f"HTTP {response.status}")
                set_status(entry_id, "grok", "iletildi")
            except Exception as exc:
                set_status(entry_id, "grok", "hata", str(exc))
        else:
            set_status(entry_id, "grok", "ayar gerekli")


class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Sosyal Veri Köprüsü · Makro Ofis")
        self.geometry("760x600")
        self.minsize(660, 520)
        self.kind = tk.StringVar(value=KINDS[0])
        self.title_var = tk.StringVar()
        self.file_var = tk.StringVar()
        self.status_var = tk.StringVar(value="Hazır")
        frame = ttk.Frame(self, padding=18)
        frame.pack(fill="both", expand=True)
        frame.columnconfigure(1, weight=1)
        ttk.Label(frame, text="@macro.office · Veri Girişi", font=("Segoe UI", 17, "bold")).grid(row=0, column=0, columnspan=3, sticky="w", pady=(0, 16))
        ttk.Label(frame, text="Tür").grid(row=1, column=0, sticky="w", pady=5)
        ttk.Combobox(frame, textvariable=self.kind, values=KINDS, state="readonly").grid(row=1, column=1, sticky="ew", pady=5)
        ttk.Label(frame, text="Başlık").grid(row=2, column=0, sticky="w", pady=5)
        ttk.Entry(frame, textvariable=self.title_var).grid(row=2, column=1, columnspan=2, sticky="ew", pady=5)
        ttk.Label(frame, text="Açıklama").grid(row=3, column=0, sticky="nw", pady=5)
        self.detail = tk.Text(frame, height=9, wrap="word", font=("Segoe UI", 10))
        self.detail.grid(row=3, column=1, columnspan=2, sticky="nsew", pady=5)
        frame.rowconfigure(3, weight=1)
        ttk.Label(frame, text="Dosya yolu (referans)").grid(row=4, column=0, sticky="w", pady=5)
        ttk.Entry(frame, textvariable=self.file_var).grid(row=4, column=1, sticky="ew", pady=5)
        ttk.Button(frame, text="Seç", command=self.choose_file).grid(row=4, column=2, padx=(8, 0))
        buttons = ttk.Frame(frame)
        buttons.grid(row=5, column=0, columnspan=3, sticky="ew", pady=(15, 10))
        ttk.Button(buttons, text="Kaydet ve İlet", command=self.save).pack(side="left")
        ttk.Button(buttons, text="Bekleyenleri Yeniden Gönder", command=self.retry).pack(side="left", padx=10)
        ttk.Button(buttons, text="Bağlantı Ayarları", command=self.settings).pack(side="left")
        ttk.Label(frame, textvariable=self.status_var, foreground="#245c33").grid(row=6, column=0, columnspan=3, sticky="w", pady=4)
        ttk.Label(frame, text="Son kayıtlar ve iletim durumu", font=("Segoe UI", 10, "bold")).grid(row=7, column=0, columnspan=3, sticky="w", pady=(12, 4))
        self.tree = ttk.Treeview(frame, columns=("time", "kind", "title", "codex", "grok"), show="headings", height=7)
        for name, label, width in [("time", "Tarih", 145), ("kind", "Tür", 90), ("title", "Başlık", 220),
                                   ("codex", "Codex", 85), ("grok", "Grok Bot", 90)]:
            self.tree.heading(name, text=label)
            self.tree.column(name, width=width, stretch=name == "title")
        self.tree.grid(row=8, column=0, columnspan=3, sticky="nsew")
        frame.rowconfigure(8, weight=1)
        self.refresh()

    def choose_file(self):
        path = filedialog.askopenfilename()
        if path:
            self.file_var.set(path)

    def refresh(self):
        for item in self.tree.get_children():
            self.tree.delete(item)
        with database() as conn:
            for created, kind, title, codex, grok in conn.execute(
                "SELECT created_at, kind, title, codex_status, grok_status FROM entries ORDER BY created_at DESC LIMIT 30"):
                self.tree.insert("", "end", values=(created[:19].replace("T", " "), kind, title, codex, grok))

    def send_async(self, ids: list[str]):
        if not ids:
            self.status_var.set("Bekleyen kayıt yok.")
            return
        self.status_var.set(f"{len(ids)} kayıt iletiliyor...")
        def work():
            for entry_id in ids:
                deliver(entry_id)
            self.after(0, lambda: (self.refresh(), self.status_var.set("İletim tamamlandı. Durumları tabloda görün.")))
        threading.Thread(target=work, daemon=True).start()

    def save(self):
        title = self.title_var.get().strip()
        detail = self.detail.get("1.0", "end").strip()
        file_path = self.file_var.get().strip()
        if not title or not detail:
            messagebox.showerror("Eksik bilgi", "Başlık ve açıklama gerekli.")
            return
        if file_path and not Path(file_path).is_file():
            messagebox.showerror("Dosya bulunamadı", file_path)
            return
        entry_id = add_entry(self.kind.get(), title, detail, file_path)
        self.title_var.set("")
        self.detail.delete("1.0", "end")
        self.file_var.set("")
        self.refresh()
        self.send_async([entry_id])

    def retry(self):
        self.send_async(pending_ids())

    def settings(self):
        config = read_config()
        dialog = tk.Toplevel(self)
        dialog.title("Bağlantı Ayarları")
        dialog.geometry("680x310")
        dialog.transient(self)
        dialog.grab_set()
        panel = ttk.Frame(dialog, padding=18)
        panel.pack(fill="both", expand=True)
        panel.columnconfigure(1, weight=1)
        thread = tk.StringVar(value=config.get("codex_thread", CODEX_THREAD))
        url = tk.StringVar(value=config.get("grok_webhook_url", ""))
        key = tk.StringVar()
        ttk.Label(panel, text="Codex sohbet kimliği").grid(row=0, column=0, sticky="w", pady=6)
        ttk.Entry(panel, textvariable=thread).grid(row=0, column=1, sticky="ew", pady=6)
        ttk.Label(panel, text="Grok Bot webhook URL").grid(row=1, column=0, sticky="w", pady=6)
        ttk.Entry(panel, textvariable=url).grid(row=1, column=1, sticky="ew", pady=6)
        ttk.Label(panel, text="Webhook anahtarı").grid(row=2, column=0, sticky="w", pady=6)
        ttk.Entry(panel, textvariable=key, show="•").grid(row=2, column=1, sticky="ew", pady=6)
        ttk.Label(panel, text="Boş bırakılırsa kayıtlı anahtar korunur. Anahtar Windows hesabınıza şifreli kaydedilir.",
                  wraplength=600).grid(row=3, column=0, columnspan=2, sticky="w", pady=(6, 14))
        ttk.Label(panel, text="Grok Bot'ta webhook ile çalışan bir rutin oluşturun. Rutin URL ve key bilgilerini buraya girin.",
                  wraplength=600).grid(row=4, column=0, columnspan=2, sticky="w")
        def accept():
            new_url = url.get().strip()
            if new_url and not new_url.startswith("https://"):
                messagebox.showerror("Hatalı URL", "Grok Bot webhook adresi HTTPS olmalı.", parent=dialog)
                return
            config["codex_thread"] = thread.get().strip()
            config["grok_webhook_url"] = new_url
            if key.get().strip():
                config["grok_webhook_key_protected"] = protect(key.get().strip())
            save_config(config)
            dialog.destroy()
            self.retry()
        ttk.Button(panel, text="Kaydet", command=accept).grid(row=5, column=0, columnspan=2, sticky="e", pady=18)


if __name__ == "__main__":
    App().mainloop()
