"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CreatorSection } from "@/components/CreatorSection";
import { AuthModal } from "@/components/AuthModal";
import { AuthGateModal } from "@/components/AuthGateModal";
import { useAuth } from "@/contexts/AuthContext";
import { CREATORS } from "@/lib/data";
import { Search } from "lucide-react";

const FILTER_NICHES = ["All", "Fashion", "Fitness", "Tech", "Beauty", "Food", "Travel", "Comedy", "Finance"];

export default function Home() {
  const { user, logout, isBrand, isCreator, loading, modalState, setModalState } = useAuth();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCreators = CREATORS.filter(creator => {
    const matchesNiche = selectedFilter === "All" || creator.niches.includes(selectedFilter);
    const matchesSearch = searchQuery === "" ||
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.handle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNiche && matchesSearch;
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

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-[#6B6B6B] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, they will be redirected - show loading
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-[#6B6B6B] text-sm">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Header
        user={user}
        onLoginClick={handleOpenLogin}
        onSignupClick={handleOpenSignup}
        onLogoutClick={handleLogout}
      />

      <div className="flex flex-col items-center pt-0">

        {/* Hero Section */}
        <div className="hero-section text-center px-5 pt-12 pb-8 md:pt-12 md:pb-8">
          <h1 className="hero-heading text-[34px] md:text-[28px] text-white mb-2" style={{ fontFamily: 'Milker, sans-serif' }}>
            Find the right creator
          </h1>
          <p className="hero-subtext text-[16px] md:text-[14px] text-[#6B6B6B] mb-2 hidden sm:block">
            Browse Instagram creators who match your brand
          </p>
          <div className="trust-pills hidden sm:flex items-center justify-center gap-4 mt-2">
            <div className="pill bg-[#141414] border border-[#1F1F1F] rounded-[20px] px-[14px] py-[6px] text-[13px] text-[#6B6B6B]">
              ✓ 50+ Creators
            </div>
            <div className="pill bg-[#141414] border border-[#1F1F1F] rounded-[20px] px-[14px] py-[6px] text-[13px] text-[#6B6B6B]">
              ✓ Real engagement data
            </div>
            <div className="pill bg-[#141414] border border-[#1F1F1F] rounded-[20px] px-[14px] py-[6px] text-[13px] text-[#6B6B6B]">
              ✓ No agency fees
            </div>
          </div>
        </div>

        {/* Search and Filters Container */}
        <div className="container mx-auto max-w-4xl px-4 mt-0 mb-2">

          {/* SEARCH BAR */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
              <input
                type="text"
                placeholder="Search creators by name or handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-[#141414] border border-[#1F1F1F] rounded-xl text-white text-sm focus:outline-none focus:border-[#3D3D3D] transition-colors"
              />
            </div>
          </div>

          {/* FILTER PILLS */}
          <div className="flex flex-wrap gap-2 mb-2">
            {FILTER_NICHES.map(niche => (
              <button
                key={niche}
                onClick={() => setSelectedFilter(niche)}
                className={`px-4 py-2 rounded-full text-xs font-angelo transition-colors ${selectedFilter === niche
                  ? "bg-white text-black"
                  : "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]"
                  }`}
              >
                {niche}
              </button>
            ))}
          </div>
        </div>

        {/* Creator Discovery Section - visible to unauthenticated users (potential brands) */}
        <CreatorSection
          creators={filteredCreators}
          onViewProfile={() => { }} // Not used when not authenticated
          isAuthenticated={false}
          onAuthGate={handleAuthGate}
        />
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
            font-size: 28px;
          }
          .hero-subtext {
            font-size: 14px;
          }
        }
        
        @media (max-width: 480px) {
          .hero-heading {
            font-size: 24px;
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
