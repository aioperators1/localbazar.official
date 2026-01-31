import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    return (
        <div className="bg-black min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-12">
                    Contact <span className="text-primary">Ops</span>
                </h1>

                <div className="grid lg:grid-cols-2 gap-20">

                    {/* Contact Info */}
                    <div className="space-y-12">
                        <p className="text-xl text-zinc-400 leading-relaxed">
                            We are standing by to assist with your upgrades. Reach out to our technical team for inquiries about custom builds, bulk orders, or support.
                        </p>

                        <div className="space-y-8">
                            <ContactItem
                                icon={Phone}
                                title="Hotline"
                                content="+212 600 000 000"
                                sub="Mon-Fri, 9am - 6pm"
                            />
                            <ContactItem
                                icon={Mail}
                                title="Email Channel"
                                content="support@electro-islam.com"
                                sub="24/7 Response"
                            />
                            <ContactItem
                                icon={MapPin}
                                title="HQ Location"
                                content="Casablanca Technopark"
                                sub="Building A, Floor 3"
                            />
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-zinc-900/40 border border-zinc-800 p-8 md:p-12 rounded-2xl">
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">First Name</label>
                                    <Input placeholder="John" className="bg-black border-zinc-800 focus:border-primary" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Last Name</label>
                                    <Input placeholder="Doe" className="bg-black border-zinc-800 focus:border-primary" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                                <Input placeholder="john@example.com" type="email" className="bg-black border-zinc-800 focus:border-primary" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Message</label>
                                <Textarea placeholder="How can we help?" className="bg-black border-zinc-800 focus:border-primary min-h-[150px]" />
                            </div>

                            <Button size="lg" className="w-full font-bold uppercase tracking-widest">
                                Transmit Message <Send className="w-4 h-4 ml-2" />
                            </Button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}

interface ContactItemProps {
    icon: React.ElementType;
    title: string;
    content: string;
    sub: string;
}

function ContactItem({ icon: Icon, title, content, sub }: ContactItemProps) {
    return (
        <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary shrink-0">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h4 className="text-lg font-bold text-white uppercase tracking-wide">{title}</h4>
                <p className="text-xl font-medium text-zinc-200 mt-1">{content}</p>
                <p className="text-sm text-zinc-500 mt-1 font-mono">{sub}</p>
            </div>
        </div>
    )
}
