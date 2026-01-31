import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, ExternalLink, MessageCircle, BarChart3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteListingButton } from "@/components/marketplace/DeleteListingButton";
import { EditListingModal } from "@/components/marketplace/EditListingModal";
import { MarkSoldButton } from "@/components/marketplace/MarkSoldButton";

export default async function MyListingsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login?callbackUrl=/my-listings");
    }

    const categories = await prisma.category.findMany({
        select: { id: true, name: true }
    });

    const listings = await prisma.product.findMany({
        where: {
            sellerId: session.user.id
        },
        include: {
            _count: {
                select: { conversations: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Serialize Decimal values to numbers for Client Components
    const serializedListings = listings.map(item => ({
        ...item,
        price: Number(item.price),
        salePrice: item.salePrice ? Number(item.salePrice) : null,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
    }));

    return (
        <div className="min-h-screen bg-transparent pt-40 pb-12 transition-colors duration-300">
            {/* Clean Background Architecture */}
            <div className="fixed inset-0 pointer-events-none bg-zinc-950 z-0" />

            <div className="container mx-auto px-4 md:px-8 relative z-10 mt-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 pb-8 border-b border-border/50">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black text-foreground uppercase italic tracking-tighter leading-none">
                            My <span className="text-indigo-500">Inventory</span>
                        </h1>
                        <p className="text-muted-foreground font-medium mt-2">Manage your high-gear listings and track gamer interest.</p>
                    </div>
                    <Link href="/sell">
                        <Button className="h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl px-10 shadow-2xl shadow-emerald-500/20 group transition-all hover:-translate-y-1">
                            <PlusCircle className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
                            New Listing
                        </Button>
                    </Link>
                </div>

                {serializedListings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border rounded-[40px] bg-card/30 backdrop-blur-sm">
                        <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center mb-8 border border-border rotate-3 shadow-inner">
                            <PlusCircle className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-2xl font-black text-foreground mb-3 text-center uppercase italic">Your shelf is empty</h3>
                        <p className="text-muted-foreground mb-10 max-w-sm text-center font-medium">Convert your unused performance hardware into immediate capital today.</p>
                        <Link href="/sell">
                            <Button className="bg-foreground text-background font-black uppercase tracking-widest px-8 rounded-xl h-12 hover:scale-105 transition-transform">
                                Launch Listing
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {serializedListings.map((item) => {
                            let mainImage = item.images;
                            try {
                                if (mainImage && mainImage.startsWith('[')) {
                                    mainImage = JSON.parse(mainImage)[0];
                                }
                            } catch { }

                            const conversationCount = item._count.conversations;

                            return (
                                <Card key={item.id} className="bg-card border-border overflow-hidden group hover:border-indigo-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 rounded-[32px] flex flex-col h-full">
                                    <div className="relative h-60 w-full bg-muted/30 overflow-hidden">
                                        {mainImage ? (
                                            <Image
                                                src={mainImage}
                                                alt={item.name}
                                                fill
                                                unoptimized
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30">
                                                <Image className="opacity-10 grayscale" src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000" alt="" fill style={{ objectFit: 'cover' }} />
                                                <span className="relative z-10 font-black uppercase tracking-widest text-[10px]">Reference Pattern</span>
                                            </div>
                                        )}

                                        {/* Status & Messages Overlay */}
                                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                            <div className="flex flex-col gap-2">
                                                <Badge
                                                    className={cn(
                                                        "font-black uppercase tracking-[0.2em] text-[10px] px-3 py-1 rounded-lg border shadow-lg backdrop-blur-md w-fit",
                                                        item.status === 'APPROVED' ? 'bg-emerald-500/80 text-white border-emerald-400' :
                                                            item.status === 'PENDING' ? 'bg-yellow-500/80 text-white border-yellow-400' :
                                                                item.status === 'SOLD' ? 'bg-zinc-500/80 text-white border-zinc-400' :
                                                                    'bg-red-500/80 text-white border-red-400'
                                                    )}
                                                >
                                                    {item.status}
                                                </Badge>
                                                {item.specs && (
                                                    <Badge className="bg-white/10 text-white border-white/20 font-bold uppercase text-[8px] tracking-widest backdrop-blur-md w-fit">
                                                        {(() => {
                                                            try {
                                                                return JSON.parse(item.specs).condition?.replace('_', ' ') || "USED";
                                                            } catch { return "USED"; }
                                                        })()}
                                                    </Badge>
                                                )}
                                            </div>

                                            {conversationCount > 0 && item.status !== 'SOLD' && (
                                                <Link href="/chats">
                                                    <Badge className="bg-indigo-600 text-white border-indigo-400 font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-lg animate-pulse shadow-lg flex items-center gap-2">
                                                        <MessageCircle className="w-3 h-3" />
                                                        {conversationCount} {conversationCount === 1 ? 'Interest' : 'Interests'}
                                                    </Badge>
                                                </Link>
                                            )}
                                        </div>

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <Link href={`/product/${item.slug}`} className="w-full">
                                                <Button className="w-full bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-white/90">
                                                    Quick View
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    <CardHeader className="space-y-4 p-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                                                <span>Unit ID: {item.id.slice(0, 8)}</span>
                                                <div className="w-1 h-1 rounded-full bg-indigo-500/50" />
                                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <CardTitle className="text-xl font-black text-foreground leading-tight tracking-tight line-clamp-1 uppercase">
                                                {item.name}
                                            </CardTitle>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Market Value</p>
                                                <p className="text-emerald-500 font-mono font-black text-2xl tracking-tighter">
                                                    {item.price.toString()} <span className="text-xs">MAD</span>
                                                </p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Analytics</p>
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-1.5 text-indigo-500 font-mono font-bold">
                                                        <BarChart3 className="w-3 h-3" />
                                                        <span>{item.views > 0 ? ((conversationCount / item.views) * 100).toFixed(1) : "0.0"}% <span className="text-[8px] opacity-70">Conv.</span></span>
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 font-mono">
                                                        {item.views} Views
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-6 pb-6 flex-grow">
                                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                                            {item.description}
                                        </p>
                                    </CardContent>

                                    <CardFooter className="p-6 pt-0 mt-auto flex flex-col gap-3">
                                        <div className="flex w-full gap-3">
                                            {(item.status === 'APPROVED' || item.status === 'SOLD') ? (
                                                <>
                                                    <Link href={`/product/${item.slug}`} className="flex-1">
                                                        <Button variant="outline" className="w-full rounded-xl font-bold uppercase text-[10px] tracking-widest h-11 border-border hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all">
                                                            View Page <ExternalLink className="w-3 h-3 ml-2" />
                                                        </Button>
                                                    </Link>
                                                    <MarkSoldButton productId={item.id} inStock={item.inStock} />
                                                </>
                                            ) : (
                                                <Button disabled className="flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest h-11 bg-muted text-muted-foreground border-border">
                                                    {item.status === 'PENDING' ? 'Optimizing Listing...' : 'Listing Rejected'}
                                                </Button>
                                            )}
                                        </div>

                                        <div className="flex w-full gap-3">

                                            <Link href="/chats" className="flex-shrink-0">
                                                <Button size="icon" variant="outline" className="w-11 h-11 rounded-xl border-border hover:border-indigo-500 hover:text-indigo-500 relative transition-all">
                                                    <MessageCircle className="w-5 h-5" />
                                                    {conversationCount > 0 && (
                                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg">
                                                            {conversationCount}
                                                        </span>
                                                    )}
                                                </Button>
                                            </Link>

                                            <div className="flex-shrink-0">
                                                <EditListingModal product={item} categories={categories} />
                                            </div>

                                            <div className="flex-shrink-0">
                                                <DeleteListingButton productId={item.id} />
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div >
    );
}
