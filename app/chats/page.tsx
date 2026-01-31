import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, User, ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default async function ChatsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login?callbackUrl=/chats");
    }

    const userId = session.user.id;

    const conversations = await prisma.conversation.findMany({
        where: {
            OR: [
                { buyerId: userId },
                { sellerId: userId }
            ]
        },
        include: {
            buyer: true,
            seller: true,
            product: true,
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    return (
        <div className="min-h-screen bg-[#030303] pt-32 pb-20 relative overflow-hidden">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-40 left-0 -ml-32 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                <div className="mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Signal Frequency
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.85] select-none">
                        Active <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500">Transmissions</span>
                    </h1>
                </div>

                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 rounded-[3rem] border border-dashed border-white/5 bg-white/[0.01] text-center space-y-8">
                        <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-700">
                            <MessageSquare className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black italic text-zinc-300 uppercase tracking-tight">Encryption Silent</h3>
                            <p className="text-zinc-600 font-medium uppercase text-[10px] tracking-[0.3em]">No active communication links established.</p>
                        </div>
                        <Link href="/shop" className="px-8 py-4 bg-indigo-600 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                            Initialize Store Link
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {conversations.map((conv, i) => {
                            const otherUser = conv.buyerId === userId ? conv.seller : conv.buyer;
                            const lastMessage = conv.messages[0];
                            const productImg = conv.product.images;
                            let displayImg = "/placeholder.png";
                            try {
                                if (productImg.startsWith('[')) {
                                    displayImg = JSON.parse(productImg)[0];
                                } else {
                                    displayImg = productImg;
                                }
                            } catch { }

                            return (
                                <Link
                                    key={conv.id}
                                    href={`/chat/${conv.id}`}
                                    className="block group animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-indigo-500/30 p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center gap-8 transition-all duration-500 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Product Icon */}
                                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-black/40 shrink-0 border border-white/10">
                                            <Image
                                                src={displayImg}
                                                alt={conv.product.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                unoptimized
                                            />
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex-grow min-w-0 relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{otherUser.name || "External Node"}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Link</span>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-mono text-zinc-600 font-bold uppercase">
                                                    {new Date(conv.updatedAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                                    <span className="text-[9px] font-black text-indigo-500 uppercase italic">Product: {conv.product.name}</span>
                                                </div>

                                                <div className={cn(
                                                    "text-sm line-clamp-1 transition-colors",
                                                    lastMessage && !lastMessage.read && lastMessage.receiverId === userId
                                                        ? "text-white font-black italic"
                                                        : "text-zinc-500 font-medium"
                                                )}>
                                                    {lastMessage ? (
                                                        <span className="flex items-center gap-3">
                                                            {lastMessage.senderId === userId && <span className="text-[8px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">OUT</span>}
                                                            {lastMessage.content}
                                                        </span>
                                                    ) : "No data transmissions recorded..."}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Marker */}
                                        <div className="flex-shrink-0 flex items-center justify-center">
                                            {lastMessage && !lastMessage.read && lastMessage.receiverId === userId ? (
                                                <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center relative">
                                                    <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 animate-pulse" />
                                                    <MessageSquare className="w-5 h-5 text-indigo-400 relative z-10" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-zinc-700 group-hover:text-indigo-500 transition-colors group-hover:border-indigo-500/30 translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
                                                    <ArrowRight className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
