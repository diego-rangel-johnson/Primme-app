"use client";

import React, { useState } from "react";
import { 
  X, 
  Plus, 
  Trash2, 
  FileText, 
  DollarSign, 
  Ruler, 
  PaintBucket, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
}

interface QuoteEditorProps {
  onClose: () => void;
  opportunity?: {
    title: string;
    sqft: string;
    budget: string;
  };
}

export function QuoteEditor({ onClose, opportunity }: QuoteEditorProps) {
  const [items, setItems] = useState<QuoteItem[]>([
    { id: "1", description: "Surface Preparation & Sanding", quantity: 1, unit: "flat", price: 450 },
    { id: "2", description: "Premium Low-VOC Paint Application", quantity: Number(opportunity?.sqft || 0), unit: "sqft", price: 2.5 }
  ]);

  const [materials, setMaterials] = useState([
    { name: "Farrow & Ball - Estate Emulsion", selected: true },
    { name: "Sherwin-Williams Emerald", selected: false }
  ]);

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: "New Line Item", quantity: 1, unit: "unit", price: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleGenerate = () => {
    toast.success("Proposal Generated Successfully!", {
      description: "A premium interactive link has been created for your client."
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-5xl max-h-full bg-background rounded-3xl shadow-overlay overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-white/10">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground tracking-tight">Smart Quoting Engine</h2>
              <p className="text-label text-muted-foreground">Client: {opportunity?.title || "Custom Project"}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Left Column: Editor */}
              <div className="lg:col-span-2 space-y-10">
                
                {/* Project Context */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Ruler className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-extrabold text-foreground uppercase tracking-tight">Project Context</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-2xl border border-border/50">
                      <p className="text-label text-muted-foreground mb-1">Estimated Sq Ft</p>
                      <p className="text-xl font-bold text-foreground">{opportunity?.sqft || "0"} sqft</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-2xl border border-border/50">
                      <p className="text-label text-muted-foreground mb-1">Target Budget</p>
                      <p className="text-xl font-bold text-foreground">{opportunity?.budget || "N/A"}</p>
                    </div>
                  </div>
                </section>

                {/* Line Items */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-extrabold text-foreground uppercase tracking-tight">Line Items</h3>
                    </div>
                    <Button variant="outline" size="sm" onClick={addItem} className="rounded-xl font-bold gap-2 bg-background hover:bg-muted">
                      <Plus className="w-4 h-4" /> Add Item
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="group grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 rounded-2xl border border-border/40 bg-card hover:border-primary/30 transition-all shadow-card">
                        <div className="md:col-span-6">
                          <Input 
                            value={item.description}
                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            className="h-10 border-none bg-transparent focus-visible:ring-0 font-bold px-1"
                            placeholder="Description"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input 
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                            className="h-10 text-center border-border/30 bg-muted/30 rounded-lg font-bold"
                          />
                        </div>
                        <div className="md:col-span-3 flex items-center gap-2">
                          <span className="text-muted-foreground font-black text-xs">$</span>
                          <Input 
                            type="number"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                            className="h-10 border-border/30 bg-muted/30 rounded-lg font-bold"
                          />
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Material Selection */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <PaintBucket className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-extrabold text-foreground uppercase tracking-tight">Premium Materials</h3>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {materials.map((m, i) => (
                      <button 
                        key={i}
                        onClick={() => setMaterials(materials.map((mat, idx) => ({ ...mat, selected: i === idx })))}
                        className={`px-6 py-3 rounded-2xl border-2 transition-all font-bold flex items-center gap-3 ${
                          m.selected 
                            ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5" 
                            : "border-border/40 bg-card text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        {m.selected && <CheckCircle2 className="w-5 h-5" />}
                        {m.name}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Preview/Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-0 space-y-8">
                  <div className="bg-muted/30 rounded-3xl p-8 border border-border/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mx-10 -my-10" />
                    
                    <h4 className="text-label text-muted-foreground mb-8 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Proposal Summary
                    </h4>

                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground font-black">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-muted-foreground">Premium Surcharge (0%)</span>
                        <span className="text-foreground font-black">$0.00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-muted-foreground">Processing Fee (8.25%)</span>
                        <span className="text-foreground font-black">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <Separator className="bg-border/40 my-4" />
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-black text-foreground uppercase tracking-tight">Total</span>
                        <div className="text-right">
                          <span className="text-3xl font-black text-primary tracking-tighter">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-label text-primary-dark/80 leading-relaxed">
                          Includes Primme Payment Protection & Escrow Guarantee
                        </p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-2xl border border-border/50 flex items-start gap-3">
                        <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-meta text-muted-foreground leading-relaxed">
                          Client will be able to review and sign digitally via FaceID.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button variant="brand" className="w-full h-16 rounded-2xl text-lg font-bold ring-1 ring-inset ring-white/15 shadow-xl shadow-primary/20 relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95" onClick={handleGenerate}>
                    <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-2 mr-2"><ArrowRight className="w-5 h-5" strokeWidth={2.5} /></span>
                    Generate Proposal
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
