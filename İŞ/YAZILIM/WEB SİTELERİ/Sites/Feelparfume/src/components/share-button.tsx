import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareButton({ title, url, text }: { title: string; url: string; text?: string }) {
  async function share() {
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title, url, text: text ?? title });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Bağlantı kopyalandı");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Bağlantı kopyalandı");
      } catch {
        toast.error("Paylaşılamadı");
      }
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => void share()}>
      <Share2 className="size-4" />
      Paylaş
    </Button>
  );
}
