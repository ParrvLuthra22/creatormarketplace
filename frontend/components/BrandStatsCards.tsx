import { IndianRupee, Users, Mail, ArrowUpRight, TrendingUp } from "lucide-react";

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
                    <div className={`flex items-center gap-1.5 text-[13px] font-semibold mt-2 ${trend.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{trend.value}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

interface BrandStatsCardsProps {
    totalSpend: number;
    creatorsHired: number;
    pendingProposals: number;
    onSpendClick?: () => void;
    onCreatorsClick?: () => void;
    onProposalsClick?: () => void;
}

export function BrandStatsCards({ totalSpend, creatorsHired, pendingProposals, onSpendClick, onCreatorsClick, onProposalsClick }: BrandStatsCardsProps) {
    const formatCurrency = (amount: number) => {
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}k`;
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
                title="Total Spend"
                value={formatCurrency(totalSpend)}
                subtext={`Across ${creatorsHired} collaborations`}
                icon={IndianRupee}
                trend={{ value: "18% from last month", positive: true }}
                clickable={!!onSpendClick}
                onClick={onSpendClick}
            />
            <StatsCard
                title="Creators Hired"
                value={creatorsHired}
                subtext="Active partnerships"
                icon={Users}
                clickable={!!onCreatorsClick}
                onClick={onCreatorsClick}
            />
            <StatsCard
                title="Pending Proposals"
                value={pendingProposals}
                subtext="Awaiting response"
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
                clickable={!!onProposalsClick}
                onClick={onProposalsClick}
            />
        </div>
    );
}
