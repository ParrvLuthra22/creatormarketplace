"use client";

import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
    userName: string;
    userAvatar?: string;
    children: ReactNode;
    rightSidebar?: ReactNode;
}

export function DashboardLayout({ userName, userAvatar, children, rightSidebar }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#F5F1E8]">
            {/* Left Sidebar */}
            <DashboardSidebar userName={userName} userAvatar={userAvatar} />

            {/* Main Content Area */}
            <div className="ml-[220px] mr-[300px] min-h-screen transition-colors duration-300">
                <main className="p-8">
                    {children}
                </main>
            </div>

            {/* Right Sidebar */}
            {rightSidebar && (
                <aside className="w-[300px] h-screen fixed right-0 top-0 p-8 overflow-y-auto z-50 bg-[#0F0F0F] border-l border-[#1F1F1F]">
                    {rightSidebar}
                </aside>
            )}
        </div>
    );
}
