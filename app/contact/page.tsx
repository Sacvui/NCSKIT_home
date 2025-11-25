"use client";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LanguageProvider, useLanguageContext } from "../components/LanguageProvider";

export default function ContactPage() {
  return (
    <LanguageProvider>
      <ContactContent />
    </LanguageProvider>
  );
}

function ContactContent() {
  const { copy } = useLanguageContext();
  const { nav, headerCtas, contact } = copy;

  return (
    <>
      <Header nav={nav} headerCtas={headerCtas} />
      <main>
        <section className="section contact" style={{ paddingTop: "6rem" }}>
          <div className="container contact-grid">
            <div>
              <p className="eyebrow">{contact.eyebrow}</p>
              <h1>{contact.title}</h1>
              <p>{contact.description}</p>
              <div className="contact-info">
                <a href={`mailto:${contact.email}`}>
                  {contact.emailLabel}: {contact.email}
                </a>
                <a href={contact.website} target="_blank" rel="noreferrer">
                  {contact.websiteLabel}: {contact.website.replace("https://", "")}
                </a>
              </div>
            </div>
            <form className="contact-form" action="#" method="post">
              <label>
                {contact.form.nameLabel}
                <input type="text" name="name" placeholder={contact.form.namePlaceholder} required />
              </label>
              <label>
                {contact.form.emailLabel}
                <input
                  type="email"
                  name="email"
                  placeholder={contact.form.emailPlaceholder}
                  required
                />
              </label>
              <label>
                {contact.form.needLabel}
                <textarea
                  name="message"
                  rows={3}
                  placeholder={contact.form.needPlaceholder}
                />
              </label>
              <button type="submit" className="primary-btn">
                {contact.form.submit}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

