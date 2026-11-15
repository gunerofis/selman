const whatsappMessage = encodeURIComponent(
  "Merhaba, yazılım hizmetleri ve profesyonel web sitesi için bilgi almak istiyorum.",
);

const emailSubject = encodeURIComponent("Yazılım ve web sitesi hizmeti");
const emailBody = encodeURIComponent(
  "Merhaba,\n\nYazılım veya profesyonel web sitesi hizmeti hakkında bilgi almak istiyorum.\n",
);

export default function DeveloperContact() {
  return (
    <aside className="developer-contact" aria-labelledby="developer-contact-title">
      <div className="developer-contact-inner">
        <p id="developer-contact-title">
          Tüm Yazılım Hizmetleri ve Profesyonel Web Siteleri için.
        </p>
        <address className="developer-contact-details">
          <a href="tel:+905434538864">0543 453 88 64</a>
          <a href="mailto:info@elidsoftware.com">info@elidsoftware.com</a>
          <a href="mailto:elidsoftware@gmail.com">elidsoftware@gmail.com</a>
        </address>
        <nav className="developer-contact-actions" aria-label="Yazılım hizmetleri iletişim bağlantıları">
          <a
            className="developer-contact-whatsapp"
            href={`https://wa.me/905434538864?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <a
            href={`mailto:info@elidsoftware.com?cc=elidsoftware@gmail.com&subject=${emailSubject}&body=${emailBody}`}
          >
            Mail
          </a>
        </nav>
      </div>
    </aside>
  );
}
