"use client";

import { useState } from "react";
import Link from "next/link";
import { Link2, Image as ImageIcon, Send, ArrowLeft, Save, Plus, Trash2, Check, FileText, Building, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSession } from "@/context/session-context";

export default function SmartQuotingEngine() {
  const { user } = useSession();

  // Form State
  const [clientName, setClientName] = useState("Sarah Jenkins");
  const [address, setAddress] = useState("Malibu, CA");
  const [projectTitle, setProjectTitle] = useState("Ocean View Exterior Renovation");
  const [description, setDescription] = useState("Complete exterior repaint of luxury ocean-front residence. High attention to detail required due to salt air exposure.");
  
  const [items, setItems] = useState([
    { id: 1, name: "Exterior Preparation & Power Washing", price: 1200 },
    { id: 2, name: "Premium Weather-Resistant Primer", price: 850 },
    { id: 3, name: "Final Coat (Sherwin-Williams Emerald)", price: 4500 }
  ]);

  const [images, _setImages] = useState([
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop"
  ]);

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.08; // 8% placeholder tax
  const total = subtotal + tax;

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), name: "New Service Item", price: 0 }]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleGenerate = () => {
    toast.success("Generating premium PDF proposal...");
    setTimeout(() => {
      toast.success("Ready! Proposal link copied to clipboard.");
    }, 2000);
  };

  return (
    <div className="min-h-full flex flex-col bg-muted/20 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50 px-6 lg:px-8 py-5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <Link href="..">
              <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-muted-foreground hover:text-foreground font-bold">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Details
              </Button>
            </Link>
            <h2 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              Smart Quoting Studio
            </h2>
            <p className="text-muted-foreground mt-1 font-medium">
              Create and manage premium proposals that win clients.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300">
              <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                <Save className="w-4 h-4 text-primary" />
              </span>
              Save Draft
            </Button>
            <Button variant="brand" className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold" onClick={handleGenerate}>
              <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                <Send className="w-4 h-4" strokeWidth={2.5} />
              </span>
              Generate Proposal
            </Button>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Editor Side */}
        <div className="space-y-6">
          
          {/* Section 1: Client & Project Info */}
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40">
            <h3 className="text-lg font-extrabold text-foreground tracking-tight mb-6 flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" /> Project Details
            </h3>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-label text-muted-foreground">Client Name</Label>
                  <Input 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="h-12 rounded-xl bg-background border-border/50 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-label text-muted-foreground">Address</Label>
                  <Input 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-12 rounded-xl bg-background border-border/50 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-label text-muted-foreground">Project Title</Label>
                <Input 
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="h-12 rounded-xl bg-background border-border/50 font-medium text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-label text-muted-foreground">Scope of Work</Label>
                <Textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] rounded-xl bg-background border-border/50 font-medium resize-none p-4"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Line Items */}
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-foreground tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Services & Materials
              </h3>
              <Button variant="outline" size="sm" onClick={handleAddItem} className="rounded-lg text-label border-primary/20 hover:bg-primary/5 hover:text-primary">
                <Plus className="w-3 h-3 mr-1" /> Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border/50 group hover:border-border transition-colors">
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-muted text-xs font-bold text-muted-foreground shrink-0">
                    {index + 1}
                  </div>
                  <Input 
                    value={item.name}
                    onChange={(e) => handleUpdateItem(item.id, "name", e.target.value)}
                    className="h-10 border-transparent bg-transparent focus-visible:ring-1 focus-visible:ring-border px-2 flex-grow min-w-0"
                    placeholder="Item description"
                  />
                  <div className="relative shrink-0 w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                    <Input 
                      type="number"
                      value={item.price}
                      onChange={(e) => handleUpdateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                      className="h-10 pl-7 text-right bg-transparent border-border/30 focus-visible:bg-background"
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="w-10 h-10 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border/50 space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold text-muted-foreground">
                <span>Tax (8%)</span>
                <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-4 flex justify-between items-end border-t border-border/30 mt-4">
                <span className="text-label text-foreground">Total Estimate</span>
                <span className="text-3xl font-black text-primary">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Visuals */}
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40">
            <h3 className="text-lg font-extrabold text-foreground tracking-tight mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> Visuals & Conditions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-border group">
                  <img src={img} className="w-full h-full object-cover" alt="Condition" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="icon" className="w-8 h-8 rounded-full" onClick={() => toast.success("Image removed")}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="aspect-video rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 group" onClick={() => toast.info("Opening file uploader...")}>
                <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-background flex items-center justify-center transition-colors">
                  <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </div>
                <span className="text-xs font-bold text-muted-foreground">Add Context Photo</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Live Preview Side */}
        <div className="lg:sticky lg:top-32 h-fit">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-label text-muted-foreground flex items-center gap-2">
              <MonitorSmartphone className="w-4 h-4" /> Interactive Preview
            </h3>
            <span className="px-2 py-1 bg-success/10 text-success text-label rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Live Updating
            </span>
          </div>

          {/* Mock PDF Document Container */}
          <div className="w-full aspect-[1/1.4] bg-white rounded-xl shadow-overlay border border-border/20 overflow-hidden flex flex-col relative scale-100 origin-top animate-in zoom-in-95 duration-500">
            
            {/* Dark Premium Header */}
            <div className="h-32 bg-ink w-full p-8 flex items-center justify-between text-white shrink-0">
              <div>
                <h1 className="text-2xl font-black tracking-tighter mix-blend-overlay">Primme</h1>
                <p className="text-label text-primary/80 mt-1">Certified Provider</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold opacity-80">{user?.name || "Provider Co."}</p>
                <p className="text-label opacity-50 mt-1">Estimate #INV-8832</p>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-8 flex-1 flex flex-col">
              
              <div className="flex justify-between items-end mb-8 border-b border-neutral-100 pb-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1">Prepared For</p>
                  <p className="text-neutral-900 font-bold">{clientName || "Client Name"}</p>
                  <p className="text-neutral-500 text-xs">{address || "Project Address"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1">Total Investment</p>
                  <p className="text-2xl font-black text-neutral-900 tracking-tight">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Project Overview</h4>
                <p className="text-lg font-extrabold text-neutral-900 leading-tight mb-2">{projectTitle || "Project Title"}</p>
                <p className="text-xs text-neutral-600 leading-relaxed font-medium line-clamp-3">
                  {description || "Description of work to be performed..."}
                </p>
              </div>

              {/* Minimal Line Items */}
              <div className="mt-4 mb-auto">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">Cost Breakdown</h4>
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  {items.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border-b border-neutral-100 last:border-0 bg-neutral-50/50">
                      <span className="text-xs font-bold text-neutral-700 truncate max-w-[70%]">{item.name || "Item description"}</span>
                      <span className="text-xs font-bold text-neutral-900">${(item.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                  {items.length > 4 && (
                    <div className="p-3 text-center bg-neutral-50 text-[10px] font-bold text-neutral-400 uppercase">
                      + {items.length - 4} more items...
                    </div>
                  )}
                </div>
              </div>

              {/* Branded Footer */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-neutral-100 shrink-0">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Primme Verified Guarantee</span>
                </div>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Page 1 of 3</span>
              </div>
            </div>

            {/* Simulated Digital Wrapper Gradient overlay */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.02)]" />
          </div>

          <p className="text-center text-xs font-bold text-muted-foreground mt-6 flex items-center justify-center gap-2">
            <Link2 className="w-4 h-4" />
            Clients will receive an interactive link, not just a static PDF.
          </p>

        </div>
      </div>
    </div>
  );
}
