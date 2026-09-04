"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BrandCreators() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/brand');
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center bg-zinc-950">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF4D00]"></div>
        </div>
    );
}
