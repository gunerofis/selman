import { type FormEvent, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { atelierMailto, newsletterDraft, openAtelierMail } from "@/lib/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "deep" }) {
  const [mail, setMail] = useState("");
  const [href, setHref] = useState("");
  const muted = tone === "deep" ? "text-fg-on-deep/70" : "text-fg-muted";
  const field =
    tone === "deep"
      ? "border-fg-on-deep/30 bg-transparent text-fg-on-deep placeholder:text-fg-on-deep/50"
      : "";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!mail.includes("@")) return;
    const next = atelierMailto(newsletterDraft(mail));
    setHref(next);
    openAtelierMail(next);
    toast.success("E-posta uygulamanız açıldı.");
    setMail("");
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-md flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          placeholder="ad@firma.com"
          aria-label="E-posta"
          className={`flex-1 ${field}`}
        />
        <Button type="submit" variant={tone === "deep" ? "inverse" : "primary"}>
          Kaydol
        </Button>
      </div>
      <p className={`text-xs ${muted}`}>
        <Link to="/bulten" className="underline underline-offset-2">
          Bülten
        </Link>
        {href ? (
          <>
            {" · açılmazsa "}
            <a href={href} className="underline underline-offset-2">
              bu bağlantı
            </a>
          </>
        ) : null}
      </p>
    </form>
  );
}
