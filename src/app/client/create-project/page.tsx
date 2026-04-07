"use client";

import { X, Home, TreePine, Layers, ArrowRight, ArrowLeft, Check, Ruler, PaintBucket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/context/session-context";

export default function CreateProjectPage() {
  const router = useRouter();
  const { user } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedScope, setSelectedScope] = useState<string | null>(null);
  const [selectedOccupancy, setSelectedOccupancy] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const [sqft, setSqft] = useState("");
  const [rooms, setRooms] = useState("");
  const [ceilingHeight, setCeilingHeight] = useState("standard");
  const [address, setAddress] = useState("");

  const [surfaceCondition, setSurfaceCondition] = useState<string | null>(null);
  const [accessLevel, setAccessLevel] = useState<string | null>(null);
  const [preferredDate, setPreferredDate] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [stepErrors, setStepErrors] = useState<Record<number, string>>({});

  const steps = [
    { number: 1, title: "Project Scope", subtitle: "WHAT NEEDS TO BE PAINTED?" },
    { number: 2, title: "Dimensions", subtitle: "SIZE AND DETAILS" },
    { number: 3, title: "Condition", subtitle: "SURFACE AND ACCESS" },
    { number: 4, title: "Review", subtitle: "CONFIRM DETAILS" },
  ];

  const scopes = [
    { id: "interior", icon: Home, title: "INTERIOR", description: "LIVING SPACES, WALLS & PRECISION TRIM" },
    { id: "exterior", icon: TreePine, title: "EXTERIOR", description: "SIDING, FACADES & HIGH-IMPACT DECKS" },
    { id: "fullhouse", icon: Layers, title: "FULL HOUSE", description: "COMPLETE STRUCTURAL & FACADE WORK" },
  ];

  const occupancyOptions = [
    { id: "occupied", title: "OCCUPIED", subtitle: "ACTIVE LIVING" },
    { id: "vacant", title: "VACANT", subtitle: "EMPTY CANVAS" },
  ];

  const surfaceOptions = [
    { id: "good", label: "Good", desc: "Minor touch-ups needed" },
    { id: "fair", label: "Fair", desc: "Some prep work required" },
    { id: "poor", label: "Poor", desc: "Extensive prep and repair" },
  ];

  const accessOptions = [
    { id: "easy", label: "Easy Access", desc: "Ground level, no obstructions" },
    { id: "moderate", label: "Moderate", desc: "Some ladders or scaffolding" },
    { id: "difficult", label: "Difficult", desc: "High areas, tight spaces" },
  ];

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!selectedScope) { setStepErrors({ 1: "Please select a project scope." }); return false; }
        if (!selectedOccupancy) { setStepErrors({ 1: "Please select occupancy status." }); return false; }
        break;
      case 2:
        if (!sqft.trim()) { setStepErrors({ 2: "Please enter the square footage." }); return false; }
        if (!rooms.trim()) { setStepErrors({ 2: "Please enter the number of rooms." }); return false; }
        if (!address.trim()) { setStepErrors({ 2: "Please enter the property address." }); return false; }
        break;
      case 3:
        if (!surfaceCondition) { setStepErrors({ 3: "Please select the surface condition." }); return false; }
        if (!accessLevel) { setStepErrors({ 3: "Please select the access level." }); return false; }
        break;
    }
    setStepErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(4, currentStep + 1));
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    const supabase = createClient();
    const title = `${selectedScope === "fullhouse" ? "Full House" : selectedScope === "exterior" ? "Exterior" : "Interior"} Painting - ${address.trim() || "New Project"}`;
    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      title,
      status: "draft",
      description: [notes, additionalNotes].filter(Boolean).join("\n") || null,
      address: address.trim() || null,
      type: selectedScope,
      progress: 0,
    });
    if (error) {
      toast.error("Failed to create project: " + error.message);
      return;
    }
    toast.success("Project submitted successfully! You'll be matched with qualified providers.");
    router.push("/client/projects");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

      <div className="w-full max-w-5xl animate-in fade-in zoom-in-95 duration-700">
        <Button asChild variant="ghost" size="icon" className="absolute top-4 right-4 sm:top-8 sm:right-8 rounded-full bg-background border border-border/50 shadow-card hover:shadow-md hover:bg-muted transition-all z-20">
          <Link href="/client/dashboard"><X className="w-5 h-5" /></Link>
        </Button>

        <div className="text-center mb-16 relative z-10">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-label rounded-full mb-6 ring-1 ring-primary/20 shadow-card">
            Project Wizard
          </span>
          <h1 className="text-h1 font-display text-foreground mb-4 tracking-tight">Create New Project</h1>
          <p className="text-muted-foreground text-lg font-medium max-w-lg mx-auto">Tell us about your painting project and get matched with elite, certified providers.</p>
        </div>

        {/* Dynamic Progress Stepper */}
        <div className="mb-16 relative z-10">
          <div className="flex items-center justify-between max-w-4xl mx-auto relative z-10">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center flex-1 relative">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg transition-all duration-500 shadow-card z-10 ${currentStep > step.number
                    ? "bg-success text-white shadow-success/20 shadow-lg scale-95"
                    : currentStep === step.number
                      ? "bg-primary text-white shadow-primary/30 shadow-xl ring-4 ring-primary/20 scale-110"
                      : "bg-background text-muted-foreground border-2 border-border/50"
                  }`}>
                  {currentStep > step.number ? <Check className="w-6 h-6" strokeWidth={3} /> : step.number}
                </div>

                <div className={`mt-6 text-center transition-all duration-300 ${currentStep === step.number ? "opacity-100 scale-100 translate-y-0" : "opacity-70 scale-95 -translate-y-1"}`}>
                  <p className={`font-extrabold text-sm tracking-wide ${currentStep === step.number ? "text-primary" : currentStep > step.number ? "text-foreground" : "text-muted-foreground"}`}>{step.title}</p>
                  <p className="text-label text-muted-foreground mt-1 hidden md:block">{step.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar Track */}
          <div className="absolute top-7 left-[10%] right-[10%] h-1 bg-border/50 -z-0 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-success transition-all duration-700 ease-out"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Error banner */}
        {stepErrors[currentStep] && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-bold text-center animate-in fade-in slide-in-from-top-2">
            {stepErrors[currentStep]}
          </div>
        )}

        <div className="bg-card rounded-3xl p-8 lg:p-14 min-h-[500px] shadow-2xl shadow-neutral-900/5 border border-border/40 relative overflow-hidden z-10">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {scopes.map((scope) => {
                  const Icon = scope.icon;
                  return (
                    <Button key={scope.id} variant="outline" onClick={() => { setSelectedScope(scope.id); setStepErrors({}); }}
                      className={`group relative h-auto p-8 rounded-3xl border-2 whitespace-normal transition-all duration-300 ${selectedScope === scope.id
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-4 ring-primary/10 scale-[1.02]"
                          : "border-border hover:border-primary/40 hover:bg-muted/50 hover:shadow-md hover:-translate-y-1"
                        }`}>
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${selectedScope === scope.id
                            ? "bg-primary text-white shadow-inner scale-110 rotate-3"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                          }`}><Icon className="w-10 h-10" strokeWidth={1.5} /></div>
                        <h3 className="text-h3 font-display text-foreground mb-3">{scope.title}</h3>
                        <p className="text-label text-muted-foreground leading-relaxed">{scope.description}</p>
                      </div>

                      {/* Selection Indicator Ring */}
                      <div className={`absolute top-5 right-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedScope === scope.id ? "border-primary bg-primary scale-110" : "border-muted-foreground/30"
                        }`}>
                        {selectedScope === scope.id && <Check className="w-4 h-4 text-white animate-in zoom-in" strokeWidth={3} />}
                      </div>
                    </Button>
                  );
                })}
              </div>

              <div className="bg-muted/40 rounded-3xl p-8 border border-border/50">
                <h3 className="text-h2 font-display text-foreground mb-8">Additional Context</h3>

                <div className="mb-8">
                  <Label className="block text-label text-muted-foreground mb-4">Occupancy Status *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {occupancyOptions.map((option) => (
                      <Button key={option.id} variant="outline" onClick={() => { setSelectedOccupancy(option.id); setStepErrors({}); }}
                        className={`relative h-auto p-6 rounded-2xl border-2 whitespace-normal text-left flex-col items-start transition-all duration-300 ${selectedOccupancy === option.id
                            ? "border-primary bg-primary/5 shadow-card ring-2 ring-primary/10"
                            : "border-border hover:border-primary/40 hover:bg-muted"
                          }`}>
                        <div className="flex items-center justify-between w-full mb-1">
                          <h4 className="text-h3 font-display text-foreground">{option.title}</h4>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedOccupancy === option.id ? "border-primary bg-primary" : "border-muted-foreground/30"
                            }`}>
                            {selectedOccupancy === option.id && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                          </div>
                        </div>
                        <p className="text-label text-muted-foreground mt-2">{option.subtitle}</p>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="block text-label text-muted-foreground mb-4">Structural Notes</Label>
                  <Textarea placeholder="Any specific exclusions, color requirements, or HOA rules providers should know about..."
                    className="resize-none h-32 rounded-2xl border-border/60 bg-background hover:border-primary/40 focus:border-primary focus:ring-primary/20 transition-colors p-4 block w-full text-base font-medium shadow-card"
                    value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dimensions */}
          {currentStep === 2 && (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-5 mb-10 pb-6 border-b border-border/50">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                  <Ruler className="w-8 h-8 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-h1 font-display text-foreground tracking-tight">Property Dimensions</h3>
                  <p className="text-muted-foreground font-medium mt-1">Help us understand the size and layout of your canvas.</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <Label htmlFor="sqft" className="block text-label text-muted-foreground mb-3 group-focus-within:text-primary transition-colors">Total Square Footage *</Label>
                    <div className="relative">
                      <Input id="sqft" type="number" placeholder="2500" value={sqft} onChange={(e) => { setSqft(e.target.value); setStepErrors({}); }} required
                        className="h-14 rounded-xl border-2 border-border/60 bg-muted/20 pl-4 pr-16 text-lg font-bold focus-visible:border-primary focus-visible:ring-primary/20 hover:border-primary/40 transition-all shadow-card" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">sq ft</span>
                    </div>
                  </div>
                  <div className="group">
                    <Label htmlFor="rooms" className="block text-label text-muted-foreground mb-3 group-focus-within:text-primary transition-colors">Number of Rooms *</Label>
                    <Input id="rooms" type="number" placeholder="e.g. 8" value={rooms} onChange={(e) => { setRooms(e.target.value); setStepErrors({}); }} required
                      className="h-14 rounded-xl border-2 border-border/60 bg-muted/20 px-4 text-lg font-bold focus-visible:border-primary focus-visible:ring-primary/20 hover:border-primary/40 transition-all shadow-card" />
                  </div>
                </div>

                <div>
                  <Label className="block text-label text-muted-foreground mb-4">Ceiling Height</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: "standard", label: "Standard", desc: "8-9 feet" },
                      { id: "tall", label: "Tall", desc: "10-12 feet" },
                      { id: "vaulted", label: "Vaulted", desc: "12+ feet" },
                    ].map((opt) => (
                      <button key={opt.id} type="button" onClick={() => setCeilingHeight(opt.id)}
                        className={`relative p-5 rounded-2xl border-2 flex flex-col items-start transition-all duration-300 ${ceilingHeight === opt.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/10 shadow-card"
                            : "border-border hover:border-primary/40 bg-card hover:bg-muted"
                          }`}>
                        <span className={`font-extrabold mb-1 ${ceilingHeight === opt.id ? "text-primary" : "text-foreground"}`}>{opt.label}</span>
                        <span className="text-xs font-bold text-muted-foreground">{opt.desc}</span>

                        <div className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 transition-colors ${ceilingHeight === opt.id ? "border-primary bg-primary" : "border-muted-foreground/30"
                          }`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="group">
                  <Label htmlFor="address" className="block text-label text-muted-foreground mb-3 group-focus-within:text-primary transition-colors">Property Address *</Label>
                  <Input id="address" placeholder="123 Main St, City, State, ZIP" value={address} onChange={(e) => { setAddress(e.target.value); setStepErrors({}); }} required
                    className="h-14 rounded-xl border-2 border-border/60 bg-muted/20 px-4 text-lg font-bold focus-visible:border-primary focus-visible:ring-primary/20 hover:border-primary/40 transition-all shadow-card" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Condition */}
          {currentStep === 3 && (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-5 mb-10 pb-6 border-b border-border/50">
                <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center shadow-inner">
                  <PaintBucket className="w-8 h-8 text-warning" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-h1 font-display text-foreground tracking-tight">Surface Condition</h3>
                  <p className="text-muted-foreground font-medium mt-1">Help providers prepare accurate estimates and material orders.</p>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <Label className="block text-label text-muted-foreground mb-4">Current Surface Condition *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {surfaceOptions.map((opt) => (
                      <button key={opt.id} type="button" onClick={() => { setSurfaceCondition(opt.id); setStepErrors({}); }}
                        className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${surfaceCondition === opt.id
                            ? "border-primary bg-primary/5 shadow-card ring-2 ring-primary/10"
                            : "border-border hover:border-primary/40 hover:bg-muted"
                          }`}>
                        <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${surfaceCondition === opt.id ? "border-primary bg-primary" : "border-muted-foreground/30"
                          }`}>
                          {surfaceCondition === opt.id && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <p className={`text-lg font-extrabold mb-2 ${surfaceCondition === opt.id ? "text-primary" : "text-foreground"}`}>{opt.label}</p>
                        <p className="text-xs font-semibold text-muted-foreground leading-relaxed">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="block text-label text-muted-foreground mb-4">Site Access Level *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {accessOptions.map((opt) => (
                      <button key={opt.id} type="button" onClick={() => { setAccessLevel(opt.id); setStepErrors({}); }}
                        className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${accessLevel === opt.id
                            ? "border-primary bg-primary/5 shadow-card ring-2 ring-primary/10"
                            : "border-border hover:border-primary/40 hover:bg-muted"
                          }`}>
                        <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${accessLevel === opt.id ? "border-primary bg-primary" : "border-muted-foreground/30"
                          }`}>
                          {accessLevel === opt.id && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <p className={`text-lg font-extrabold mb-2 ${accessLevel === opt.id ? "text-primary" : "text-foreground"}`}>{opt.label}</p>
                        <p className="text-xs font-semibold text-muted-foreground leading-relaxed">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/50">
                  <div className="group">
                    <Label htmlFor="preferredDate" className="block text-label text-muted-foreground mb-3 group-focus-within:text-primary transition-colors">Preferred Start Date</Label>
                    <Input id="preferredDate" type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)}
                      className="h-14 rounded-xl border-2 border-border/60 bg-muted/20 px-4 text-base font-bold focus-visible:border-primary focus-visible:ring-primary/20 hover:border-primary/40 transition-all shadow-card" />
                  </div>
                  <div className="group">
                    <Label htmlFor="additionalNotes" className="block text-label text-muted-foreground mb-3 group-focus-within:text-primary transition-colors">Additional Materials Notes</Label>
                    <Textarea id="additionalNotes" placeholder="Paint brands, finishes, or existing damage to repair..."
                      className="resize-none h-14 min-h-[56px] rounded-xl border-2 border-border/60 bg-muted/20 hover:border-primary/40 focus:border-primary focus:ring-primary/20 transition-all py-3.5 px-4 font-medium shadow-card"
                      value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center justify-center text-center flex-col gap-4 mb-10 pb-8 border-b border-border/50">
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center shadow-inner relative">
                  <div className="absolute inset-0 bg-success/20 blur-xl rounded-full" />
                  <Check className="w-10 h-10 text-success relative z-10" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-h1 font-display text-foreground tracking-tight">Review Your Project</h3>
                  <p className="text-muted-foreground font-medium mt-2">Almost there! Confirm your details to submit securely.</p>
                </div>
              </div>

              <div className="bg-muted/30 border border-border/50 rounded-3xl p-8 space-y-2 relative overflow-hidden">
                {[
                  { label: "Project Scope", value: scopes.find(s => s.id === selectedScope)?.title || selectedScope },
                  { label: "Occupancy", value: occupancyOptions.find(o => o.id === selectedOccupancy)?.title || selectedOccupancy },
                  { label: "Dimensions", value: sqft ? `${sqft} sq ft, ${rooms} rooms` : undefined },
                  { label: "Ceiling Height", value: ceilingHeight },
                  { label: "Address", value: address },
                  { label: "Surface & Access", value: `${surfaceCondition} condition, ${accessLevel} access` },
                  { label: "Timeline", value: preferredDate ? `Starting ${new Date(preferredDate).toLocaleDateString()}` : "Flexible Timeline" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-border/40 last:border-0 hover:bg-muted/40 px-4 rounded-xl transition-colors">
                    <span className="text-label text-muted-foreground">{item.label}</span>
                    <span className="font-extrabold text-foreground capitalize mt-1 sm:mt-0 text-sm">{item.value ?? "Not set"}</span>
                  </div>
                ))}

                {(notes || additionalNotes) && (
                  <div className="mt-6 pt-6 border-t border-border/50 px-4">
                    <span className="text-label text-muted-foreground block mb-3">Additional Notes</span>
                    <p className="text-foreground text-sm font-medium bg-background border border-border/40 p-4 rounded-xl italic text-muted-foreground leading-relaxed">
                      "{[notes, additionalNotes].filter(Boolean).join(" | ")}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Navigation Actions */}
        <div className="flex items-center justify-between mt-10 max-w-5xl mx-auto px-2">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="h-14 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300 z-10"
          >
            <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
              <ArrowLeft className="w-4 h-4 text-primary" />
            </span>
            Back
          </Button>

          {currentStep < 4 ? (
            <Button
              variant="brand"
              onClick={handleNext}
              className="h-14 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold w-full sm:w-auto text-base z-10"
            >
              <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </span>
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="gap-2 rounded-2xl h-14 px-10 font-bold shadow-lg shadow-success/20 bg-success text-success-foreground hover:bg-success/90 hover:shadow-xl hover:shadow-success/30 hover:-translate-y-0.5 transition-all text-base animate-in fade-in zoom-in-95 z-10"
            >
              <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                <Check className="w-4 h-4" strokeWidth={2.5} />
              </span>
              Submit Project
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
