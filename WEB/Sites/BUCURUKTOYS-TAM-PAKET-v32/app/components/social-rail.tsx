"use client";

import { useEffect, useState } from "react";
import { SITE_URL } from "../../lib/site-url";

const whatsappMessage = encodeURIComponent(
  "Merhaba, BÜCÜRÜKTOYS ürünleri hakkında bilgi almak istiyorum.",
);

const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`;

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1v3.5c0 .6-.4 1-1 1C10.3 21.1 2.9 13.7 2.9 4.6c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1l-2.2 1.7Z" /></svg>;
}

function WhatsAppIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.2A12.7 12.7 0 0 0 5.4 22.8L3.2 29l6.5-2.1A12.7 12.7 0 1 0 16 3.2Zm0 22.1c-2 0-3.7-.6-5.3-1.5l-.4-.2-3.8 1.2 1.3-3.7-.3-.4a9.3 9.3 0 1 1 8.5 4.4Zm5.1-7c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.4.2-.7.1-1.8-.9-3.1-1.7-4.3-3.8-.3-.5.3-.5.8-1.6.1-.2 0-.5 0-.7l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.3 3.4 1.4 3.6c.2.2 2.5 3.8 6 5.3 2.2.9 3.1 1 4.2.8.7-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3Z" /></svg>;
}

function FacebookIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 8.2V6.6c0-.8.5-1 1-1H18V2.2c-.5-.1-1.8-.2-3.3-.2-3.2 0-5.4 1.9-5.4 5.5v.7H6V12h3.3v10h4.1V12h3.2l.5-3.8h-3Z" /></svg>;
}

export default function SocialRail() {
  const [developerStripVisible, setDeveloperStripVisible] = useState(false);

  useEffect(() => {
    const developerStrip = document.querySelector(".developer-contact");
    if (!developerStrip) return;

    const observer = new IntersectionObserver(
      ([entry]) => setDeveloperStripVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );

    observer.observe(developerStrip);
    return () => observer.disconnect();
  }, []);

  const socialTabIndex = developerStripVisible ? -1 : undefined;

  return (
    <nav
      className={`social-rail${developerStripVisible ? " social-rail-hidden" : ""}`}
      aria-label="Hızlı iletişim ve sosyal medya"
      aria-hidden={developerStripVisible}
    >
      <a className="social-rail-button social-phone" href="tel:+905393468527" aria-label="Telefon: 0539 346 85 27" data-title="Telefon" tabIndex={socialTabIndex}>
        <PhoneIcon />
      </a>
      <a className="social-rail-button social-whatsapp" href={`https://wa.me/905393468527?text=${whatsappMessage}`} target="_blank" rel="noreferrer" aria-label="WhatsApp ile iletişime geç" data-title="WhatsApp" tabIndex={socialTabIndex}>
        <WhatsAppIcon />
      </a>
      <a className="social-rail-button social-facebook" href={facebookShare} target="_blank" rel="noreferrer" aria-label="BÜCÜRÜKTOYS sitesini Facebook'ta paylaş" data-title="Facebook" tabIndex={socialTabIndex}>
        <FacebookIcon />
      </a>
    </nav>
  );
}
