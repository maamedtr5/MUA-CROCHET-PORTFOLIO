import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/queries/siteContent';
import { listSocialLinks } from '@/lib/queries/socialLinks';
import ContactForm from '@/components/ContactForm';
import type { SiteContent, SocialLink } from '@/types/content';

export default function Contact() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    getSiteContent('contact_info').then(setContent).catch(() => setContent(null));
    listSocialLinks().then(setSocials).catch(() => setSocials([]));
  }, []);

  return (
    <section className="wrap contact-grid">
      <div>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '2.2rem', margin: '0 0 20px' }}>
          {content?.heading ?? 'Say hello'}
        </h2>
        <p style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', lineHeight: 1.75, color: 'var(--bark)', maxWidth: '40ch' }}>
          {content?.body ?? 'Based in Accra, taking bridal and editorial bookings, plus custom crochet commissions made to order.'}
        </p>
        {socials.length > 0 && (
          <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', color: 'var(--bark)', textDecoration: 'none',
                }}
              >
                {s.platform.slice(0, 2).toUpperCase()}
              </a>
            ))}
          </div>
        )}
      </div>
      <ContactForm />
    </section>
  );
}
