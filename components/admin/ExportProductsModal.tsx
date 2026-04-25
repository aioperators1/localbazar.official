"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ExportProductsModal({ brands }: { brands: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const url = new URL("/api/admin/products/export", window.location.origin);
      if (selectedBrand !== "all") {
        url.searchParams.set("brandId", selectedBrand);
      }
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Export failed");
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `products_export_${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to export products");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
      if (selectedBrand === "all") {
          alert("Please select a brand first to download its template.");
          return;
      }
      try {
          const url = new URL("/api/admin/products/export", window.location.origin);
          url.searchParams.set("template", "true");
          url.searchParams.set("brandId", selectedBrand);
          
          const response = await fetch(url.toString());
          if (!response.ok) throw new Error("Template download failed");
          
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          
          const brandName = brands.find(b => b.id === selectedBrand)?.name || "brand";
          a.download = `products_template_${brandName}.xlsx`;
          
          document.body.appendChild(a);
          a.click();
          a.remove();
      } catch (error) {
          console.error(error);
          alert("Failed to download template");
      }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 text-[12px] bg-white text-black hover:bg-gray-50 border-gray-200 font-semibold uppercase tracking-wider px-5 rounded-lg shadow-sm">
          <Download className="w-3.5 h-3.5 mr-2" /> Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Export Products</DialogTitle>
          <DialogDescription className="text-gray-500">
            Download your product data as an Excel file. You can choose to export all products or filter by a specific brand.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Filter by Brand</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[9999]">
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div className="flex justify-between items-center pt-2">
                <Button variant="ghost" className="text-xs underline text-gray-500 hover:text-black" onClick={handleDownloadTemplate}>
                    Download Empty Template
                </Button>
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button className="bg-black text-white hover:bg-gray-800" onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {isExporting ? "Exporting..." : "Export Excel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
