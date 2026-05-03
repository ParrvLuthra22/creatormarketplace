import Link from "next/link";
import Container from "@/components/ui/Container";
import NewsletterForm from "@/components/ui/NewsletterForm";

const navColumns = [
  {
    heading: "Platform",
    links: [
      { label: "For Brands", href: "/brands" },
      { label: "For Creators", href: "/creators" },
      { label: "How it Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

// Inline SVG icons — lucide-react v1 removed branded social icons
function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
function IconLinkedin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function IconYoutube() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

const socials = [
  { label: "X (Twitter)", href: "https://twitter.com", Icon: IconX },
  { label: "Instagram", href: "https://instagram.com", Icon: IconInstagram },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: IconLinkedin },
  { label: "YouTube", href: "https://youtube.com", Icon: IconYoutube },
];

export default function Footer() {
  return (
    <footer data-global-footer className="border-t border-(--border) pt-16 pb-10 overflow-hidden">
      <Container>
        {/* Top: columns + newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {navColumns.map(({ heading, links }) => (
            <div key={heading}>
              <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4">
                {heading}
              </p>
              <ul className="flex flex-col gap-2" role="list">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-(--text-secondary) hover:text-(--text-primary) transition-colors duration-200 text-caption focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) rounded-sm"
                      data-interactive
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-start-4">
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4">
              Newsletter
            </p>
            <p className="text-caption text-(--text-secondary) mb-4 leading-relaxed">
              Stay in the loop. Creator economy insights, platform updates, no
              spam.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Massive wordmark */}
        <div
          className="text-hero font-display text-(--border-strong) leading-none tracking-[-0.05em] overflow-hidden select-none mb-16 pointer-events-none"
          aria-hidden
        >
          CreatorLyff
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-(--border) pt-8">
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">
            © {new Date().getFullYear()} CreatorLyff. All rights reserved.
          </p>

          {/* Social icons */}
          <ul className="flex items-center gap-4" role="list" aria-label="Social media">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) rounded-sm flex items-center justify-center min-h-[44px] min-w-[44px]"
                  data-interactive
                >
                  <Icon />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
