import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

export const DESIGN_REF_MAX = 4;
export const DESIGN_REF_BYTES = 5 * 1024 * 1024;

export type DesignRef = { id: string; file: File; url: string };

export function DesignRefs({
  refs,
  onChange,
}: {
  refs: DesignRef[];
  onChange: (next: DesignRef[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const live = useRef(refs);
  live.current = refs;

  useEffect(() => {
    return () => {
      live.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  function add(list: FileList | null) {
    if (!list) return;
    const next = [...refs];
    for (const file of [...list]) {
      if (next.length >= DESIGN_REF_MAX) {
        toast.error(`En fazla ${DESIGN_REF_MAX} görsel`);
        break;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} görsel değil`);
        continue;
      }
      if (file.size > DESIGN_REF_BYTES) {
        toast.error(`${file.name} 5 MB üstü`);
        continue;
      }
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${next.length}`,
        file,
        url: URL.createObjectURL(file),
      });
    }
    onChange(next);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(id: string) {
    const hit = refs.find((item) => item.id === id);
    if (hit) URL.revokeObjectURL(hit.url);
    onChange(refs.filter((item) => item.id !== id));
  }

  return (
    <div>
      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center border border-dashed border-border-strong bg-bg-elevated px-4 py-6 text-center text-sm text-fg-muted hover:border-fg hover:text-fg">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          className="sr-only"
          onChange={(e) => add(e.target.files)}
        />
        Masa, çekmece veya eskiz fotoğrafı ekleyin
        <span className="mt-1 font-mono text-xs">
          jpg, png, webp · en fazla {DESIGN_REF_MAX} · 5 MB
        </span>
      </label>
      {refs.length > 0 ? (
        <ul className="mt-3 grid grid-cols-4 gap-2">
          {refs.map((item) => (
            <li key={item.id} className="relative border border-dashed border-border bg-bg-wash">
              <img
                src={item.url}
                alt=""
                className="aspect-square w-full object-contain p-1"
                width={1500}
                height={1500}
              />
              <button
                type="button"
                className="absolute top-0 right-0 flex size-11 items-center justify-center bg-bg-elevated/90 text-fg-muted hover:text-danger"
                aria-label={`${item.file.name} kaldır`}
                onClick={() => remove(item.id)}
              >
                <X className="size-4" />
              </button>
              <p className="truncate px-1 pb-1 font-mono text-xs text-fg-muted">{item.file.name}</p>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-2 text-xs text-fg-muted">
        Seçtiğiniz dosyalar cihazınızda kalır; kayıtta dosya adları atölye notuna eklenir.
      </p>
    </div>
  );
}
