import Link from "next/link";
import Container from "@/components/ui/Container";
import NewsletterForm from "@/components/ui/NewsletterForm";

const navColumns = [
  {
    heading: "Platform",
    links: [
      { label: "For Brands", href: "/login/brand" },
      { label: "For Creators", href: "/discover" },
      { label: "How it Works", href: "/#how-it-works" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Company",
    links: [{ label: "About", href: "/about" }],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-and-conditions" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Delivery Policy", href: "/delivery-policy" },
      { label: "Data Deletion", href: "/data-deletion" },
    ],
  },
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
        </div>
      </Container>
    </footer>
  );
}
