import { DollarSign, Mail, CheckCircle, ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    subtext: string;
    icon: any;
    trend?: {
        value: string;
        positive: boolean;
    };
    action?: React.ReactNode;
    clickable?: boolean;
    onClick?: () => void;
}

function StatsCard({ title, value, subtext, icon: Icon, trend, action, clickable, onClick }: StatsCardProps) {
    return (
        <div
            onClick={clickable ? onClick : undefined}
            className={`group relative bg-white border border-zinc-200 rounded-md p-6 shadow-sm transition-all duration-300 hover:border-[#FF4D00] overflow-hidden ${clickable ? 'cursor-pointer hover:-translate-y-1' : ''}`}
        >
            {/* Background Decoration */}
            <div className="absolute -top-5 -right-5 w-30 h-30 rounded-full bg-[radial-gradient(circle,rgba(255,69,0,0.08)_0%,transparent_70%)] pointer-events-none" />

            {/* Hover Arrow for Clickable Cards */}
            {clickable && (
                <div className="absolute top-5 right-5 text-[#6B6B6B] opacity-0 group-hover:opacity-100 group-hover:text-black group-hover:translate-x-0.5 transition-all duration-300">
                    <ArrowUpRight className="w-4.5 h-4.5" />
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center text-black">
                        <Icon className="w-4 h-4 text-[#FF4D00]" />
                    </div>
                    <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                        {title}
                    </span>
                </div>
                {action && <div>{action}</div>}
            </div>

            {/* Value */}
            <div className="mb-1.5 relative z-10">
                <h3 className="text-[32px] font-bold text-black leading-none tracking-tight">
                    {value}
                </h3>
            </div>

            {/* Subtext & Trend */}
            <div className="flex flex-col gap-1 relative z-10">
                <p className="text-[13px] text-[#6B6B6B]">
                    {subtext}
                </p>

                {trend && (
                    <div className={`flex items-center gap-1.5 text-[13px] font-semibold mt-2 ${trend.positive ? 'text-black' : 'text-black/80'}`}>
                        {trend.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span>{trend.value}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

interface CreatorStatsCardsProps {
    totalEarnings: number;
    pendingProposals: number;
    isActive?: boolean;
    onToggleStatus?: () => void;
    onEarningsClick?: () => void;
    onProposalsClick?: () => void;
}

export function CreatorStatsCards({ totalEarnings, pendingProposals, isActive = true, onToggleStatus, onEarningsClick, onProposalsClick }: CreatorStatsCardsProps) {
    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
            {/* CARD 1: TOTAL EARNINGS */}
            <StatsCard
                title="Total Earnings"
                value={formatCurrency(totalEarnings)}
                subtext="from 5 collaborations"
                icon={DollarSign}
                trend={{ value: "18% from last month", positive: true }}
                clickable={true}
                onClick={onEarningsClick}
            />

            {/* CARD 2: NEW PROPOSALS */}
            <StatsCard
                title="New Proposals"
                value={pendingProposals}
                subtext="awaiting your response"
                icon={Mail}
                action={
                    pendingProposals > 0 && (
                        <div className="px-2 py-1 bg-yellow-100 border border-yellow-200 rounded-md">
                            <span className="text-[10px] font-bold text-black uppercase tracking-wider">
                                {Math.ceil(pendingProposals / 2)} expire soon
                            </span>
                        </div>
                    )
                }
                clickable={true}
                onClick={onProposalsClick}
            />

            {/* CARD 3: STATUS */}
            <div
                className="bg-white border border-zinc-200 p-6 rounded-md shadow-sm hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-pointer hover:border-[#FF4D00]"
                onClick={onToggleStatus}
            >
                <div className="absolute -top-5 -right-5 w-30 h-30 rounded-full bg-[radial-gradient(circle,rgba(255,69,0,0.08)_0%,transparent_70%)] pointer-events-none" />

                <div className="flex justify-between items-start mb-3 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-[#FF4D00]" />
                        </div>
                        <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                            status
                        </span>
                    </div>
                    {/* Toggle Switch */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus?.();
                        }}
                        className={`w-14 h-7 rounded-full transition-all relative ${isActive ? 'bg-[#FF4D00]' : 'bg-zinc-200'}`}
                    >
                        <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm ${isActive ? 'translate-x-7' : 'translate-x-0'}`} />
                    </div>
                </div>

                <div className="mb-1.5 relative z-10">
                    <h3 className="text-[18px] font-bold text-black leading-tight tracking-tight">
                        {isActive ? "Accepting" : "Not Accepting"}
                    </h3>
                </div>

                <div className="flex flex-col gap-1 relative z-10">
                    <p className="text-[13px] text-[#6B6B6B]">
                        {isActive ? "You are visible to brands" : "Your profile is hidden"}
                    </p>
                </div>
            </div>
        </div>
    );
}
