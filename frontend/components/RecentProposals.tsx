import { Proposal } from "@/lib/brandData";

interface RecentProposalsProps {
    proposals: Proposal[];
}

export function RecentProposals({ proposals }: RecentProposalsProps) {
    const getStatusColor = (status: Proposal['status']) => {
        switch (status) {
            case 'Sent':
                return 'bg-blue-100 text-blue-700';
            case 'Viewed':
                return 'bg-yellow-100 text-yellow-700';
            case 'Accepted':
                return 'bg-green-100 text-green-700';
            case 'Declined':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Proposals</h2>

            <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Creator
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Niche
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Budget
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sent Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {proposals.map((proposal) => (
                                <tr key={proposal.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF6B9D] flex items-center justify-center text-white font-semibold text-sm">
                                                {proposal.creatorAvatar}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{proposal.creatorName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-700">{proposal.niche}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-semibold text-gray-900">
                                            ₹{proposal.budget.toLocaleString('en-IN')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">{formatDate(proposal.sentDate)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(proposal.status)}`}>
                                            {proposal.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button className="text-[#FF6B35] hover:text-[#FF5722] font-medium">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {proposals.map((proposal) => (
                        <div key={proposal.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF6B9D] flex items-center justify-center text-white font-semibold text-sm">
                                        {proposal.creatorAvatar}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{proposal.creatorName}</p>
                                        <p className="text-xs text-gray-500">{proposal.niche}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(proposal.status)}`}>
                                    {proposal.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="text-gray-600">Budget: <span className="font-semibold text-gray-900">₹{proposal.budget.toLocaleString('en-IN')}</span></p>
                                    <p className="text-xs text-gray-500 mt-1">Sent: {formatDate(proposal.sentDate)}</p>
                                </div>
                                <button className="text-[#FF6B35] hover:text-[#FF5722] font-medium text-sm">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {proposals.length === 0 && (
                <div className="bg-white rounded-md shadow-sm border border-gray-100 p-12 text-center">
                    <p className="text-gray-500">No proposals yet.</p>
                    <p className="text-sm text-gray-400 mt-2">Start discovering creators to send your first proposal!</p>
                </div>
            )}
        </div>
    );
}
