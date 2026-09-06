"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Copy,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Play,
} from "lucide-react";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { useCreatorByHandle } from "@/lib/hooks/useCreators";
import { useAuthStore } from "@/lib/auth";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import Lightbox, { ShowcaseItem } from "@/components/creator-profile/Lightbox";
import { InstagramIcon, YouTubeIcon, XIcon, LinkedInIcon, SnapchatIcon } from "@/components/auth/SocialIcons";

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];
const SITE_URL = "https://creatorlyff.com";

// ─── Formatting helpers ─────────────────────────────────────────────────────

function formatNumber(value: number | string | null | undefined) {
  const n = Number(String(value ?? 0).replace(/,/g, ""));
  if (!n) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat("en-IN").format(n);
}

function formatINR(n?: number) {
  if (!n && n !== 0) return null;
  return `₹${n.toLocaleString("en-IN")}`;
}

// Real, computed engagement — average (likes + comments) / followers across
// recent Instagram posts. Falls back to the free-text `engagement` field the
// creator can set by hand. Never fabricated: null when neither exists.
function computeEngagementRate(profile: any): number | null {
  const media = profile.recentMedia;
  const followers = profile.instagramFollowerCount;
  if (Array.isArray(media) && media.length && followers) {
    const rates = media
      .filter((m: any) => typeof m.likeCount === "number")
      .map((m: any) => ((m.likeCount || 0) + (m.commentsCount || 0)) / followers);
    if (rates.length) return (rates.reduce((a: number, b: number) => a + b, 0) / rates.length) * 100;
  }
  const parsed = parseFloat(String(profile.engagement || "").replace("%", ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function computeAvgViews(profile: any): number | null {
  const videos = profile.recentYouTubeVideos;
  if (!Array.isArray(videos) || !videos.length) return null;
  const views = videos.filter((v: any) => typeof v.viewCount === "number").map((v: any) => v.viewCount);
  if (!views.length) return null;
  return Math.round(views.reduce((a: number, b: number) => a + b, 0) / views.length);
}

// ─── Live IST clock ─────────────────────────────────────────────────────────

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono-utility text-mono-sm text-white/70 tabular-nums" aria-label="Current time in India">
      INDIA / {time}
    </span>
  );
}

// ─── Count-up stat card ─────────────────────────────────────────────────────

function CountUpStat({ target, format, label }: { target: number; format: (n: number) => string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(eased * target);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <div ref={ref} className="p-7 rounded-2xl border border-(--border) bg-(--bg-secondary) card-hover">
      <p className="text-h2 font-display tabular-nums">{format(value)}</p>
      <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mt-2">{label}</p>
    </div>
  );
}

// ─── Section mono label ─────────────────────────────────────────────────────

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <RevealOnScroll>
      <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4 block">
        {n} — {children}
      </span>
    </RevealOnScroll>
  );
}

// ─── Platform card ──────────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, () => React.ReactElement> = {
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  twitter: XIcon,
  linkedin: LinkedInIcon,
  snapchat: SnapchatIcon,
};

function PlatformCard({ platform, delay }: { platform: any; delay: number }) {
  const Icon = PLATFORM_ICONS[platform.key];
  return (
    <RevealOnScroll delay={delay}>
      <a
        href={platform.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full p-6 rounded-2xl border border-(--border) bg-(--bg-secondary) card-hover"
        data-interactive
        data-cursor="View"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-(--accent)">
            <Icon />
          </span>
          <ArrowRight size={14} className="text-(--text-tertiary) -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
        </div>
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1">{platform.label.toUpperCase()}</p>
        {typeof platform.followers === "number" && platform.followers > 0 && (
          <p className="text-h3 font-display tabular-nums">{formatNumber(platform.followers)}</p>
        )}
        <div className="mt-3 space-y-1 text-xs text-(--text-secondary)">
          {typeof platform.engagement === "number" && <p>{platform.engagement.toFixed(1)}% engagement</p>}
          {platform.secondary && <p className="line-clamp-1">{platform.secondary}</p>}
        </div>
      </a>
    </RevealOnScroll>
  );
}

// ─── Masonry showcase item ──────────────────────────────────────────────────

function MasonryItem({ item, onOpen, delay }: { item: ShowcaseItem; onOpen: () => void; delay: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = item.type === "video";
  const isEmbed = item.type === "embed";

  return (
    <RevealOnScroll delay={delay} className="break-inside-avoid mb-4">
      <button
        onClick={onOpen}
        onMouseEnter={() => videoRef.current?.play().catch(() => {})}
        onMouseLeave={() => {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }}
        className="group relative block w-full rounded-xl overflow-hidden bg-(--bg-secondary) border border-(--border) card-hover text-left"
        data-interactive
        data-cursor={isVideo || isEmbed ? "Play" : "View"}
      >
        {isEmbed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnailUrl} alt={item.caption || "Video"} className="w-full h-auto" loading="lazy" />
        ) : isVideo ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video ref={videoRef} src={item.url} className="w-full h-auto" muted loop playsInline preload="metadata" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt={item.caption || "Work sample"} className="w-full h-auto" loading="lazy" />
        )}

        {(isVideo || isEmbed) && (
          <div className="absolute inset-0 grid place-items-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="h-11 w-11 rounded-full bg-white/95 grid place-items-center">
              <Play size={16} className="text-black fill-black ml-0.5" />
            </div>
          </div>
        )}

        {(item.caption || item.likeCount || item.commentsCount) && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 pt-10">
            {item.caption && <p className="text-xs text-white line-clamp-2">{item.caption}</p>}
            {(item.likeCount || item.commentsCount) && (
              <div className="flex items-center gap-3 mt-2 font-mono-utility text-mono-sm text-white/70">
                {!!item.likeCount && (
                  <span className="flex items-center gap-1">
                    <Heart size={11} /> {formatNumber(item.likeCount)}
                  </span>
                )}
                {!!item.commentsCount && (
                  <span className="flex items-center gap-1">
                    <MessageCircle size={11} /> {formatNumber(item.commentsCount)}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </button>
    </RevealOnScroll>
  );
}

// ─── Share row ──────────────────────────────────────────────────────────────

function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast("Link copied", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Couldn't copy link", "error");
    }
  }

  const linkClass =
    "h-11 w-11 rounded-full border border-(--border-strong) grid place-items-center text-(--text-secondary) hover:text-(--text-primary) hover:border-(--text-primary) transition-colors duration-200";

  return (
    <div className="flex items-center gap-3">
      <button onClick={copyLink} className={linkClass} aria-label="Copy link" data-interactive data-cursor="Copy">
        <Copy size={16} className={copied ? "text-(--accent)" : ""} />
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        aria-label="Share on WhatsApp"
        data-interactive
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.86 14.13c-.25.7-1.45 1.36-2 1.44-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.63-2.98-1.29-4.92-4.29-5.07-4.49-.15-.2-1.22-1.62-1.22-3.09 0-1.47.77-2.19 1.05-2.49.27-.3.59-.37.79-.37h.57c.18 0 .43-.07.67.51.25.6.85 2.08.92 2.23.08.15.13.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.54-.15.15-.3.31-.13.61.18.3.79 1.3 1.7 2.11 1.17 1.04 2.16 1.37 2.46 1.52.3.15.48.13.65-.08.18-.2.76-.89.96-1.19.2-.3.4-.25.67-.15.28.1 1.75.83 2.05.98.3.15.5.23.57.35.08.13.08.7-.17 1.4Z" />
        </svg>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        aria-label="Share on X"
        data-interactive
      >
        <XIcon />
      </a>
      <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`} className={linkClass} aria-label="Share by email" data-interactive>
        <Mail size={16} />
      </a>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function CreatorProfileClient({ handle, initialData }: { handle: string; initialData?: any }) {
  const query = useCreatorByHandle(handle, initialData);
  const { isAuthenticated, isBrand } = useAuthStore();
  const router = useRouter();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const coverY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [pastHero, setPastHero] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    function onScroll() {
      setPastHero(window.scrollY > window.innerHeight * 0.85);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const creator = query.data?.creator;
  const pastCollaborations: { name: string; logoUrl: string | null }[] = query.data?.pastCollaborations || [];
  const profileViews30d: number = query.data?.profileViews30d || 0;

  const { user, profile, verified, niches, combinedFollowers, engagementRate, avgViews, platforms, showcaseItems, firstName, pricingVisible, coverImage, avatarImage } =
    useMemo(() => {
      if (!creator) return {} as any;
      const user = creator.user || {};
      const profile = creator.profile || {};
      const niches: string[] = profile.niches || [];
      const engagementRate = computeEngagementRate(profile);
      const avgViews = computeAvgViews(profile);
      const combinedFollowers =
        profile.combinedFollowerCount || profile.instagramFollowerCount || profile.youtubeSubscriberCount || profile.twitterFollowerCount || 0;

      const platforms: any[] = [];
      if (profile.instagramFollowerCount || profile.instagramUserId) {
        platforms.push({
          key: "instagram",
          label: "Instagram",
          followers: profile.instagramFollowerCount,
          engagement: engagementRate,
          secondary: profile.instagramMediaCount ? `${profile.instagramMediaCount} posts` : undefined,
          href: `https://instagram.com/${String(profile.instagramHandle || "").replace(/^@+/, "")}`,
        });
      }
      if (profile.youtubeChannelId || profile.youtubeSubscriberCount) {
        platforms.push({
          key: "youtube",
          label: "YouTube",
          followers: profile.youtubeSubscriberCount,
          secondary: avgViews ? `${formatNumber(avgViews)} avg views` : profile.youtubeVideoCount ? `${profile.youtubeVideoCount} videos` : undefined,
          href: profile.youtubeChannelId ? `https://youtube.com/channel/${profile.youtubeChannelId}` : undefined,
        });
      }
      if (profile.twitterHandle) {
        platforms.push({
          key: "twitter",
          label: "X",
          followers: profile.twitterFollowerCount,
          href: `https://x.com/${String(profile.twitterHandle).replace(/^@+/, "")}`,
        });
      }
      if (profile.linkedinHandle) {
        platforms.push({
          key: "linkedin",
          label: "LinkedIn",
          secondary: profile.linkedinHeadline,
          href: `https://linkedin.com/in/${String(profile.linkedinHandle).replace(/^@+/, "")}`,
        });
      }
      if (profile.snapchatHandle) {
        platforms.push({
          key: "snapchat",
          label: "Snapchat",
          secondary: `@${profile.snapchatHandle}`,
          href: `https://snapchat.com/add/${String(profile.snapchatHandle).replace(/^@+/, "")}`,
        });
      }

      const showcaseItems: ShowcaseItem[] = [];
      (profile.brandWork || []).forEach((w: any, i: number) => {
        if (!w.url) return;
        showcaseItems.push({
          id: `brand-${i}`,
          type: w.type === "video" ? "video" : "image",
          url: w.url,
          caption: w.title,
          externalUrl: w.instagramUrl,
        });
      });
      (profile.recentMedia || []).forEach((m: any) => {
        const url = m.mediaUrl || m.thumbnailUrl;
        if (!url) return;
        showcaseItems.push({
          id: `ig-${m.id}`,
          type: m.mediaType === "VIDEO" ? "video" : "image",
          url,
          caption: m.caption,
          likeCount: m.likeCount,
          commentsCount: m.commentsCount,
          externalUrl: m.permalink,
        });
      });
      (profile.recentYouTubeVideos || []).forEach((v: any) => {
        if (!v.videoId) return;
        showcaseItems.push({
          id: `yt-${v.videoId}`,
          type: "embed",
          url: `https://www.youtube.com/embed/${v.videoId}?autoplay=1`,
          thumbnailUrl: v.thumbnailUrl,
          caption: v.title,
          likeCount: v.likeCount,
          commentsCount: v.commentCount,
          externalUrl: `https://youtube.com/watch?v=${v.videoId}`,
        });
      });

      const pricingVisible = Boolean(profile.pricing && (profile.pricing.reel || profile.pricing.story || profile.pricing.post || profile.pricing.starting));

      return {
        user,
        profile,
        verified: user.verificationBadge && user.verificationBadge !== "none",
        niches,
        combinedFollowers,
        engagementRate,
        avgViews,
        platforms,
        showcaseItems,
        firstName: String(user.fullName || "this creator").split(" ")[0],
        pricingVisible,
        coverImage: profile.coverImage || profile.youtubeBannerUrl,
        avatarImage: profile.profilePhoto || profile.youtubeThumbnailUrl,
      };
    }, [creator]);

  const sectionNumbers = useMemo(() => {
    const flags = [
      { key: "stats", show: true },
      { key: "bio", show: Boolean(profile?.bio || profile?.instagramBio || profile?.youtubeBio) },
      { key: "platforms", show: (platforms || []).length > 0 },
      { key: "audience", show: true },
      { key: "showcase", show: (showcaseItems || []).length > 0 },
      { key: "pricing", show: pricingVisible },
      { key: "collabs", show: pastCollaborations.length > 0 },
      { key: "footer", show: true },
    ];
    const out: Record<string, string> = {};
    let n = 0;
    for (const f of flags) if (f.show) out[f.key] = String(++n).padStart(2, "0");
    return out;
  }, [profile, platforms, showcaseItems, pricingVisible, pastCollaborations.length]);

  function handleSendProposal() {
    if (isAuthenticated && isBrand) {
      router.push(`/dashboard/brand/campaigns?creatorId=${user._id || user.id}`);
    } else {
      router.push(`/login/brand?redirect=${encodeURIComponent(`/c/${handle}`)}`);
    }
  }

  // page.tsx only mounts this component once its server-side fetch has
  // confirmed the creator exists, and seeds this exact shape as react-query
  // initialData — so `creator` is populated from the very first render. This
  // is just a type-safety net, not a real runtime branch: bailing here (rather
  // than an early-return above the hero's ref-bearing section) keeps the
  // useScroll target ref always attached once this component is mounted at all.
  if (!creator) return null;

  const bio = profile.bio || profile.instagramBio || profile.youtubeBio;
  const profileUrl = `${SITE_URL}/c/${handle}`;

  return (
    <div className="bg-(--bg-primary) text-(--text-primary)">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: coverY, scale: 1.15 }}>
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-[linear-gradient(135deg,#D4FF4F_0%,#222_50%,#0A0A0A_100%)]" />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-(--bg-primary) via-(--bg-primary)/40 to-black/40" />

        <div className="absolute top-24 left-0 right-0 z-10">
          <Container className="flex items-center justify-between">
            <span className="font-mono-utility text-mono-sm text-white/70">CREATORLYFF / CREATOR PROFILE</span>
            <LiveClock />
          </Container>
        </div>

        <motion.div className="relative z-10 h-full flex flex-col justify-end" style={{ y: contentY, opacity: contentOpacity }}>
          <Container className="pb-16">
            <motion.h1
              className="text-hero font-display leading-[0.9] tracking-[-0.05em]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            >
              {user.fullName || profile.youtubeChannelTitle || "Creator"}
            </motion.h1>

            <motion.div
              className="flex flex-wrap items-center gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
            >
              {avatarImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarImage} alt="" className="h-9 w-9 rounded-full object-cover border-2 border-white/30" />
              )}
              <span className="font-mono-utility text-mono-sm text-(--accent)">@{handle}</span>
              {verified && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
                  className="flex items-center gap-1.5 font-mono-utility text-mono-sm text-(--accent)"
                >
                  <BadgeCheck size={14} /> VERIFIED
                </motion.span>
              )}
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-2 mt-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
            >
              {profile.location && (
                <span className="flex items-center gap-1.5 font-mono-utility text-mono-sm text-white/70 border border-white/20 rounded-full px-3 py-1.5">
                  <MapPin size={11} /> {profile.location}
                </span>
              )}
              {niches.map((niche: string) => (
                <span key={niche} className="font-mono-utility text-mono-sm text-white/80 border border-white/20 rounded-full px-3 py-1.5">
                  {niche}
                </span>
              ))}
            </motion.div>
          </Container>
        </motion.div>
      </section>

      {/* ── STICKY INVITE CTA ── */}
      <AnimatePresence>
        {pastHero && (
          <motion.button
            onClick={handleSendProposal}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={cn(
              "fixed z-40 flex items-center justify-center gap-2 font-semibold text-sm bg-(--accent) text-(--bg-primary) hover:bg-(--accent-hover) transition-colors duration-200",
              "bottom-0 left-0 right-0 h-14 sm:bottom-6 sm:left-auto sm:right-6 sm:h-14 sm:rounded-full sm:px-7",
              "shadow-[0_0_40px_rgba(212,255,79,0.35)]"
            )}
            data-interactive
            data-cursor="Send Proposal"
          >
            Invite to Collaborate <ArrowRight size={14} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── 01 STATS ── */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionLabel n={sectionNumbers.stats}>BY THE NUMBERS</SectionLabel>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <CountUpStat target={combinedFollowers} format={(n) => formatNumber(n)} label="COMBINED FOLLOWERS" />
            <CountUpStat
              target={engagementRate || 0}
              format={(n) => (engagementRate ? `${n.toFixed(1)}%` : "—")}
              label="ENGAGEMENT RATE"
            />
            <CountUpStat target={avgViews || 0} format={(n) => (avgViews ? formatNumber(n) : "—")} label="AVG. VIDEO VIEWS" />
            <CountUpStat target={profileViews30d} format={(n) => formatNumber(n)} label="PROFILE VIEWS / 30D" />
          </div>
        </Container>
      </section>

      {/* ── 02 BIO ── */}
      {bio && (
        <section className="py-24 md:py-32 border-t border-(--border)">
          <Container className="grid lg:grid-cols-[1fr_200px] gap-10">
            <RevealOnScroll>
              <p className="text-h2 font-serif leading-snug text-(--text-secondary) max-w-3xl">{bio}</p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <span className="font-mono-utility text-mono-sm text-(--text-tertiary) block lg:text-right">
                {sectionNumbers.bio} — ABOUT
              </span>
            </RevealOnScroll>
          </Container>
        </section>
      )}

      {/* ── 03 PLATFORMS ── */}
      {platforms.length > 0 && (
        <section className="py-24 md:py-32 border-t border-(--border)">
          <Container>
            <SectionLabel n={sectionNumbers.platforms}>PLATFORMS</SectionLabel>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {platforms.map((p: any, i: number) => (
                <PlatformCard key={p.key} platform={p} delay={i * 0.06} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── 04 AUDIENCE ── */}
      <section className="py-24 md:py-32 border-t border-(--border)">
        <Container>
          <SectionLabel n={sectionNumbers.audience}>AUDIENCE</SectionLabel>
          <RevealOnScroll delay={0.1}>
            <div className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-12 text-center mt-6">
              <p className="text-body-lg text-(--text-secondary)">
                Sync a platform to see audience data — age, gender, and top locations will appear here once available.
              </p>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* ── 05 RECENT WORK ── */}
      {showcaseItems.length > 0 && (
        <section className="py-24 md:py-32 border-t border-(--border)">
          <Container>
            <SectionLabel n={sectionNumbers.showcase}>RECENT WORK</SectionLabel>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 mt-6">
              {showcaseItems.map((item: ShowcaseItem, i: number) => (
                <MasonryItem key={item.id} item={item} delay={(i % 6) * 0.05} onOpen={() => setLightboxIndex(i)} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── 06 RATES ── */}
      {pricingVisible && (
        <section className="py-24 md:py-32 border-t border-(--border)">
          <Container>
            <SectionLabel n={sectionNumbers.pricing}>RATES</SectionLabel>
            <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {(
                  [
                    { label: "Reel", value: profile.pricing?.reel },
                    { label: "Story", value: profile.pricing?.story },
                    { label: "Post", value: profile.pricing?.post },
                    { label: "YouTube integration", value: profile.pricing?.youtube },
                  ] as { label: string; value?: number }[]
                )
                  .filter((r) => r.value)
                  .map((r, i) => (
                    <RevealOnScroll key={r.label} delay={i * 0.06}>
                      <div className="p-6 rounded-2xl border border-(--border) bg-(--bg-secondary) card-hover">
                        <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">{r.label.toUpperCase()}</p>
                        <p className="text-h3 font-display tabular-nums">{formatINR(r.value)}</p>
                      </div>
                    </RevealOnScroll>
                  ))}
              </div>
              <RevealOnScroll delay={0.15}>
                <div className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-6 h-full flex flex-col justify-between gap-6">
                  <div>
                    {profile.openToNegotiation && (
                      <span className="inline-block font-mono-utility text-mono-sm text-(--accent) border border-(--accent)/40 rounded-full px-3 py-1.5 mb-4">
                        OPEN TO NEGOTIATION
                      </span>
                    )}
                    <p className="text-sm text-(--text-secondary)">
                      Every collaboration starts with a custom proposal — deliverables, timeline, and budget, tailored to your brief.
                    </p>
                  </div>
                  <button
                    onClick={handleSendProposal}
                    className="h-12 rounded-full bg-(--accent) text-(--bg-primary) font-semibold text-sm hover:bg-(--accent-hover) transition-colors duration-200 flex items-center justify-center gap-2"
                    data-interactive
                    data-cursor="Send Proposal"
                  >
                    {isAuthenticated && isBrand ? "Send Custom Proposal" : "Sign up as brand to send proposal"} <ArrowRight size={14} />
                  </button>
                </div>
              </RevealOnScroll>
            </div>
          </Container>
        </section>
      )}

      {/* ── 07 TRUSTED BY ── */}
      {pastCollaborations.length > 0 && (
        <section className="py-24 md:py-32 border-t border-(--border)">
          <Container>
            <SectionLabel n={sectionNumbers.collabs}>TRUSTED BY</SectionLabel>
            <RevealOnScroll delay={0.1}>
              <div className="flex flex-wrap items-center gap-x-12 gap-y-8 mt-8">
                {pastCollaborations.map((c) => (
                  <div key={c.name} className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                    {c.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.logoUrl} alt={c.name} className="h-8 w-auto object-contain" />
                    ) : (
                      <span className="font-display text-xl">{c.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      )}

      {/* ── 08 GET IN TOUCH ── */}
      <section className="py-32 md:py-40 border-t border-(--border)">
        <Container>
          <SectionLabel n={sectionNumbers.footer}>GET IN TOUCH</SectionLabel>
          <RevealOnScroll delay={0.1}>
            <h2 className="text-hero font-display leading-[0.9] tracking-[-0.05em] mt-6 max-w-3xl">
              Ready to work with <span className="font-serif text-(--accent)">{firstName}?</span>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.25}>
            <div className="flex flex-wrap items-center gap-6 mt-12">
              <button
                onClick={handleSendProposal}
                className="h-14 px-8 rounded-full bg-(--accent) text-(--bg-primary) font-semibold text-sm hover:bg-(--accent-hover) transition-colors duration-200 flex items-center gap-2"
                data-interactive
                data-cursor="Send Proposal"
              >
                Send Proposal <ArrowRight size={14} />
              </button>
              <ShareRow url={profileUrl} title={`${user.fullName} on CreatorLyff`} />
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      <Lightbox
        items={showcaseItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
