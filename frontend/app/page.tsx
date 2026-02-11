"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CreatorSection } from "@/components/CreatorSection";
import { AuthModal } from "@/components/AuthModal";
import { AuthGateModal } from "@/components/AuthGateModal";
import { useAuth } from "@/contexts/AuthContext";
import { getPublicCreators, PublicCreator } from "@/lib/api";
import { Search } from "lucide-react";

const FILTER_NICHES = ["All", "Fashion", "Fitness", "Tech", "Beauty", "Food", "Travel", "Comedy", "Finance"];

export default function Home() {
  const { user, logout, isBrand, isCreator, loading, modalState, setModalState } = useAuth();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [creators, setCreators] = useState<PublicCreator[]>([]);
  const [creatorsLoading, setCreatorsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch creators from public API
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await getPublicCreators();
        setCreators(response.creators);
        setIsAuthenticated(response.authenticated);
      } catch (error) {
        console.error("Failed to fetch creators:", error);
        setCreators([]);
      } finally {
        setCreatorsLoading(false);
      }
    };

    fetchCreators();
  }, []);

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = searchQuery === "" ||
      (creator.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (creator.instagramHandle?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Redirect logged-in users to their respective dashboards
  useEffect(() => {
    if (!loading && user) {
      if (isBrand) {
        router.push('/dashboard/brand');
      } else if (isCreator) {
        router.push('/dashboard/creator');
      }
    }
  }, [user, isBrand, isCreator, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAuthGate = () => {
    setModalState('authGate');
  };

  const handleOpenLogin = () => {
    setModalState('login');
  };

  const handleOpenSignup = () => {
    setModalState('signup');
  };

  const handleCloseModal = () => {
    setModalState(null);
  };

  // Handler for "Show More Creators" button
  const handleShowMore = () => {
    if (!isAuthenticated) {
      handleAuthGate();
    } else {
      // If already authenticated (should be redirected by useEffect, but just in case)
      router.push('/dashboard/brand');
    }
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D084]"></div>
          <p className="text-[#6B6B6B] text-sm font-angelo">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, they will be redirected - show loading
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D084]"></div>
          <p className="text-[#6B6B6B] text-sm font-angelo">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F1E8]">
      <Header
        user={user}
        onLoginClick={handleOpenLogin}
        onSignupClick={handleOpenSignup}
        onLogoutClick={handleLogout}
      />

      <div className="flex flex-col items-center pt-0">

        {/* Hero Section */}
        <div className="hero-section text-center px-5 pt-12 pb-8 md:pt-16 md:pb-10">
          <h1 className="hero-heading text-[48px] md:text-[64px] text-[#F5F1E8] mb-4 tracking-[-1px]" style={{ fontFamily: 'Milker, sans-serif' }}>
            Find the right creator
          </h1>
          <p className="hero-subtext text-[16px] md:text-[18px] text-[#C5C5C5] mb-6 hidden sm:block font-sf-pro font-light">
            Browse Instagram creators who match your brand
          </p>
          <div className="trust-pills hidden sm:flex items-center justify-center gap-4 mt-2">
            <div className="pill bg-[#141414] border border-[#2A2A2A] rounded-[20px] px-[16px] py-[8px] text-[13px] text-[#C5C5C5] font-angelo tracking-wide">
              ✓ 50+ Creators
            </div>
            <div className="pill bg-[#141414] border border-[#2A2A2A] rounded-[20px] px-[16px] py-[8px] text-[13px] text-[#C5C5C5] font-angelo tracking-wide">
              ✓ Real engagement data
            </div>
            <div className="pill bg-[#141414] border border-[#2A2A2A] rounded-[20px] px-[16px] py-[8px] text-[13px] text-[#C5C5C5] font-angelo tracking-wide">
              ✓ No agency fees
            </div>
          </div>
        </div>

        {/* Search and Filters Container */}
        <div className="container mx-auto max-w-4xl px-4 mt-0 mb-8">

          {/* SEARCH BAR */}
          <div className="mb-8">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B] group-focus-within:text-[#00D084] transition-colors" />
              <input
                type="text"
                placeholder="Search creators by name or handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-14 pr-6 bg-[#141414] border border-[#2A2A2A] rounded-2xl text-[#F5F1E8] text-sm focus:outline-none focus:border-[#00D084] focus:ring-1 focus:ring-[#00D084]/20 transition-all placeholder:text-[#6B6B6B] shadow-lg shadow-black/20"
              />
            </div>
          </div>

          {/* FILTER PILLS */}
          <div className="flex flex-wrap gap-2.5 justify-center mb-4">
            {FILTER_NICHES.map(niche => (
              <button
                key={niche}
                onClick={() => setSelectedFilter(niche)}
                className={`px-5 py-2.5 rounded-full text-xs font-angelo tracking-wider transition-all duration-300 border ${selectedFilter === niche
                  ? "bg-[#00D084] text-[#0A0A0A] border-[#00D084] shadow-[0_0_15px_rgba(0,208,132,0.4)]"
                  : "bg-[#141414] text-[#C5C5C5] border-[#2A2A2A] hover:border-[#00D084]/50 hover:text-white hover:bg-[#1A1A1A]"
                  }`}
              >
                {niche}
              </button>
            ))}
          </div>
        </div>

        {/* Creator Discovery Section - visible to unauthenticated users (potential brands) */}
        {creatorsLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D084]"></div>
            <p className="text-[#6B6B6B] text-sm mt-4 font-angelo tracking-widest uppercase">Loading creators...</p>
          </div>
        ) : (
          <CreatorSection
            creators={filteredCreators}
            isAuthenticated={isAuthenticated}
            onAuthGate={handleAuthGate}
            onShowMore={handleShowMore}
          />
        )}
      </div>

      {/* Auth Gate Modal */}
      <AuthGateModal
        isOpen={modalState === 'authGate'}
        onClose={handleCloseModal}
        onLogin={handleOpenLogin}
        onSignup={handleOpenSignup}
      />

      {/* Auth Modal (Login/Signup) */}
      <AuthModal
        isOpen={modalState === 'login' || modalState === 'signup'}
        onClose={handleCloseModal}
        initialTab={modalState === 'login' ? 'login' : 'signup'}
      />

      {/* Footer */}
      <Footer />

      {/* Hero Section Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .hero-heading {
            font-size: 36px;
            line-height: 1.1;
          }
          .hero-subtext {
            font-size: 14px;
          }
        }
        
        @media (max-width: 480px) {
          .hero-heading {
            font-size: 32px;
          }
          .hero-subtext,
          .trust-pills {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}
