"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ShippingOption {
    id: string;
    name: string;
    nameAr: string;
    price: number;
    duration: string;
}

interface ShippingSettingsProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function ShippingSettings({ value, onChange, disabled }: ShippingSettingsProps) {
    const [options, setOptions] = useState<ShippingOption[]>(() => {
        try {
            return JSON.parse(value || "[]");
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
             const parsed = JSON.parse(value || "[]");
             if (JSON.stringify(parsed) !== JSON.stringify(options)) {
                 setOptions(parsed);
             }
        } catch {}
    }, [value]);

    const handleChange = (newOptions: ShippingOption[]) => {
        setOptions(newOptions);
        onChange(JSON.stringify(newOptions));
    };

    const addOption = () => {
        const newOption: ShippingOption = {
            id: Math.random().toString(36).substring(7),
            name: "New Shipping Method",
            nameAr: "",
            price: 0,
            duration: "1-2 Business Days"
        };
        handleChange([...options, newOption]);
    };

    const updateOption = (index: number, field: keyof ShippingOption, val: any) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], [field]: val };
        handleChange(newOptions);
    };

    const removeOption = (index: number) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        handleChange(newOptions);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-gray-50/50 p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                        <Package className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-black uppercase tracking-tight">Delivery Logistics</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Shipping Methods & Pricing</p>
                    </div>
                </div>
                <Button 
                    type="button" 
                    onClick={addOption} 
                    disabled={disabled}
                    className="bg-black text-white hover:bg-gray-800 rounded-lg text-[10px] font-bold uppercase tracking-widest h-9 px-4 flex items-center gap-2 transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Method
                </Button>
            </div>
            <div className="p-6 space-y-6">
                {options.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-[11px] font-bold uppercase tracking-wider bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                        No shipping methods configured.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {options.map((opt, i) => (
                            <div key={opt.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-gray-50/30 p-5 rounded-xl border border-gray-100 relative group transition-all hover:border-gray-200">
                                <div className="md:col-span-3 space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Name (En)</Label>
                                    <Input 
                                        value={opt.name}
                                        onChange={(e) => updateOption(i, 'name', e.target.value)}
                                        disabled={disabled}
                                        className="h-10 bg-white border-gray-200 rounded-lg text-[13px] font-medium text-black focus:border-black transition-all"
                                    />
                                </div>
                                <div className="md:col-span-3 space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Name (Ar)</Label>
                                    <Input 
                                        value={opt.nameAr}
                                        onChange={(e) => updateOption(i, 'nameAr', e.target.value)}
                                        disabled={disabled}
                                        dir="rtl"
                                        className="h-10 bg-white border-gray-200 rounded-lg text-[14px] font-bold text-black text-right focus:border-black transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Price (QAR)</Label>
                                    <Input 
                                        type="number"
                                        value={opt.price}
                                        onChange={(e) => updateOption(i, 'price', parseFloat(e.target.value) || 0)}
                                        disabled={disabled}
                                        className="h-10 bg-white border-gray-200 rounded-lg text-[14px] font-bold text-black focus:border-black transition-all"
                                    />
                                </div>
                                <div className="md:col-span-3 space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Duration</Label>
                                    <Input 
                                        value={opt.duration}
                                        onChange={(e) => updateOption(i, 'duration', e.target.value)}
                                        disabled={disabled}
                                        className="h-10 bg-white border-gray-200 rounded-lg text-[12px] font-medium text-black focus:border-black transition-all"
                                    />
                                </div>
                                <div className="md:col-span-1 flex items-end justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => removeOption(i)}
                                        disabled={disabled}
                                        className="h-10 w-10 p-0 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 transition-all border border-transparent hover:border-rose-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
