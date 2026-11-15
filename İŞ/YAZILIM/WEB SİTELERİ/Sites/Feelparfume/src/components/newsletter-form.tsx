import { type FormEvent, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { submitLead } from "@/lib/lead-submissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "deep" }) {
  const [mail, setMail] = useState("");
  const [consent, setConsent] = useState(false);
  const muted = tone === "deep" ? "text-fg-on-deep/70" : "text-fg-muted";
  const field =
    tone === "deep"
      ? "border-fg-on-deep/30 bg-transparent text-fg-on-deep placeholder:text-fg-on-deep/50"
      : "";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!mail.includes("@")) return;
    try {
      const result = await submitLead({
        data: {
          type: "newsletter",
          title: mail,
          email: mail,
          data: { consent },
        },
      });
      toast.success(`Bülten kaydınız alındı · ${result.reference}`);
      setMail("");
      setConsent(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bülten kaydı alınamadı.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-md flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          placeholder="ad@ornek.com"
          aria-label="E-posta"
          className={`flex-1 ${field}`}
        />
        <Button type="submit" variant={tone === "deep" ? "inverse" : "primary"}>
          Kaydol
        </Button>
      </div>
      <label className={`flex min-h-11 items-center gap-2 text-xs ${muted}`}>
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 size-4 shrink-0"
        />
        <span>
          Kampanya iletileri almak istiyorum. Bu onayı dilediğim zaman geri alabilirim.
        </span>
      </label>
      <p className={`text-xs ${muted}`}>
        <Link to="/bulten" className="underline underline-offset-2">
          Bülten
        </Link>
        {" · "}
        <Link to="/kvkk" className="underline underline-offset-2">
          KVKK aydınlatması
        </Link>
      </p>
    </form>
  );
}
