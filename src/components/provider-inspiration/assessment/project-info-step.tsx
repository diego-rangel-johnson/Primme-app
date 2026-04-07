"use client";

import { useState } from "react";
import { MapPin, User, Home, Ruler, FileText, Clock, Zap, Flame, Timer } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Assessment, UrgencyLevel } from "@/lib/inspiration/provider-types";
import type { RoomCategory } from "@/lib/inspiration/types";

const ROOM_TYPES: { value: RoomCategory; label: string }[] = [
  { value: "living-room", label: "Living Room" },
  { value: "kitchen", label: "Kitchen" },
  { value: "bedroom", label: "Bedroom" },
  { value: "bathroom", label: "Bathroom" },
  { value: "exterior", label: "Exterior" },
  { value: "office", label: "Office" },
  { value: "dining-room", label: "Dining Room" },
  { value: "hallway", label: "Hallway" },
];

const URGENCY_LEVELS: { value: UrgencyLevel; label: string; icon: React.ElementType; color: string; activeColor: string }[] = [
  { value: "low", label: "Low", icon: Clock, color: "bg-muted/50 text-muted-foreground border-border/40 hover:border-border", activeColor: "bg-muted/50 text-muted-foreground border-border shadow-md" },
  { value: "normal", label: "Normal", icon: Timer, color: "bg-primary/10 text-primary border-primary/30 hover:border-primary/50", activeColor: "bg-primary/10 text-primary border-primary/30 shadow-md" },
  { value: "high", label: "High", icon: Zap, color: "bg-accent/10 text-accent border-accent/30 hover:border-accent/50", activeColor: "bg-accent/10 text-accent border-accent/30 shadow-md" },
  { value: "urgent", label: "Urgent", icon: Flame, color: "bg-destructive/10 text-destructive border-destructive/30 hover:border-destructive/50", activeColor: "bg-destructive/10 text-destructive border-destructive/30 shadow-md" },
];

interface ProjectInfoStepProps {
  data: Pick<Assessment, "title" | "clientName" | "address" | "roomType" | "estimatedSqft" | "projectDescription" | "urgency">;
  onChange: (updates: Partial<Assessment>) => void;
  onNext: () => void;
}

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
      {children}
      <span className="text-primary">*</span>
    </Label>
  );
}

export function ProjectInfoStep({ data, onChange, onNext }: ProjectInfoStepProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const errors = {
    title: !data.title.trim() ? "Assessment title is required" : "",
    clientName: !data.clientName.trim() ? "Client name is required" : "",
    estimatedSqft: data.estimatedSqft <= 0 ? "Area must be greater than 0" : "",
  };

  const isValid = !errors.title && !errors.clientName && !errors.estimatedSqft && data.roomType;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-h3 font-display text-foreground tracking-tight mb-2">
          Project Information
        </h3>
        <p className="text-sm font-medium text-muted-foreground max-w-lg">
          Start by defining the project basics. If you came from an opportunity, these fields are pre-filled.
        </p>
      </div>

      {/* Project Title */}
      <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-primary" />
          <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">
            Project Details
          </h4>
        </div>

        <div className="space-y-2">
          <RequiredLabel>Assessment Title</RequiredLabel>
          <Input
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            onBlur={() => markTouched("title")}
            placeholder="e.g., Beverly Hills Master Suite Repaint"
            className={`h-12 rounded-xl border-border/50 bg-background font-medium text-lg ${
              touched.title && errors.title ? "border-destructive/50 focus-visible:ring-destructive/30" : ""
            }`}
          />
          {touched.title && errors.title && (
            <p className="text-xs font-medium text-destructive mt-1">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Scope Description
          </Label>
          <Textarea
            value={data.projectDescription}
            onChange={(e) => onChange({ projectDescription: e.target.value })}
            placeholder="Describe the work to be done..."
            className="min-h-[100px] rounded-xl border-border/50 bg-background font-medium resize-none p-4"
          />
        </div>
      </div>

      {/* Client Info */}
      <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-primary" />
          <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">
            Client Information
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <RequiredLabel>Client Name</RequiredLabel>
            <Input
              value={data.clientName}
              onChange={(e) => onChange({ clientName: e.target.value })}
              onBlur={() => markTouched("clientName")}
              placeholder="Full name"
              className={`h-12 rounded-xl border-border/50 bg-background font-medium ${
                touched.clientName && errors.clientName ? "border-destructive/50 focus-visible:ring-destructive/30" : ""
              }`}
            />
            {touched.clientName && errors.clientName && (
              <p className="text-xs font-medium text-destructive mt-1">{errors.clientName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Project Address
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={data.address}
                onChange={(e) => onChange({ address: e.target.value })}
                placeholder="Full address"
                className="h-12 pl-10 rounded-xl border-border/50 bg-background font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Room & Specs */}
      <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Home className="w-5 h-5 text-primary" />
          <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">
            Space Details
          </h4>
        </div>

        <div className="space-y-2">
          <RequiredLabel>Room Type</RequiredLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ROOM_TYPES.map((room) => (
              <button
                key={room.value}
                onClick={() => onChange({ roomType: room.value })}
                className={`p-3 rounded-xl border-2 text-sm font-bold transition-all text-center ${
                  data.roomType === room.value
                    ? "border-primary bg-primary/5 text-primary shadow-md shadow-primary/10"
                    : "border-border/40 bg-background text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                {room.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <RequiredLabel>Estimated Area</RequiredLabel>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                value={data.estimatedSqft || ""}
                onChange={(e) => onChange({ estimatedSqft: Number(e.target.value) || 0 })}
                onBlur={() => markTouched("estimatedSqft")}
                placeholder="0"
                className={`h-12 pl-10 rounded-xl border-border/50 bg-background font-medium ${
                  touched.estimatedSqft && errors.estimatedSqft ? "border-destructive/50 focus-visible:ring-destructive/30" : ""
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                sqft
              </span>
            </div>
            {touched.estimatedSqft && errors.estimatedSqft && (
              <p className="text-xs font-medium text-destructive mt-1">{errors.estimatedSqft}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Urgency
            </Label>
            <div className="flex gap-2">
              {URGENCY_LEVELS.map((level) => {
                const UrgencyIcon = level.icon;
                const isActive = data.urgency === level.value;
                return (
                  <button
                    key={level.value}
                    onClick={() => onChange({ urgency: level.value })}
                    className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-bold transition-all text-center ${
                      isActive
                        ? level.activeColor
                        : "border-border/30 bg-muted/20 text-muted-foreground hover:border-border/60"
                    }`}
                  >
                    <UrgencyIcon className="w-4 h-4" />
                    {level.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="h-12 px-8 rounded-xl font-bold shadow-md shadow-primary/25 glow-orange text-base"
        >
          Continue to Site Visit
        </Button>
      </div>
    </motion.div>
  );
}
