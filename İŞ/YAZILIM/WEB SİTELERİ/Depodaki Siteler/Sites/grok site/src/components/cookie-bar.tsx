import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { COOKIE_PREFS_OPEN_EVENT } from "@/lib/cookie-prefs";

const KEY = "sweb-cookies";

function setCookieOffset(px: string) {
  document.documentElement.style.setProperty("--cookie-h", px);
}

export function CookieBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
    const onOpen = () => setShow(true);
    window.addEventListener(COOKIE_PREFS_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(COOKIE_PREFS_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    setCookieOffset(show ? "7.5rem" : "0px");
    return () => setCookieOffset("0px");
  }, [show]);

  function accept() {
    try {
      localStorage.setItem(KEY, "necessary");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  function reject() {
    try {
      localStorage.setItem(KEY, "rejected");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-dashed border-border bg-bg-elevated px-4 py-4 print:hidden"
      data-print-hide
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm text-fg-muted">
          Sepet, renk ve favori tarayıcıda tutulur — bunlar zorunlu. Ölçüm ve reklam çerezi yok.{" "}
          <Link to="/cerez" className="text-fg underline underline-offset-2">
            Çerez politikası
          </Link>
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={reject}>
            Reddet
          </Button>
          <Button type="button" onClick={accept}>
            Tamam
          </Button>
        </div>
      </div>
    </div>
  );
}
