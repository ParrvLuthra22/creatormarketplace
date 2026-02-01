"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { LegalModal } from "@/components/LegalModal";
import { DeleteAccountModal } from "@/components/DeleteAccountModal";
import { ArrowRight } from "lucide-react";

export default function BrandSettings() {
    const { user } = useAuth();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [newProposals, setNewProposals] = useState(true);
    const [profileViews, setProfileViews] = useState(false);
    const [marketingEmails, setMarketingEmails] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        <RouteGuard allowedRole="brand">
            <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
                <div className="hidden md:block">
                    <DashboardSidebar
                        userName={user?.fullName || "Brand User"}
                        userAvatar={user?.fullName?.charAt(0).toUpperCase()}
                    />
                </div>

                <main className="flex-1 overflow-y-auto px-4 md:px-7 py-6 md:py-8 pb-24 md:pb-8 md:ml-[220px]">
                    <h1 className="text-[28px] font-bold text-white font-milker mb-8">Settings</h1>

                    {/* SECTION 1 - Account */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-7 mb-6">
                        <h2 className="text-lg font-bold text-white font-milker mb-5">Account</h2>

                        <div className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue={user?.fullName || ""}
                                    className="w-full h-11 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-[10px] text-white text-sm focus:outline-none focus:border-white transition-colors"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Email</label>
                                <input
                                    type="email"
                                    defaultValue={user?.email || ""}
                                    disabled
                                    className="w-full h-11 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-[10px] text-white text-sm opacity-60 cursor-not-allowed"
                                />
                                <p className="text-[11px] text-[#3D3D3D] font-angelo mt-1">Cannot be changed</p>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs uppercase text-[#6B6B6B] font-angelo">Password</label>
                                    <button
                                        onClick={() => setShowChangePassword(true)}
                                        className="text-xs text-white font-angelo hover:opacity-85 transition-opacity"
                                    >
                                        Change password →
                                    </button>
                                </div>
                            </div>

                            <button className="mt-2 px-6 h-11 bg-white text-black rounded-[10px] font-angelo text-sm font-semibold hover:opacity-85 transition-opacity">
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* SECTION 2 - Notifications */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-7 mb-6">
                        <h2 className="text-lg font-bold text-white font-milker mb-5">Notifications</h2>

                        <div>
                            {/* Toggle 1 */}
                            <div className="flex justify-between items-center py-3.5 border-b border-[#1F1F1F]">
                                <div>
                                    <p className="text-sm text-white">Email notifications</p>
                                    <p className="text-xs text-[#6B6B6B]">Receive proposal emails</p>
                                </div>
                                <button
                                    onClick={() => setEmailNotifications(!emailNotifications)}
                                    className={`w-12 h-6 rounded-full transition-colors ${emailNotifications ? 'bg-white' : 'bg-[#2A2A2A]'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full transition-transform ${emailNotifications ? 'bg-black translate-x-6' : 'bg-[#6B6B6B] translate-x-0.5'}`} />
                                </button>
                            </div>

                            {/* Toggle 2 */}
                            <div className="flex justify-between items-center py-3.5 border-b border-[#1F1F1F]">
                                <div>
                                    <p className="text-sm text-white">New proposals</p>
                                    <p className="text-xs text-[#6B6B6B]">Get notified for new proposals</p>
                                </div>
                                <button
                                    onClick={() => setNewProposals(!newProposals)}
                                    className={`w-12 h-6 rounded-full transition-colors ${newProposals ? 'bg-white' : 'bg-[#2A2A2A]'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full transition-transform ${newProposals ? 'bg-black translate-x-6' : 'bg-[#6B6B6B] translate-x-0.5'}`} />
                                </button>
                            </div>

                            {/* Toggle 3 */}
                            <div className="flex justify-between items-center py-3.5 border-b border-[#1F1F1F]">
                                <div>
                                    <p className="text-sm text-white">Profile views</p>
                                    <p className="text-xs text-[#6B6B6B]">Know who viewed your profile</p>
                                </div>
                                <button
                                    onClick={() => setProfileViews(!profileViews)}
                                    className={`w-12 h-6 rounded-full transition-colors ${profileViews ? 'bg-white' : 'bg-[#2A2A2A]'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full transition-transform ${profileViews ? 'bg-black translate-x-6' : 'bg-[#6B6B6B] translate-x-0.5'}`} />
                                </button>
                            </div>

                            {/* Toggle 4 */}
                            <div className="flex justify-between items-center py-3.5">
                                <div>
                                    <p className="text-sm text-white">Marketing emails</p>
                                    <p className="text-xs text-[#6B6B6B]">Tips and updates</p>
                                </div>
                                <button
                                    onClick={() => setMarketingEmails(!marketingEmails)}
                                    className={`w-12 h-6 rounded-full transition-colors ${marketingEmails ? 'bg-white' : 'bg-[#2A2A2A]'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full transition-transform ${marketingEmails ? 'bg-black translate-x-6' : 'bg-[#6B6B6B] translate-x-0.5'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3 - Danger Zone */}
                    <div className="bg-[#141414] border border-[#2A1A1A] rounded-[14px] p-7">
                        <h2 className="text-lg font-bold text-white font-milker mb-5">Danger Zone</h2>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-6 h-11 bg-transparent border border-[#2A1A1A] text-white rounded-[10px] font-angelo text-[13px] hover:bg-[#2A1A1A]/20 transition-colors"
                        >
                            Delete Account
                        </button>
                    </div>

                    {/* SECTION 4 - Privacy Policy */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-7">
                        <h2 className="text-lg font-bold text-white font-milker mb-2">Privacy Policy</h2>
                        <p className="text-[13px] text-[#6B6B6B] mb-4">How we collect, use, and protect your data</p>

                        <div
                            onClick={() => setShowPrivacyModal(true)}
                            className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-[10px] px-[18px] py-3.5 cursor-pointer hover:bg-[#1A1A1A] transition-colors flex items-center justify-between group"
                        >
                            <span className="text-sm font-angelo text-white">Read Privacy Policy</span>
                            <ArrowRight className="w-[18px] h-[18px] text-[#6B6B6B] group-hover:text-white transition-colors" />
                        </div>

                        <p className="text-[11px] text-[#3D3D3D] mt-2">Last updated: January 15, 2026</p>
                    </div>

                    {/* SECTION 5 - Terms of Service */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-7">
                        <h2 className="text-lg font-bold text-white font-milker mb-2">Terms of Service</h2>
                        <p className="text-[13px] text-[#6B6B6B] mb-4">Rules and conditions for using CreatorSync</p>

                        <div
                            onClick={() => setShowTermsModal(true)}
                            className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-[10px] px-[18px] py-3.5 cursor-pointer hover:bg-[#1A1A1A] transition-colors flex items-center justify-between group"
                        >
                            <span className="text-sm font-angelo text-white">Read Terms of Service</span>
                            <ArrowRight className="w-[18px] h-[18px] text-[#6B6B6B] group-hover:text-white transition-colors" />
                        </div>

                        <p className="text-[11px] text-[#3D3D3D] mt-2">Last updated: January 15, 2026</p>
                    </div>
                </main>

                <aside className="hidden lg:block w-[280px]" />

                <MobileBottomNav role="brand" />
            </div>

            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={showChangePassword}
                onClose={() => setShowChangePassword(false)}
            />

            {/* Legal Modals */}
            <LegalModal
                isOpen={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
                type="privacy"
            />
            <LegalModal
                isOpen={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                type="terms"
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
