"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Discover", href: "/discover" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const EASE = [0.65, 0, 0.35, 1] as const;

const linkVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.05 + i * 0.05, duration: 0.6, ease: EASE },
  }),
  exit: (i: number) => ({
    y: -20,
    opacity: 0,
    transition: { delay: i * 0.03, duration: 0.3, ease: EASE },
  }),
};

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollY = useRef(0);

  useEffect(() => {
    function onScroll() {
      scrollY.current = window.scrollY;
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        data-global-nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-(--border) backdrop-blur-md bg-(--bg-primary)/80"
            : "border-b border-transparent"
        )}
      >
        <Container>
          <nav className="flex items-center justify-between h-16 md:h-20" role="navigation" aria-label="Main">
            {/* Logo */}
            <Link
              href="/"
              className="font-display text-(--text-primary) text-lg font-semibold tracking-[-0.04em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--accent) rounded-sm"
              data-interactive
            >
              CreatorLyff
            </Link>

            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-8" role="list">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-(--text-secondary) hover:text-(--text-primary) transition-colors duration-200 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) rounded-sm"
                    data-interactive
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-(--text-secondary) hover:text-(--text-primary) transition-colors duration-200 text-sm font-medium focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm px-3 py-2"
                data-interactive
              >
                Log in
              </Link>
              <Button variant="primary" size="sm" onClick={() => window.location.href = '/login/brand'}>
                Sign up
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden relative z-[60] p-2 text-(--text-primary) focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              data-interactive
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </nav>
        </Container>
      </header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-(--bg-primary) flex flex-col"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Container className="flex flex-col justify-center h-full pb-24">
              <ul className="flex flex-col gap-2" role="list">
                {links.map(({ label, href }, i) => (
                  <motion.li
                    key={href}
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="overflow-hidden"
                  >
                    <Link
                      href={href}
                      className="block text-h2 font-display text-(--text-primary) py-2 hover:text-(--accent) transition-colors duration-200"
                      onClick={() => setOpen(false)}
                      data-interactive
                    >
                      {label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="mt-12"
                custom={links.length}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Button variant="primary" className="w-full text-base py-4" onClick={() => window.location.href = '/login/brand'}>
                  Sign up free
                </Button>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
