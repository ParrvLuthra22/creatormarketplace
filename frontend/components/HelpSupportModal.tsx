"use client";

import { X, Mail, MessageCircle, FileText } from "lucide-react";
import { useState } from "react";

interface HelpSupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HelpSupportModal({ isOpen, onClose }: HelpSupportModalProps) {
    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    if (!isOpen) return null;

    const faqs = [
        {
            question: "how do i get paid?",
            answer: "payments are processed securely through stripe. once a brand approves your deliverables, funds are released to your connected account within 2-3 business days."
        },
        {
            question: "can i edit a proposal?",
            answer: "once a proposal is sent, it cannot be edited. if you need to make changes, please withdraw the proposal and submit a new one."
        },
        {
            question: "how is my creator score calculated?",
            answer: "your score is based on response time, job completion rate, and brand ratings. consistently delivering high-quality work improves your visibility."
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#1F1F1F]">
                    <h2 className="text-xl font-bold font-milker text-[#F5F1E8] lowercase">help & support</h2>
                    <button
                        onClick={onClose}
                        className="text-[#6B6B6B] hover:text-[#F5F1E8] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-[rgba(245,241,232,0.03)] border border-[#1F1F1F] hover:border-[#00D084] hover:bg-[rgba(0,208,132,0.05)] transition-all group">
                            <Mail className="w-6 h-6 text-[#00D084] mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-sf-pro text-[#F5F1E8] lowercase">email support</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-[rgba(245,241,232,0.03)] border border-[#1F1F1F] hover:border-[#00D084] hover:bg-[rgba(0,208,132,0.05)] transition-all group">
                            <FileText className="w-6 h-6 text-[#00D084] mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-sf-pro text-[#F5F1E8] lowercase">documentation</span>
                        </button>
                    </div>

                    {/* FAQs */}
                    <h3 className="text-sm font-angelo uppercase tracking-wider text-[#6B6B6B] mb-4 lowercase">frequently asked questions</h3>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-[#1F1F1F] rounded-xl overflow-hidden bg-[rgba(245,241,232,0.02)]"
                            >
                                <button
                                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                                    className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-[rgba(245,241,232,0.05)]"
                                >
                                    <span className="text-[#F5F1E8] font-sf-pro text-sm font-medium lowercase">{faq.question}</span>
                                    <span className={`text-[#6B6B6B] transition-transform duration-200 ${faqOpen === index ? 'rotate-45' : ''}`}>
                                        <X className="w-4 h-4" />
                                    </span>
                                </button>

                                {faqOpen === index && (
                                    <div className="p-4 pt-0 text-[#C5C5C5] text-sm font-sf-pro leading-relaxed lowercase animate-in slide-in-from-top-2 duration-200">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Contact Note */}
                    <div className="mt-8 p-4 rounded-xl bg-[rgba(0,208,132,0.05)] border border-[rgba(0,208,132,0.1)] flex items-start gap-3">
                        <MessageCircle className="w-5 h-5 text-[#00D084] flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-[#00D084] font-medium text-sm mb-1 lowercase">still need help?</h4>
                            <p className="text-[#C5C5C5] text-xs leading-relaxed lowercase">
                                our team is available mon-fri, 9am-6pm est. we usually respond within 2 hours.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
