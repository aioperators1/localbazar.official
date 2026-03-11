"use client";

import { useState, useEffect } from 'react';
import { COMPONENT_CATEGORIES } from '@/lib/constants/configurator';
import {
    Check, ChevronRight, ChevronLeft, Cpu, Zap, HardDrive, Box,
    CircuitBoard, Monitor as MonitorIcon, Fan, Battery, MemoryStick,
    RotateCcw, ShoppingCart, Info, Sparkles
} from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getConfiguratorComponents } from '@/lib/actions/configurator';

export function ConfiguratorClient() {
    const [currentStep, setCurrentStep] = useState(-1); // -1 is Platform Selection
    const [platform, setPlatform] = useState<'intel' | 'amd' | null>(null);
    const [selections, setSelections] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [withMontage, setWithMontage] = useState(true);

    const { addItem } = useCart();
    const router = useRouter();

    const steps = [
        { id: 'platform', title: 'Bienvenue', shortTitle: 'Start', icon: Sparkles },
        ...COMPONENT_CATEGORIES.map(cat => ({
            id: cat.id,
            title: cat.title,
            shortTitle: cat.shortTitle,
            icon: cat.icon
        }))
    ];

    const currentCategory = currentStep >= 0 ? COMPONENT_CATEGORIES[currentStep] : null;

    // Fetch products whenever step changes
    useEffect(() => {
        if (currentStep >= 0 && currentCategory) {
            async function fetchProducts() {
                setLoading(true);
                try {
                    const socket = getSelectedSocket();
                    const data = await getConfiguratorComponents(currentCategory!.id, socket);

                    // Filter by platform if it's CPU
                    let filtered = data;
                    if (currentCategory!.id === 'processeur' && platform) {
                        filtered = data.filter(p =>
                            p.name.toLowerCase().includes(platform!)
                        );
                    }

                    setProducts(filtered);
                } catch (error) {
                    console.error("Failed to load components:", error);
                } finally {
                    setLoading(false);
                }
            }
            fetchProducts();
        }
    }, [currentStep, platform]);

    const handleSelectProduct = (product: any) => {
        setSelections(prev => ({
            ...prev,
            [currentCategory!.id]: product
        }));
        // Auto advance to next step
        if (currentStep < COMPONENT_CATEGORIES.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const calculateTotal = () => {
        const base = Object.values(selections).reduce((sum, item) => sum + item.price, 0);
        return withMontage ? base + 250 : base;
    };

    const getSelectedSocket = () => {
        const cpu = selections['processeur'];
        if (!cpu) return undefined;
        const match = cpu.name.match(/(LGA\s?\d+|AM4|AM5|sTR5|sWRX8)/i);
        return match ? match[0] : undefined;
    };

    const handleAddAllToCart = () => {
        const items = Object.values(selections);
        if (items.length === 0) return;

        items.forEach(p => addItem({ ...p, quantity: 1 }));

        if (withMontage) {
            addItem({
                id: 'service-montage-pc',
                name: 'Service Montage & Installation Windows',
                price: 250,
                image: '/images/techspace/montage_service.png',
                category: 'Service',
                quantity: 1
            });
        }

        toast.success("Votre configuration a été ajoutée au panier !");
        router.push('/cart');
    };

    const iconMap: Record<string, any> = {
        'Cpu': Cpu,
        'CircuitBoard': CircuitBoard,
        'MemoryStick': MemoryStick,
        'Zap': Zap,
        'HardDrive': HardDrive,
        'Box': Box,
        'Fan': Fan,
        'Battery': Battery,
        'Sparkles': Sparkles
    };

    return (
        <div className="flex flex-col gap-10">
            {/* 1. Header Stepper */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[800px] relative px-4">
                    {/* Progress Bar Line */}
                    <div className="absolute top-[22px] left-[60px] right-[60px] h-[2px] bg-zinc-100 z-0" />
                    <div
                        className="absolute top-[22px] left-[60px] h-[2px] bg-[var(--color-brand-cyan)] z-0 transition-all duration-500"
                        style={{ width: `${Math.max(0, (currentStep + 1) / (steps.length - 1) * 100)}%` }}
                    />

                    {steps.map((step, idx) => {
                        const Icon = iconMap[step.icon as string] || iconMap['Cpu'];
                        const isCompleted = idx < currentStep + 1;
                        const isActive = idx === currentStep + 1;
                        const hasSelection = idx > 0 && selections[COMPONENT_CATEGORIES[idx - 1]?.id];

                        return (
                            <div key={idx} className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer" onClick={() => idx <= currentStep + 1 && setCurrentStep(idx - 1)}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${isActive ? 'bg-[var(--color-brand-blue)] border-[var(--color-brand-blue)] text-white scale-110 shadow-lg' :
                                    isCompleted ? 'bg-white border-[var(--color-brand-cyan)] text-[var(--color-brand-cyan)]' :
                                        'bg-white border-zinc-200 text-zinc-400'
                                    }`}>
                                    {isCompleted && !isActive ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-[var(--color-brand-blue)]' : 'text-zinc-400'}`}>
                                    {step.id === 'platform' ? 'Start' : step.shortTitle || step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* 2. Main Selection Area */}
                <div className="lg:col-span-8">
                    {currentStep === -1 ? (
                        /* PLATFORM SELECTION */
                        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-black text-[var(--color-brand-blue)] uppercase mb-2">Choisissez votre plateforme</h2>
                            <p className="text-zinc-500 mb-10 font-medium">Sélectionnez la base de votre futur PC Gamer.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                                <button
                                    onClick={() => { setPlatform('intel'); setCurrentStep(0); }}
                                    className="group relative bg-[#f3f5f6] border-2 border-transparent hover:border-blue-500 rounded-2xl p-8 transition-all hover:scale-105 active:scale-95 overflow-hidden"
                                >
                                    <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden border border-blue-100 bg-white">
                                        <Image src="/images/techspace/intel_logo.png" alt="Intel" fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <span className="text-xl font-black text-blue-600 uppercase">Architecture Intel</span>
                                    <p className="text-xs text-zinc-500 mt-2 font-bold">Puissance brute & Gaming extrême</p>
                                </button>

                                <button
                                    onClick={() => { setPlatform('amd'); setCurrentStep(0); }}
                                    className="group relative bg-[#f3f5f6] border-2 border-transparent hover:border-orange-500 rounded-2xl p-8 transition-all hover:scale-105 active:scale-95 overflow-hidden"
                                >
                                    <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden border border-orange-100 bg-white">
                                        <Image src="/images/techspace/amd_logo.png" alt="AMD" fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <span className="text-xl font-black text-orange-600 uppercase">Architecture AMD</span>
                                    <p className="text-xs text-zinc-500 mt-2 font-bold">Performance efficiente & Multitâche</p>
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* COMPONENT SELECTION */
                        <div className="space-y-6">
                            <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                                <div>
                                    <h2 className="text-xl font-black text-[var(--color-brand-blue)] uppercase flex items-center gap-2">
                                        Sélectionnez votre : {currentCategory?.title}
                                        {currentCategory?.id === 'carte-mere' && getSelectedSocket() && (
                                            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded ml-2">AUTO-COMPATIBILITÉ: {getSelectedSocket()}</span>
                                        )}
                                    </h2>
                                    <p className="text-zinc-500 text-sm font-medium">Étape {currentStep + 1} sur {COMPONENT_CATEGORIES.length}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentStep(prev => prev - 1)}
                                        className="h-10 px-4 rounded-lg bg-zinc-100 text-zinc-600 font-bold text-xs flex items-center gap-2 hover:bg-zinc-200 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Retour
                                    </button>
                                    <button
                                        onClick={() => setCurrentStep(prev => Math.min(COMPONENT_CATEGORIES.length - 1, prev + 1))}
                                        className="h-10 px-4 rounded-lg bg-[var(--color-brand-blue)] text-white font-bold text-xs flex items-center gap-2 hover:bg-blue-800 transition-colors"
                                    >
                                        Ignorer <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="bg-white p-20 rounded-xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center gap-4">
                                    <div className="w-12 h-12 border-4 border-[var(--color-brand-cyan)] border-t-transparent rounded-full animate-spin" />
                                    <p className="text-zinc-400 font-black uppercase text-xs tracking-widest">Chargement des composants...</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="bg-white p-20 rounded-xl border border-zinc-200 shadow-sm text-center">
                                    <Info className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                                    <p className="text-zinc-500 font-bold">Désolé, aucun produit disponible dans cette catégorie pour le moment.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {products.map(p => {
                                        const isSelected = selections[currentCategory!.id]?.id === p.id;
                                        return (
                                            <div
                                                key={p.id}
                                                onClick={() => handleSelectProduct(p)}
                                                className={`group bg-white rounded-xl border-2 p-5 flex flex-col gap-4 cursor-pointer transition-all hover:shadow-xl ${isSelected ? 'border-[var(--color-brand-cyan)] ring-1 ring-[var(--color-brand-cyan)]' : 'border-transparent border-zinc-100 hover:border-zinc-300'
                                                    }`}
                                            >
                                                <div className="aspect-square relative bg-[#f3f5f6] rounded-lg overflow-hidden p-4">
                                                    <Image
                                                        src={p.image && (p.image.startsWith('http') || p.image.startsWith('/')) ? p.image : '/placeholder.png'}
                                                        alt={p.name}
                                                        fill
                                                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                                                        unoptimized
                                                    />
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 bg-[var(--color-brand-cyan)] text-white p-1 rounded-full">
                                                            <Check className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2 flex-1">
                                                    <h3 className="text-sm font-black text-[var(--color-brand-blue)] line-clamp-2 h-10 leading-tight group-hover:text-[var(--color-brand-cyan)] transition-colors">{p.name}</h3>
                                                    <div className="mt-auto flex items-center justify-between">
                                                        <span className="text-lg font-black text-[var(--color-brand-cyan)]">{p.price.toLocaleString()} dh</span>
                                                        <button className={`h-8 px-3 rounded text-[10px] font-black uppercase ${isSelected ? 'bg-[var(--color-brand-cyan)] text-white' : 'bg-[#ff6f0b] text-white'
                                                            }`}>
                                                            {isSelected ? 'Sélectionné' : 'Choisir'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. Right Column: Summary / Recap */}
                <div className="lg:col-span-4 sticky top-6">
                    <div className="bg-[#0b1b36] text-white rounded-xl shadow-2xl p-8 flex flex-col gap-6 overflow-hidden border border-white/10 relative">
                        {/* Decorative Glow */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-brand-cyan)] opacity-20 blur-[80px] rounded-full pointer-events-none" />

                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[var(--color-brand-cyan)]" /> Configuration
                            </h2>
                            <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mt-1">
                                {platform ? `Architecture ${platform.toUpperCase()}` : 'Plateforme non définie'}
                            </p>
                        </div>

                        {/* Selected List Mini */}
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {COMPONENT_CATEGORIES.map(cat => {
                                const selected = selections[cat.id];
                                return (
                                    <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center ${selected ? 'bg-[var(--color-brand-cyan)]/20 text-[var(--color-brand-cyan)]' : 'bg-white/10 text-white/30'}`}>
                                                {selected ? <Check className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-white/40 uppercase leading-none mb-1">{cat.shortTitle}</span>
                                                <span className={`text-[11px] font-bold line-clamp-1 ${selected ? 'text-white' : 'text-white/20 italic'}`}>
                                                    {selected ? selected.name : '-- non sélectionné --'}
                                                </span>
                                            </div>
                                        </div>
                                        {selected && <span className="text-[11px] font-black text-[var(--color-brand-cyan)]">{selected.price.toLocaleString()} dh</span>}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Montage Option */}
                        <div
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${withMontage ? 'bg-[var(--color-brand-cyan)]/10 border-[var(--color-brand-cyan)]' : 'bg-white/5 border-white/5 hover:border-white/20'
                                }`}
                            onClick={() => setWithMontage(!withMontage)}
                        >
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase">Montage & Windows</span>
                                <span className="text-[9px] text-white/50 font-bold uppercase">Installation Pro</span>
                            </div>
                            <span className="text-sm font-black text-[var(--color-brand-cyan)]">250 dh</span>
                        </div>

                        {/* Total & Action */}
                        <div className="pt-6 border-t border-white/10 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase text-white/40">Total TTC</span>
                                <div className="text-3xl font-black text-[var(--color-brand-cyan)] tracking-tighter">
                                    {calculateTotal().toLocaleString()} dh
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => {
                                        if (confirm("Réinitialiser toute la configuration ?")) {
                                            setSelections({});
                                            setCurrentStep(-1);
                                            setPlatform(null);
                                        }
                                    }}
                                    className="h-12 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all"
                                >
                                    <RotateCcw className="w-4 h-4" /> Reset
                                </button>
                                <button
                                    onClick={handleAddAllToCart}
                                    disabled={Object.keys(selections).length === 0}
                                    className="h-12 rounded-lg bg-[#ff6f0b] hover:bg-[#e6630a] text-white font-black text-xs uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-30 shadow-xl shadow-orange-900/20"
                                >
                                    <ShoppingCart className="w-4 h-4" /> Commander
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
