"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

export function ImportProductsModal({ brands }: { brands: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("none");
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setFile(e.target.files[0]);
      }
  };

  const handleImport = async () => {
    if (!file) {
        toast.error("Please select a file to import");
        return;
    }

    try {
      setIsImporting(true);
      
      const formData = new FormData();
      formData.append("file", file);
      if (selectedBrand !== "none") {
          formData.append("brandId", selectedBrand);
      }

      const response = await fetch("/api/admin/products/import", {
          method: "POST",
          body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || "Import failed");
      }
      
      toast.success(data.message || `Successfully imported products`);
      setOpen(false);
      
      // Refresh page to show new products
      window.location.reload();
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to import products");
    } finally {
      setIsImporting(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 text-[12px] bg-white text-black hover:bg-gray-50 border-gray-200 font-semibold uppercase tracking-wider px-5 rounded-lg shadow-sm">
          <Upload className="w-3.5 h-3.5 mr-2" /> Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Import Products</DialogTitle>
          <DialogDescription className="text-gray-500">
            Upload an Excel (.xlsx) file to bulk create or update products. 
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Force Brand Override (Optional)</label>
                <p className="text-[11px] text-gray-400">If selected, all imported products will be assigned to this brand, ignoring the sheet's brand column.</p>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[9999]">
                    <SelectItem value="none">Use Sheet Data</SelectItem>
                    {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Excel File</label>
                <div 
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <FileUp className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-black">
                        {file ? file.name : "Click to select .xlsx file"}
                    </span>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".xlsx, .xls, .csv" 
                        onChange={handleFileChange}
                    />
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isImporting}>
            Cancel
          </Button>
          <Button className="bg-black text-white hover:bg-gray-800" onClick={handleImport} disabled={isImporting || !file}>
            {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {isImporting ? "Importing..." : "Start Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
