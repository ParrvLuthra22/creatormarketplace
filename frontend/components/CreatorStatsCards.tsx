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
            className={`group relative bg-gradient-to-br from-[#1A1A1A] via-[#141414] to-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-7 transition-all duration-300 hover:border-[#00D084] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,208,132,0.15)] overflow-hidden ${clickable ? 'cursor-pointer hover:-translate-y-1' : ''}`}
        >
            {/* Background Decoration */}
            <div className="absolute -top-5 -right-5 w-[120px] h-[120px] rounded-full bg-[radial-gradient(circle,rgba(0,208,132,0.05)_0%,transparent_70%)] pointer-events-none" />

            {/* Hover Arrow for Clickable Cards */}
            {clickable && (
                <div className="absolute top-6 right-6 text-[#6B6B6B] opacity-0 group-hover:opacity-100 group-hover:text-[#00D084] group-hover:translate-x-0.5 transition-all duration-300">
                    <ArrowUpRight className="w-[18px] h-[18px]" />
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(0,208,132,0.1)] flex items-center justify-center border border-[rgba(0,208,132,0.15)]">
                        <Icon className="w-4 h-4 text-[#00D084]" />
                    </div>
                    <span className="text-[11px] font-sans text-[#6B6B6B] lowercase">
                        {title}
                    </span>
                </div>
                {action && <div>{action}</div>}
            </div>

            {/* Value */}
            <div className="mb-3 relative z-10">
                <h3 className="text-[48px] font-bold text-[#F5F1E8] font-sans leading-none tracking-[-1px] lowercase">
                    {value}
                </h3>
            </div>

            {/* Subtext & Trend */}
            <div className="flex flex-col gap-1 relative z-10">
                <p className="text-sm text-[#6B6B6B] font-sf-pro lowercase">
                    {subtext}
                </p>

                {trend && (
                    <div className={`flex items-center gap-1.5 text-[13px] font-sf-pro mt-2 ${trend.positive ? 'text-[#00D084]' : 'text-[#FF4757]'}`}>
                        {trend.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span className="lowercase">{trend.value}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-[1400px] mx-auto">
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
                        <div className="px-2 py-1 bg-[rgba(255,176,32,0.15)] border border-[rgba(255,176,32,0.3)] rounded-md">
                            <span className="text-[10px] font-sans text-[#FFB020] lowercase">
                                {Math.ceil(pendingProposals / 2)} expire soon
                            </span>
                        </div>
                    )
                }
                clickable={true}
                onClick={onProposalsClick}
            />

            {/* CARD 3: STATUS */}
            <div className="group relative bg-gradient-to-br from-[#1A1A1A] via-[#141414] to-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#00D084] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,208,132,0.15)] overflow-hidden">
                <div className="absolute -top-5 -right-5 w-[120px] h-[120px] rounded-full bg-[radial-gradient(circle,rgba(0,208,132,0.05)_0%,transparent_70%)] pointer-events-none" />

                <div className="flex justify-between items-start mb-5 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[rgba(0,208,132,0.1)] flex items-center justify-center border border-[rgba(0,208,132,0.15)]">
                            <CheckCircle className="w-4 h-4 text-[#00D084]" />
                        </div>
                        <span className="text-[11px] font-sans text-[#6B6B6B] lowercase">
                            status
                        </span>
                    </div>
                    {/* Toggle Switch */}
                    <div
                        onClick={onToggleStatus}
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${isActive ? 'bg-[#00D084]' : 'bg-[#2A2A2A]'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                </div>

                <div className="mb-3 relative z-10">
                    <h3 className="text-[32px] font-bold text-[#F5F1E8] font-sans leading-tight tracking-[-0.5px] lowercase">
                        {isActive ? "accepting" : "not accepting"}
                    </h3>
                </div>

                <div className="flex flex-col gap-1 relative z-10">
                    <p className="text-sm text-[#6B6B6B] font-sf-pro lowercase">
                        {isActive ? "you are visible to brands" : "your profile is hidden"}
                    </p>
                </div>
            </div>
        </div>
    );
}
