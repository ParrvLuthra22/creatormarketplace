import { Button } from "./ui/Button";

export function Hero() {
    return (
        <section className="pt-32 pb-16 md:pt-48 md:pb-24 px-4 text-center max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1A1A1A] mb-6">
                Discover Creators. <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF6B9D]">
                    Build Collaborations.
                </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                The professional marketplace for Instagram creators and brands. Connect, collaborate, and grow.
            </p>
        </section>
    );
}
