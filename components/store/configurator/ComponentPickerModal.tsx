"use client";

import { useState, useEffect } from 'react';
import { COMPONENT_CATEGORIES } from '@/lib/constants/configurator';
import { getConfiguratorComponents } from '@/lib/actions/configurator';
import { X, Search } from 'lucide-react';
import Image from 'next/image';

interface ComponentPickerModalProps {
    category: string;
    socket?: string;
    onClose: () => void;
    onSelect: (product: any) => void;
}

export function ComponentPickerModal({ category, socket, onClose, onSelect }: ComponentPickerModalProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const catDetails = COMPONENT_CATEGORIES.find(c => c.id === category);

    useEffect(() => {
        // Fetch products when modal opens
        async function fetchProducts() {
            setLoading(true);
            try {
                const data = await getConfiguratorComponents(category, socket);
                setProducts(data);
            } catch (error) {
                console.error("Failed to load components:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [category, socket]);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-4xl rounded-[4px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-zinc-100 flex flex-col gap-4 bg-[#f3f5f6]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-[var(--color-brand-blue)]">Choisir {catDetails?.title.toLowerCase()}</h2>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{filteredProducts.length} résultats</span>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-zinc-500 hover:text-black shadow-sm">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un modèle..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 bg-white border border-zinc-200 rounded-[3px] focus:outline-none focus:border-[var(--color-brand-cyan)] font-medium text-sm"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto bg-white flex-1">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-8 h-8 rounded-full border-4 border-[var(--color-brand-cyan)] border-t-transparent animate-spin" />
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20 text-zinc-500 font-medium">
                            {searchQuery ? "Aucun résultat pour votre recherche." : "Oups, aucun composant disponible pour cette catégorie."}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(p => (
                                <div key={p.id} className="border border-zinc-200 rounded-[3px] p-4 flex flex-col gap-4 group hover:border-[var(--color-brand-blue)] transition-colors cursor-pointer" onClick={() => onSelect(p)}>
                                    <div className="w-full aspect-square relative bg-[#f3f5f6] p-4 rounded-[2px]">
                                        <Image src={p.image} alt={p.name} fill className="object-contain group-hover:scale-105 transition-transform" />
                                    </div>
                                    <div className="flex flex-col gap-1 flex-1">
                                        <h3 className="text-xs font-bold text-[var(--color-brand-blue)] line-clamp-2 h-8 leading-tight">{p.name}</h3>
                                        {p.specs?.socket && (
                                            <span className="text-[10px] font-bold text-zinc-400">Socket: {p.specs.socket}</span>
                                        )}
                                        <div className="mt-auto pt-2 flex items-center justify-between">
                                            <span className="font-bold text-[var(--color-brand-cyan)]">{p.price.toLocaleString()}.00 dh</span>
                                            <button className="text-[10px] font-bold text-white bg-[#ff6f0b] px-3 py-1.5 rounded-[2px]">Choisir</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
