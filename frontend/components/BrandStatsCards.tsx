import { IndianRupee, Users, Mail, ArrowUpRight } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    subtext: string;
    icon: "money" | "users" | "mail";
}

function StatsCard({ title, value, subtext, icon }: StatsCardProps) {
    const icons = {
        money: IndianRupee,
        users: Users,
        mail: Mail,
    };

    const Icon = icons[icon];

    return (
        <div className="group relative bg-white border border-zinc-200 rounded-md p-6 shadow-sm transition-all duration-300 hover:border-[#FF4D00] overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -top-5 -right-5 w-30 h-30 rounded-full bg-[radial-gradient(circle,rgba(255,69,0,0.08)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-[#FF4D00]" />
                        </div>
                        <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                            {title}
                        </p>
                    </div>
                    <p className="text-[32px] font-bold text-black leading-none tracking-tight">
                        {value}
                    </p>
                    <p className="text-[13px] text-[#6B6B6B] mt-3">
                        {subtext}
                    </p>
                </div>
                <div className="absolute top-5 right-5 text-[#6AFB00] opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-[#6B6B6B]" />
                </div>
            </div>
        </div>
    );
}

interface BrandStatsCardsProps {
    totalSpend: number;
    creatorsHired: number;
    pendingProposals: number;
}

export function BrandStatsCards({ totalSpend, creatorsHired, pendingProposals }: BrandStatsCardsProps) {
    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
                title="Total Spend"
                value={formatCurrency(totalSpend)}
                subtext={`Across ${creatorsHired} collaborations`}
                icon="money"
            />
            <StatsCard
                title="Creators Hired"
                value={creatorsHired}
                subtext="View all collaborations"
                icon="users"
            />
            <StatsCard
                title="Pending"
                value={pendingProposals}
                subtext="Awaiting response"
                icon="mail"
            />
        </div>
    );
}
