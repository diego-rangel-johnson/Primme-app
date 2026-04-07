"use client";

import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BrandBrowser } from "@/components/inspiration/palettes/brand-browser";
import { PaletteCard } from "@/components/inspiration/palettes/palette-card";
import { PaletteGenerator } from "@/components/inspiration/palettes/palette-generator";
import { HarmonyWheel } from "@/components/inspiration/palettes/harmony-wheel";
import { InspirationPageHeader } from "@/components/inspiration/page-header";
import { InspirationSubNav } from "@/components/inspiration/inspiration-sub-nav";
import { getColorPalettes, saveColorPalette, deleteColorPalette } from "@/lib/inspiration/store";
import type { ColorPalette, PaintColor } from "@/lib/inspiration/types";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function PalettesPage() {
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [selectedColor, setSelectedColor] = useState<PaintColor | null>(null);

  useEffect(() => {
    setPalettes(getColorPalettes());
  }, []);

  const handleSavePalette = (colors: string[], name?: string) => {
    const palette = saveColorPalette({
      name: name ?? `Custom Palette ${new Date().toLocaleDateString()}`,
      colors,
      userId: "usr_client_1",
    });
    setPalettes(getColorPalettes());
    toast.success(`Palette "${palette.name}" saved`);
  };

  const handleDelete = (id: string) => {
    deleteColorPalette(id);
    setPalettes(getColorPalettes());
    toast.success("Palette deleted");
  };

  return (
    <div className="min-h-full bg-muted/20 pb-20">
      <InspirationPageHeader
        icon={Palette}
        badge="Palettes"
        title="Color Palettes"
        subtitle="Explore premium paint colors, generate palettes, and find harmonious combinations."
      />
      <InspirationSubNav />

      <div className="px-6 lg:px-10 py-8">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="bg-muted/40 p-1 rounded-xl border border-border/30 h-auto">
            <TabsTrigger value="browse" className="rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:shadow-sm">
              Browse Colors
            </TabsTrigger>
            <TabsTrigger value="generate" className="rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:shadow-sm">
              Generate
            </TabsTrigger>
            <TabsTrigger value="harmony" className="rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:shadow-sm">
              Harmony
            </TabsTrigger>
            <TabsTrigger value="saved" className="rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:shadow-sm">
              My Palettes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <BrandBrowser
                  onColorSelect={setSelectedColor}
                  selectedColorId={selectedColor?.id}
                />
              </div>
              <div className="space-y-6">
                {selectedColor && (
                  <motion.div
                    key={selectedColor.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="p-5 rounded-2xl border border-border/40 bg-card"
                  >
                    <div
                      className="w-full h-28 rounded-xl mb-4 border border-border/20"
                      style={{ backgroundColor: selectedColor.hex }}
                    />
                    <h3 className="text-h3 font-display">{selectedColor.name}</h3>
                    <p className="text-body-sm text-muted-foreground">{selectedColor.brandDisplayName}</p>
                    <div className="flex gap-4 mt-2 text-meta">
                      <span className="font-mono">{selectedColor.hex.toUpperCase()}</span>
                      <span>LRV {selectedColor.lrv}</span>
                      <span className="capitalize">{selectedColor.family}</span>
                    </div>
                  </motion.div>
                )}

                <div className="p-5 rounded-2xl border border-border/40 bg-card">
                  <h3 className="text-title mb-4">Curated Palettes</h3>
                  <div className="space-y-3">
                    {palettes.slice(0, 4).map((pal) => (
                      <PaletteCard key={pal.id} palette={pal} showActions={false} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="generate">
            <div className="max-w-xl">
              <PaletteGenerator
                onPaletteGenerated={(colors) => handleSavePalette(colors, "Extracted Palette")}
              />
            </div>
          </TabsContent>

          <TabsContent value="harmony">
            <div className="max-w-xl">
              <HarmonyWheel
                baseColor={selectedColor?.hex}
                onPaletteSave={(colors) => handleSavePalette(colors, "Harmony Palette")}
              />
            </div>
          </TabsContent>

          <TabsContent value="saved">
            {palettes.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-foreground font-semibold">No palettes saved yet</p>
                <p className="text-body-sm text-muted-foreground mt-1">
                  Generate or create palettes in the other tabs.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {palettes.map((pal) => (
                  <PaletteCard
                    key={pal.id}
                    palette={pal}
                    onDelete={pal.id.startsWith("pal-custom-") ? () => handleDelete(pal.id) : undefined}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
