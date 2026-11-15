import { useEffect, useState } from "react";
import { Link, getRouteApi } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";

const root = getRouteApi("__root__");

export function TrustStrip() {
  const { cardSecure } = root.useLoaderData();
  const [secure, setSecure] = useState(false);
  useEffect(() => {
    setSecure(window.location.protocol === "https:");
  }, []);
  const items = [
    cardSecure ? "3D Secure" : null,
    secure ? "SSL" : null,
    BRAND.etbisNo,
  ].filter((item): item is string => Boolean(item));
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 border-t border-solid border-border px-4 py-3 font-mono text-xs text-fg-muted print:hidden">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
      <li>
        <Link to="/iade" className="hover:text-fg">
          14 gün
        </Link>
      </li>
      <li>
        <Link to="/garanti" hash="parti" className="hover:text-fg">
          Parti no
        </Link>
      </li>
    </ul>
  );
}
