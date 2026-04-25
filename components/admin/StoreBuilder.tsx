"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
export type StoreSectionType = "single_product" | "group_products" | "slider" | "reviews" | "system_hero" | "system_brands" | "system_new_arrivals" | "category_group" | "brand_group" | "system_curation" | "system_featured_category";

export interface StoreSection {
  id: string;
  type: StoreSectionType;
  title: string;
  product_ids: string[];
  category_ids?: string[];
  brand_ids?: string[];
  banner_ids?: string[];
  images: { url: string; link?: string }[];
  is_visible: boolean;
  position: number;
  settings?: {
    layout?: "grid" | "carousel";
    limit?: number;
    background?: "transparent" | "white" | "black" | "accent";
    override_defaults?: boolean;
    columns?: 2 | 3 | 4;
  };
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Save, 
  Image as ImageIcon, Edit3, X, Layout, Maximize, 
  Settings2, Smartphone, Monitor, ChevronRight,
  Grid3X3, Columns, Presentation, Sparkles, Layers
} from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { toast } from "sonner";
import { updateAdminSettings } from "@/lib/actions/admin";
import Image from "next/image";
import Link from "next/link";

interface StoreBuilderProps {
  initialSections: StoreSection[];
  products: { id: string; name: string; image: string }[];
  categories: { id: string; name: string; image: string | null }[];
  brands: { id: string; name: string; logo: string | null }[];
  banners: { id: string; title: string; image: string; active: boolean }[];
}

export function StoreBuilder({ initialSections, products, categories, brands, banners }: StoreBuilderProps) {
  const [sections, setSections] = useState<StoreSection[]>(initialSections);
  const [loading, setLoading] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const activeSection = sections.find(s => s.id === activeSectionId);

  const handleAddSection = (type: StoreSectionType) => {
    let title = "Featured Module";
    if (type === "single_product") title = "Featured Product";
    if (type === "group_products") title = "Product Collection";
    if (type === "slider") title = "Custom Slider";
    if (type === "reviews") title = "Reviews Section";
    if (type === "system_hero") title = "Main Hero Slider";
    if (type === "system_brands") title = "Brands Row";
    if (type === "system_new_arrivals") title = "New Arrivals";
    if (type === "category_group") title = "Category Highlights";
    if (type === "brand_group") title = "Brand Showcase";
    if (type === "system_curation") title = "Curated Collections";
    if (type === "system_featured_category") title = "Featured Content";

    const newSection: StoreSection = {
      id: Math.random().toString(36).substring(7),
      type,
      title,
      product_ids: [],
      category_ids: [],
      brand_ids: [],
      images: [],
      is_visible: true,
      position: sections.length,
      settings: {
        layout: "grid",
        limit: 12,
        background: "transparent",
        override_defaults: false,
        columns: 3
      }
    };
    setSections([...sections, newSection]);
    setActiveSectionId(newSection.id);
  };

  const SECTION_ICONS: Record<StoreSectionType, any> = {
    system_hero: Smartphone,
    system_brands: Layers,
    system_new_arrivals: Sparkles,
    system_curation: Grid3X3,
    system_featured_category: Columns,
    single_product: Maximize,
    group_products: Layout,
    category_group: Grid3X3,
    brand_group: Layers,
    slider: Presentation,
    reviews: Settings2
  };

  const handleUpdateSection = (id: string, updates: Partial<StoreSection>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleRemoveSection = (id: string) => {
    if (confirm("Are you sure you want to remove this section?")) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) return;
    
    const newSections = [...sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    
    newSections.forEach((s, idx) => s.position = idx);
    setSections(newSections);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateAdminSettings({
        home_sections: JSON.stringify(sections)
      });
      if (res.success) {
        toast.success("Store layout saved");
      } else {
        toast.error("Failed to save layout");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black tracking-tight">Home Page Designer</h2>
          <p className="text-[13px] text-gray-500 mt-1">Configure and reorder the sections shown on your home page.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="h-10 px-6 bg-black text-white hover:bg-gray-800 rounded-lg font-bold text-[13px]"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-8">
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Core Modules</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { type: "system_hero", label: "Main Banner", icon: Smartphone },
              { type: "system_brands", label: "Brands Row", icon: Layers },
              { type: "system_new_arrivals", label: "New Arrivals", icon: Sparkles },
              { type: "system_curation", label: "Collections Hub", icon: Grid3X3 },
              { type: "system_featured_category", label: "Feature Panel", icon: Columns },
            ].map((btn) => (
              <Button 
                key={btn.type}
                onClick={() => handleAddSection(btn.type as StoreSectionType)} 
                variant="outline" 
                className="h-9 bg-gray-50 border-gray-200 text-black hover:bg-black hover:text-white text-xs font-bold gap-2"
              >
                <btn.icon className="w-3.5 h-3.5" />
                {btn.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="h-px bg-gray-100" />

        <div>
           <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Custom Modules</h3>
           <div className="flex flex-wrap gap-2">
             {[
               { type: "single_product", label: "Specific Product", icon: Maximize },
               { type: "group_products", label: "Custom Collection", icon: Layout },
               { type: "category_group", label: "Category List", icon: Grid3X3 },
               { type: "brand_group", label: "Brand List", icon: Layers },
               { type: "slider", label: "Custom Slider", icon: Presentation },
             ].map((btn) => (
               <Button 
                 key={btn.type}
                 onClick={() => handleAddSection(btn.type as StoreSectionType)} 
                 variant="outline" 
                 className="h-9 border-gray-200 text-black hover:bg-gray-50 text-xs font-bold gap-2"
               >
                 <btn.icon className="w-3.5 h-3.5 text-gray-400" />
                 {btn.label}
               </Button>
             ))}
           </div>
        </div>
      </div>

      <div className="space-y-3">
        {sections.length === 0 ? (
          <div className="p-12 text-center bg-gray-50 border border-gray-200 rounded-xl border-dashed">
            <p className="text-gray-400 text-sm">No sections added yet. Use the modules above to start building.</p>
          </div>
        ) : (
          sections.map((section, index) => {
            const Icon = SECTION_ICONS[section.type] || Layout;
            return (
              <div 
                key={section.id} 
                className={cn(
                  "group p-4 bg-white border rounded-xl transition-all shadow-sm",
                  section.is_visible ? "border-gray-200" : "border-gray-100 opacity-60 bg-gray-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => moveSection(index, 'up')} 
                        disabled={index === 0}
                        className="p-1 text-gray-300 hover:text-black disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => moveSection(index, 'down')} 
                        disabled={index === sections.length - 1}
                        className="p-1 text-gray-300 hover:text-black disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      section.is_visible ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                         <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                           {section.type.replace('system_', '').replace('_', ' ')}
                         </span>
                         {!section.is_visible && (
                           <span className="text-[8px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase">Hidden</span>
                         )}
                      </div>
                      <h4 className="text-sm font-bold text-black">{section.title}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setActiveSectionId(section.id)}
                      className="h-8 px-3 border-gray-200 text-xs font-bold"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-2" />
                      Configure
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUpdateSection(section.id, { is_visible: !section.is_visible })}
                      className="h-8 w-8 text-gray-400 hover:text-black"
                    >
                      {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSection(section.id)}
                      className="h-8 w-8 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {activeSectionId && activeSection && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div 
            onClick={() => setActiveSectionId(null)}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white">
                  {(() => {
                    const Icon = SECTION_ICONS[activeSection.type] || Layout;
                    return <Icon className="w-4 h-4" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black uppercase">{activeSection.title}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Section Settings</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setActiveSectionId(null)} className="h-8 w-8 rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-3">
                <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Section Title</Label>
                <Input 
                  value={activeSection.title}
                  onChange={(e) => handleUpdateSection(activeSection.id, { title: e.target.value })}
                  className="h-10 text-sm font-bold"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Content Selection</Label>
                
                {(activeSection.type === "system_hero" || activeSection.type === "slider") && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-600">Available Banners ({banners.length})</span>
                      <Link href="/admin/banners" className="text-xs font-bold text-black hover:underline flex items-center gap-1">
                        Edit Banners <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-1">
                      {banners.map(banner => {
                        const isSelected = activeSection.banner_ids?.includes(banner.id);
                        return (
                          <div 
                            key={banner.id}
                            onClick={() => {
                              const newIds = isSelected 
                                ? activeSection.banner_ids?.filter(id => id !== banner.id)
                                : [...(activeSection.banner_ids || []), banner.id];
                              handleUpdateSection(activeSection.id, { banner_ids: newIds });
                            }}
                            className={cn(
                              "flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all",
                              isSelected ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-200"
                            )}
                          >
                            <div className="relative w-16 h-10 rounded bg-gray-100 border border-gray-100 overflow-hidden">
                              <Image src={banner.image} alt="" fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[12px] font-bold text-black truncate">{banner.title}</p>
                              <p className={cn("text-[9px] font-bold uppercase", banner.active ? "text-emerald-500" : "text-gray-400")}>
                                {banner.active ? "Active" : "Inactive"}
                              </p>
                            </div>
                            {isSelected && <Plus className="w-4 h-4 text-black rotate-45" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {(activeSection.type === "single_product" || activeSection.type === "group_products") && (
                  <div className="grid gap-2 max-h-[500px] overflow-y-auto pr-1">
                    {products.map(product => {
                      const isSelected = activeSection.product_ids?.includes(product.id);
                      return (
                        <div 
                          key={product.id}
                          onClick={() => {
                            const newIds = activeSection.type === "single_product" 
                              ? [product.id]
                              : isSelected ? activeSection.product_ids.filter(id => id !== product.id) : [...(activeSection.product_ids || []), product.id];
                            handleUpdateSection(activeSection.id, { product_ids: newIds });
                          }}
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all",
                            isSelected ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-200"
                          )}
                        >
                          <div className="relative w-10 h-10 rounded bg-gray-50 border border-gray-100 overflow-hidden">
                            {product.image && <Image src={product.image} alt="" fill className="object-cover" />}
                          </div>
                          <p className="text-[12px] font-bold text-black truncate flex-1">{product.name}</p>
                          {isSelected && <Plus className="w-4 h-4 text-black rotate-45" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                {(activeSection.type === "category_group" || activeSection.type === "system_curation" || activeSection.type === "system_new_arrivals" || activeSection.type === "system_featured_category") && (
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(category => {
                      const isSelected = activeSection.category_ids?.includes(category.id);
                      return (
                        <div 
                          key={category.id}
                          onClick={() => {
                            const newIds = isSelected 
                              ? activeSection.category_ids?.filter(id => id !== category.id)
                              : [...(activeSection.category_ids || []), category.id];
                            handleUpdateSection(activeSection.id, { category_ids: newIds });
                          }}
                          className={cn(
                            "flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all gap-2 text-center",
                            isSelected ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-200"
                          )}
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
                            {category.image ? <Image src={category.image} alt={category.name} fill className="object-cover" /> : <Grid3X3 className="w-full h-full p-3 text-gray-200" />}
                          </div>
                          <p className="text-[11px] font-bold text-black uppercase leading-tight">{category.name}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {(activeSection.type === "brand_group" || activeSection.type === "system_brands") && (
                  <div className="grid grid-cols-2 gap-2">
                    {brands.map(brand => {
                      const isSelected = activeSection.brand_ids?.includes(brand.id);
                      return (
                        <div 
                          key={brand.id}
                          onClick={() => {
                            const newIds = isSelected 
                              ? activeSection.brand_ids?.filter(id => id !== brand.id)
                              : [...(activeSection.brand_ids || []), brand.id];
                            handleUpdateSection(activeSection.id, { brand_ids: newIds });
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                            isSelected ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-200"
                          )}
                        >
                          <div className="relative w-8 h-8 rounded border border-gray-100 bg-white p-1">
                            {brand.logo ? <Image src={brand.logo} alt={brand.name} fill className="object-contain" /> : <span className="text-xs font-bold text-gray-200">{brand.name[0]}</span>}
                          </div>
                          <p className="text-[11px] font-bold text-black uppercase truncate">{brand.name}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Section Styling</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Layout</span>
                    <select 
                      value={activeSection.settings?.layout || "grid"}
                      onChange={(e) => handleUpdateSection(activeSection.id, { settings: { ...activeSection.settings, layout: e.target.value as any } })}
                      className="w-full h-9 border border-gray-200 rounded px-2 text-xs font-bold focus:border-black outline-none"
                    >
                      <option value="grid">Static Grid</option>
                      <option value="carousel">Horizontal Scroll</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Theme</span>
                    <select 
                      value={activeSection.settings?.background || "transparent"}
                      onChange={(e) => handleUpdateSection(activeSection.id, { settings: { ...activeSection.settings, background: e.target.value as any } })}
                      className="w-full h-9 border border-gray-200 rounded px-2 text-xs font-bold focus:border-black outline-none"
                    >
                      <option value="transparent">Transparent</option>
                      <option value="white">Solid White</option>
                      <option value="black">Sleek Black</option>
                      <option value="accent">Theme Accent</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <Button onClick={() => setActiveSectionId(null)} className="bg-black text-white hover:bg-gray-800 h-10 px-8 font-bold text-xs uppercase tracking-widest">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
