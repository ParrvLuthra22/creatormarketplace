"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { BrandDashboardLayout } from "@/components/BrandDashboardLayout";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { LegalModal } from "@/components/LegalModal";
import { DeleteAccountModal } from "@/components/DeleteAccountModal";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { updateUserProfile, updateBrandProfile } from "@/lib/api";

export default function BrandSettings() {
    const { user } = useAuth();
    const router = useRouter();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [newProposals, setNewProposals] = useState(true);
    const [profileViews, setProfileViews] = useState(false);
    const [marketingEmails, setMarketingEmails] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Form & UI state
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [companyName, setCompanyName] = useState(""); // Initialize in useEffect?
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Fetch and sync company name
    const [hasLoadedProfile, setHasLoadedProfile] = useState(false);
    const { profile, refreshProfile } = useAuth();

    if (!hasLoadedProfile && profile && user?.accountType === 'Brand') {
        setCompanyName((profile as any).companyName || "");
        setHasLoadedProfile(true);
    }

    const handleSave = async () => {
        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);
        try {
            // Update User (fullName)
            await updateUserProfile({ fullName });
            
            // Update Brand Profile (companyName)
            await updateBrandProfile({ companyName });
            
            await refreshProfile();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            setSaveError(err.message || "Failed to save changes");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/account`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            window.location.href = '/';
        } else {
            console.error("Failed to delete account");
            // Optionally show toast error here
        }
    };

    const handleCancelSubscription = async () => {
        if (!confirm("Are you sure you want to cancel your subscription? You'll keep access until the end of your billing period.")) {
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/cancel-subscription`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                window.location.reload();
            } else {
                alert(data.error || 'Failed to cancel subscription');
            }
        } catch (error) {
            console.error('Cancel subscription error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <RouteGuard allowedRole="brand">
            <BrandDashboardLayout variant="white">
                <div className="py-8">
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-none mb-10">Settings</h1>

                    {/* SECTION 1 - Plan & Billing */}
                    <div className="bg-white border border-zinc-100 rounded-sm p-10 mb-10 shadow-sm">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-8">Plan & Billing</h2>

                        {/* Current Plan Display */}
                        <div className="flex items-center justify-between py-8 border-b border-zinc-50">
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Current Plan</p>
                                <p className="text-3xl text-zinc-900 font-black mb-2 tracking-tight">
                                    {user?.plan === 'free' && 'Free Tier'}
                                    {user?.plan === 'basic' && 'Basic Tier'}
                                    {user?.plan === 'pro' && 'Pro Access'}
                                </p>
                                <p className="text-zinc-500 font-medium">
                                    {user?.plan === 'free' && 'Discover creators and build your network.'}
                                    {user?.plan === 'basic' && 'Unlock full discovery and insights.'}
                                    {user?.plan === 'pro' && 'Full featured collaboration and scaling suite.'}
                                </p>
                            </div>
                            <div className="shrink-0 ml-6">
                                <span className={`px-6 py-2.5 rounded-md text-[10px] font-black tracking-widest uppercase border ${
                                    user?.plan === 'free' ? 'text-zinc-400 border-zinc-100 bg-zinc-50' :
                                        user?.plan === 'basic' ? 'bg-[#FF4D00] text-white border-[#FF4D00] shadow-lg shadow-orange-500/20' :
                                            'bg-zinc-900 text-white border-zinc-900 shadow-xl'
                                    }`}>
                                    {user?.plan || 'FREE'}
                                </span>
                            </div>
                        </div>

                        {/* Upgrade / Manage Button */}
                        <div className="mt-10 flex flex-wrap gap-4">
                            {user?.plan !== 'pro' ? (
                                <button
                                    onClick={() => router.push('/pricing')}
                                    className="h-14 px-10 bg-[#FF4D00] text-white rounded-md font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/10"
                                >
                                    Upgrade Plan
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => router.push('/pricing')}
                                        className="h-14 px-10 bg-zinc-900 text-white rounded-md font-black text-sm uppercase tracking-widest hover:bg-zinc-800 transition-all"
                                    >
                                        Change Plan
                                    </button>
                                    <button
                                        onClick={handleCancelSubscription}
                                        className="h-14 px-10 bg-white border border-red-100 text-red-500 rounded-md font-black text-sm uppercase tracking-widest hover:bg-red-50 transition-all"
                                    >
                                        Cancel Subscription
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Proposal Credits (Pro only) */}
                        {user?.plan === 'pro' && (
                            <div className="mt-10 pt-10 border-t border-zinc-50">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Proposal Usage</p>
                                        <p className="text-sm text-zinc-900 font-black">8 of 10 Used</p>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">80%</p>
                                </div>
                                <div className="h-3 bg-zinc-50 rounded-full overflow-hidden border border-zinc-100">
                                    <div
                                        className="h-full bg-[#FF4D00] rounded-full shadow-sm transition-all"
                                        style={{ width: '80%' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 2 - Account Details */}
                    <div className="bg-white border border-zinc-100 rounded-sm p-10 mb-10 shadow-sm">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-10">Account Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                            {/* Full Name */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full h-15 bg-zinc-50 border border-zinc-100 rounded-md px-6 text-zinc-900 text-[15px] font-bold focus:outline-none focus:border-[#FF4D00] transition-colors shadow-inner"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue={user?.email || ""}
                                    disabled
                                    className="w-full h-15 bg-zinc-50/50 border border-zinc-100 rounded-md px-6 text-zinc-400 text-[15px] font-bold cursor-not-allowed italic"
                                />
                                <p className="text-[10px] text-zinc-300 font-black uppercase tracking-widest mt-3 px-1">Cannot be modified</p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-4">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="h-14 px-12 bg-[#FF4D00] text-white rounded-md font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/10 flex items-center justify-center gap-3 disabled:opacity-70"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>

                                {saveSuccess && (
                                    <div className="flex items-center gap-2 text-green-600 animate-in fade-in slide-in-from-left-4 duration-500">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="text-xs font-black uppercase tracking-widest">Profile Updated!</span>
                                    </div>
                                )}

                                {saveError && (
                                    <span className="text-xs font-black uppercase tracking-widest text-red-600">{saveError}</span>
                                )}
                            </div>

                            <button
                                onClick={() => setShowChangePassword(true)}
                                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all group w-fit"
                            >
                                Change Security Settings <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* SECTION 3 - Notifications */}
                    <div className="bg-white border border-zinc-100 rounded-sm p-10 mb-10 shadow-sm">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-8">Notifications</h2>

                        <div className="space-y-2">
                            {[
                                { label: "Email notifications", sub: "Receive proposal updates via email", state: emailNotifications, set: setEmailNotifications },
                                { label: "New proposals", sub: "Get dashboard alerts for new messages", state: newProposals, set: setNewProposals },
                                { label: "Profile views", sub: "See which creators are looking at your brand", state: profileViews, set: setProfileViews },
                                { label: "Marketing insights", sub: "Weekly tips to scale your influencer engine", state: marketingEmails, set: setMarketingEmails }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-6 border-b border-zinc-50 last:border-b-0 group px-6 -mx-6 hover:bg-zinc-50 rounded-md transition-all">
                                    <div>
                                        <p className="text-[15px] text-zinc-900 font-black mb-1.5 group-hover:text-[#FF4D00] transition-colors">{item.label}</p>
                                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">{item.sub}</p>
                                    </div>
                                    <button
                                        onClick={() => item.set(!item.state)}
                                        className={`w-14 h-8 rounded-full transition-all relative border ${item.state ? 'bg-[#FF4D00] border-[#FF4D00] shadow-lg shadow-orange-500/20' : 'bg-zinc-200 border-zinc-200'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-5.5 h-5.5 rounded-full bg-white transition-all shadow-sm ${item.state ? 'translate-x-6 scale-90' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-sm p-10 flex items-center justify-between shadow-sm mt-10">
                        <div>
                            <h2 className="text-2xl font-black text-red-600 tracking-tight mb-1.5">Danger Zone</h2>
                            <p className="text-sm text-red-400 font-medium">Permanently delete your account and all associated data.</p>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="h-14 px-10 bg-white border border-red-200 text-red-600 rounded-md font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </BrandDashboardLayout>

            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={showChangePassword}
                onClose={() => setShowChangePassword(false)}
            />

            {/* Delete Account Modal */}
            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
            />
        </RouteGuard>
    );
}
