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
        <div className="min-h-screen bg-[#F4EFE6] text-black">
            {/* Left Sidebar */}
            <DashboardSidebar userName={userName} userAvatar={userAvatar} />

            {/* Main Content Area */}
            <div className="ml-[252px] mr-4 min-h-screen transition-colors duration-300">
                <main className="p-[32px] px-[40px]">
                    {children}
                </main>
            </div>
        </div>
    );
}
