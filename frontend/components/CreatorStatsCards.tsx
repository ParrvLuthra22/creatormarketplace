import { DollarSign, Mail, Eye } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    subtext: string;
    icon: "money" | "mail" | "eye";
}

function StatsCard({ title, value, subtext, icon }: StatsCardProps) {
    const icons = {
        money: DollarSign,
        mail: Mail,
        eye: Eye,
    };

    const Icon = icons[icon];

    return (
        <div className="bg-[#141414] border border-[#1F1F1F] rounded-2xl p-6 hover:bg-[#1A1A1A] transition-colors">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-[11px] font-angelo uppercase text-[#6B6B6B] tracking-wide mb-2">
                        {title}
                    </p>
                    <p className="text-[32px] font-bold text-white font-angelo leading-none">
                        {value}
                    </p>
                    <p className="text-[13px] text-[#6B6B6B] mt-2">{subtext}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#1F1F1F] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </div>
        </div>
    );
}

interface CreatorStatsCardsProps {
    totalEarnings: number;
    pendingProposals: number;
    profileViews: number;
}

export function CreatorStatsCards({ totalEarnings, pendingProposals, profileViews }: CreatorStatsCardsProps) {
    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
                title="Total Earnings"
                value={formatCurrency(totalEarnings)}
                subtext="From 5 collaborations"
                icon="money"
            />
            <StatsCard
                title="New Proposals"
                value={pendingProposals}
                subtext="Awaiting your response"
                icon="mail"
            />
            <StatsCard
                title="Profile Views"
                value={profileViews}
                subtext="Last 30 days"
                icon="eye"
            />
        </div>
    );
}
