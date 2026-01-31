import { ShieldCheck, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WarrantyPage() {
    return (
        <div className="bg-black min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <ShieldCheck className="w-20 h-20 text-primary mx-auto mb-6" />
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-6">
                        Warranty Validated
                    </h1>
                    <p className="text-xl text-zinc-400">
                        Every product sold by Electro Islam is backed by our Official Guarantee.
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-xl">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <CheckCircle className="text-green-500" /> Standard Coverage
                        </h3>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            All new electronic devices come with a mandatory <strong className="text-white">12-month manufacturer warranty</strong> covering hardware defects.
                            Refurbished or Open Box items include a 6-month store warranty.
                        </p>
                        <ul className="space-y-2 text-zinc-500 text-sm list-disc pl-5">
                            <li>GPU Artifacting / Failure</li>
                            <li>Dead Pixels (according to ISO standards)</li>
                            <li>Motherboard Power Delivery issues</li>
                            <li>SSD Read/Write failures</li>
                        </ul>
                    </div>

                    <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-xl">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <AlertTriangle className="text-yellow-500" /> Exclusions
                        </h3>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            Warranty does not cover physical damage, liquid damage, or misuse.
                        </p>
                        <ul className="space-y-2 text-zinc-500 text-sm list-disc pl-5">
                            <li>Cracked screens due to impact</li>
                            <li>Bent CPU pins during user installation</li>
                            <li>Mining-related degradation</li>
                            <li>Water spills</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-zinc-500 mb-6">Need to file a claim?</p>
                    <Button size="lg" asChild>
                        <Link href="/contact">Contact Support</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
