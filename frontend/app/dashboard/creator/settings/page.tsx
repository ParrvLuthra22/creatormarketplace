"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { CreatorDashboardLayout } from "@/components/CreatorDashboardLayout";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { LegalModal } from "@/components/LegalModal";
import { DeleteAccountModal } from "@/components/DeleteAccountModal";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { updateUserProfile } from "@/lib/api";

export default function CreatorSettings() {
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
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);
        try {
            await updateUserProfile({ fullName });
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

    return (
        <RouteGuard allowedRole="creator">
            <CreatorDashboardLayout variant="white">
                <main className="max-w-4xl mx-auto py-8 transition-all duration-300">
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-none mb-10 lowercase">settings</h1>

                    {/* SECTION 1 - Account */}
                    <div className="bg-white border border-zinc-100 rounded-sm p-8 mb-8 shadow-sm">
                        <h2 className="text-xl font-black text-zinc-900 tracking-tight lowercase mb-8">account</h2>

                        <div className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 lowercase">full name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 rounded-md text-zinc-900 text-[15px] focus:outline-none focus:border-[#FF4D00] transition-all"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 lowercase">email address</label>
                                <input
                                    type="email"
                                    defaultValue={user?.email || ""}
                                    disabled
                                    className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 rounded-md text-zinc-400 text-[15px] opacity-60 cursor-not-allowed"
                                />
                                <p className="text-[10px] text-zinc-400 font-bold lowercase mt-2 ml-1">this address cannot be changed</p>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest lowercase">security</label>
                                    <button
                                        onClick={() => setShowChangePassword(true)}
                                        className="text-[10px] font-black text-[#FF4D00] uppercase tracking-widest hover:opacity-70 transition-opacity"
                                    >
                                        change password →
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="h-14 px-10 bg-zinc-900 text-white rounded-md font-black text-[11px] uppercase tracking-widest hover:bg-[#FF4D00] transition-all duration-300 shadow-lg shadow-zinc-900/10 flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    {isSaving ? "saving..." : "save changes"}
                                </button>

                                {saveSuccess && (
                                    <div className="flex items-center gap-1.5 text-green-600 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">saved!</span>
                                    </div>
                                )}

                                {saveError && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-600">{saveError}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2 - Notifications */}
                    <div className="bg-white border border-zinc-100 rounded-sm p-8 mb-8 shadow-sm">
                        <h2 className="text-xl font-black text-zinc-900 tracking-tight lowercase mb-8">notifications</h2>

                        <div className="space-y-2">
                            {/* Toggle 1 */}
                            <div className="flex justify-between items-center py-4 px-6 rounded-md hover:bg-zinc-50 transition-all group">
                                <div>
                                    <p className="text-sm font-bold text-zinc-900 lowercase tracking-tight">email notifications</p>
                                    <p className="text-[10px] text-zinc-400 font-bold lowercase">receive proposal and session emails</p>
                                </div>
                                <button
                                    onClick={() => setEmailNotifications(!emailNotifications)}
                                    className={`w-14 h-7 rounded-full transition-all relative ${emailNotifications ? 'bg-[#FF4D00]' : 'bg-zinc-200'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm ${emailNotifications ? 'translate-x-7' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {/* Toggle 2 */}
                            <div className="flex justify-between items-center py-4 px-6 rounded-md hover:bg-zinc-50 transition-all group">
                                <div>
                                    <p className="text-sm font-bold text-zinc-900 lowercase tracking-tight">new proposals</p>
                                    <p className="text-[10px] text-zinc-400 font-bold lowercase">get real-time alerts for opportunities</p>
                                </div>
                                <button
                                    onClick={() => setNewProposals(!newProposals)}
                                    className={`w-14 h-7 rounded-full transition-all relative ${newProposals ? 'bg-[#FF4D00]' : 'bg-zinc-200'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm ${newProposals ? 'translate-x-7' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {/* Toggle 3 */}
                            <div className="flex justify-between items-center py-4 px-6 rounded-md hover:bg-zinc-50 transition-all group">
                                <div>
                                    <p className="text-sm font-bold text-zinc-900 lowercase tracking-tight">profile views</p>
                                    <p className="text-[10px] text-zinc-400 font-bold lowercase">know who's checking out your work</p>
                                </div>
                                <button
                                    onClick={() => setProfileViews(!profileViews)}
                                    className={`w-14 h-7 rounded-full transition-all relative ${profileViews ? 'bg-[#FF4D00]' : 'bg-zinc-200'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm ${profileViews ? 'translate-x-7' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {/* Toggle 4 */}
                            <div className="flex justify-between items-center py-4 px-6 rounded-md hover:bg-zinc-50 transition-all group border-t border-zinc-100">
                                <div>
                                    <p className="text-sm font-bold text-zinc-900 lowercase tracking-tight">marketing updates</p>
                                    <p className="text-[10px] text-zinc-400 font-bold lowercase">tips to scale your creator journey</p>
                                </div>
                                <button
                                    onClick={() => setMarketingEmails(!marketingEmails)}
                                    className={`w-14 h-7 rounded-full transition-all relative ${marketingEmails ? 'bg-[#FF4D00]' : 'bg-zinc-200'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm ${marketingEmails ? 'translate-x-7' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3 - Danger Zone */}
                    <div className="bg-white border border-red-50 rounded-sm p-8 mb-8 shadow-sm">
                        <h2 className="text-xl font-black text-red-600 tracking-tight lowercase mb-4">danger zone</h2>
                        <p className="text-sm text-zinc-400 font-bold lowercase mb-8">once you delete your account, there is no going back. please be certain.</p>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-10 h-14 bg-red-50 text-red-600 rounded-md font-black text-[11px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300"
                        >
                            </button>
                    </div>
                </main>
            </CreatorDashboardLayout>

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
