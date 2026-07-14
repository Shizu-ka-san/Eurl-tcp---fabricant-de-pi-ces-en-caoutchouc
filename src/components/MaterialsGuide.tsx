import React, { useState } from "react";
import { motion } from "motion/react";
import { MATERIALS } from "../data";
import { MaterialInfo } from "../types";
import { Check, AlertTriangle, HelpCircle, Thermometer, Flame, Gauge, ArrowRightLeft, ShieldAlert } from "lucide-react";
import BorderGlow from "./BorderGlow";

interface MaterialsGuideProps {
  theme?: "light" | "oled";
}

export default function MaterialsGuide({ theme = "light" }: MaterialsGuideProps) {
  const [selectedMat1, setSelectedMat1] = useState<string>("mat-nbr");
  const [selectedMat2, setSelectedMat2] = useState<string>("mat-epdm");

  const mat1 = MATERIALS.find((m) => m.id === selectedMat1) || MATERIALS[0];
  const mat2 = MATERIALS.find((m) => m.id === selectedMat2) || MATERIALS[1];

  // Rating scores for compare matrix (1 to 5)
  const ratings: Record<string, Record<string, number>> = {
    "mat-nbr": {
      oil: 5,
      temp: 2.5,
      weather: 1.5,
      mechanical: 4,
      cost: 4.5, // 5 = cheaper / better value
    },
    "mat-epdm": {
      oil: 1,
      temp: 3.5,
      weather: 5,
      mechanical: 3.5,
      cost: 4,
    },
    "mat-fkm": {
      oil: 5,
      temp: 5,
      weather: 5,
      mechanical: 4,
      cost: 1,
    },
    "mat-vmq": {
      oil: 2,
      temp: 4.5,
      weather: 5,
      mechanical: 1.5,
      cost: 2.5,
    },
    "mat-nr": {
      oil: 1,
      temp: 1.5,
      weather: 1,
      mechanical: 5,
      cost: 5,
    },
  };

  const getMetricStars = (materialId: string, metric: string) => {
    const val = ratings[materialId]?.[metric] || 1;
    return val;
  };

  const metricLabels = [
    { id: "oil", label: "Résistance Huiles & Carburants", description: "Comportement au contact direct d'hydrocarbures" },
    { id: "temp", label: "Plage de Température Max", description: "Maintien des propriétés à forte chaleur constante" },
    { id: "weather", label: "Résistance Extérieure (Ozone, UV)", description: "Vieillissement à l'air libre et aux intempéries" },
    { id: "mechanical", label: "Propriétés Mécaniques (Usure)", description: "Résistance à la traction, déchirure et abrasion" },
    { id: "cost", label: "Intérêt Économique (Coût Modéré)", description: "Rentabilité matière première pour grandes séries" },
  ];

  return (
    <section id="materiaux" className={`py-20 bg-transparent relative border-t ${theme === "oled" ? "border-zinc-900" : "border-[#1A1A1A]/10"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className={`text-left max-w-3xl space-y-4 mb-16 border-l-4 pl-6 ${theme === "oled" ? "border-orange-500" : "border-[#1A1A1A]"}`}>
          <span className={`text-xs uppercase tracking-[0.2em] font-mono font-bold ${theme === "oled" ? "text-zinc-400" : "text-[#1A1A1A]/50"}`}>MATÉRIAUX & FORMULATION</span>
          <h2 className={`font-serif italic text-3xl sm:text-5xl tracking-tight mt-1 ${theme === "oled" ? "text-white" : "text-[#1A1A1A]"}`}>
            Guide de Sélection des Élastomères
          </h2>
          <p className={`text-lg leading-relaxed font-light ${theme === "oled" ? "text-zinc-300" : "text-[#1A1A1A]/70"}`}>
            Chaque application industrielle exige une formulation chimique optimisée. Découvrez notre guide de référence technique et comparez nos principaux mélanges de caoutchouc.
          </p>
        </div>

        {/* Dynamic Comparison Matrix Tool */}
        <div className={`border p-6 sm:p-10 shadow-sm mb-16 ${theme === "oled" ? "bg-black border-zinc-900" : "bg-white border-[#1A1A1A]/10"}`}>
          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b ${theme === "oled" ? "border-zinc-900" : "border-[#1A1A1A]/10"}`}>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-600 font-bold uppercase tracking-widest">
                <ArrowRightLeft className="w-4 h-4" />
                <span>Outil d'Aide à la Décision</span>
              </div>
              <h3 className={`font-serif font-bold text-xl sm:text-2xl ${theme === "oled" ? "text-white" : "text-[#1A1A1A]"}`}>
                Comparateur de Polymères Technique
              </h3>
              <p className={`text-sm font-light ${theme === "oled" ? "text-zinc-400" : "text-[#1A1A1A]/70"}`}>
                Sélectionnez deux élastomères pour comparer directement leurs performances opérationnelles.
              </p>
            </div>

            {/* Selection Dropdowns */}
            <div className="flex flex-wrap sm:flex-nowrap gap-4">
              {/* Material 1 */}
              <div className="space-y-1.5 w-full sm:w-48">
                <label className={`block text-[11px] font-mono uppercase tracking-wider font-bold ${theme === "oled" ? "text-zinc-400" : "text-[#1A1A1A]/60"}`}>Matériau de Gauche</label>
                <select
                  id="select-material-1"
                  value={selectedMat1}
                  onChange={(e) => setSelectedMat1(e.target.value)}
                  className={`w-full border rounded-none px-3 py-2 text-sm focus:outline-none ${
                    theme === "oled" 
                      ? "bg-zinc-900 border-zinc-800 text-white focus:border-orange-500" 
                      : "bg-[#F9F9F7] border-[#1A1A1A]/20 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  }`}
                >
                  {MATERIALS.map((m) => (
                    <option key={m.id} value={m.id} className={theme === "oled" ? "bg-black text-white" : ""}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Indicator */}
              <div className={`hidden sm:flex items-center justify-center pt-6 font-serif italic ${theme === "oled" ? "text-zinc-500" : "text-[#1A1A1A]/40"}`}>
                vs
              </div>

              {/* Material 2 */}
              <div className="space-y-1.5 w-full sm:w-48">
                <label className={`block text-[11px] font-mono uppercase tracking-wider font-bold ${theme === "oled" ? "text-zinc-400" : "text-[#1A1A1A]/60"}`}>Matériau de Droite</label>
                <select
                  id="select-material-2"
                  value={selectedMat2}
                  onChange={(e) => setSelectedMat2(e.target.value)}
                  className={`w-full border rounded-none px-3 py-2 text-sm focus:outline-none ${
                    theme === "oled" 
                      ? "bg-zinc-900 border-zinc-800 text-white focus:border-orange-500" 
                      : "bg-[#F9F9F7] border-[#1A1A1A]/20 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  }`}
                >
                  {MATERIALS.map((m) => (
                    <option key={m.id} value={m.id} disabled={m.id === selectedMat1} className={theme === "oled" ? "bg-black text-white" : ""}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* S-b-S Material comparison row values */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-8">
            {/* Left Card: Summary Material 1 */}
            <div className="space-y-6">
              <div className={`flex items-center justify-between p-4 border ${theme === "oled" ? "bg-zinc-950 border-zinc-900" : "bg-[#F9F9F7] border-[#1A1A1A]/10"}`}>
                <div>
                  <span className={`text-2xl font-serif font-bold block ${theme === "oled" ? "text-white" : "text-[#1A1A1A]"}`}>{mat1.name}</span>
                  <span className={`text-xs block mt-0.5 ${theme === "oled" ? "text-zinc-400" : "text-[#1A1A1A]/60"}`}>{mat1.fullName}</span>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-mono block uppercase tracking-wider ${theme === "oled" ? "text-zinc-500" : "text-[#1A1A1A]/50"}`}>Thermique :</span>
                  <span className="text-sm font-bold text-orange-600 block">{mat1.tempRange}</span>
                </div>
              </div>

              {/* Strengths / Weaknesses for Mat 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`border p-4 space-y-2 ${theme === "oled" ? "bg-zinc-950/40 border-zinc-900" : "bg-[#F9F9F7]/50 border-[#1A1A1A]/10"}`}>
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-mono">Avantages :</h4>
                  <ul className={`space-y-1.5 text-xs ${theme === "oled" ? "text-zinc-300" : "text-[#1A1A1A]/80"}`}>
                    {mat1.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`border p-4 space-y-2 ${theme === "oled" ? "bg-zinc-950/40 border-zinc-900" : "bg-[#F9F9F7]/50 border-[#1A1A1A]/10"}`}>
                  <h4 className="text-xs font-bold text-rose-600 uppercase tracking-widest font-mono">Limites :</h4>
                  <ul className={`space-y-1.5 text-xs ${theme === "oled" ? "text-zinc-300" : "text-[#1A1A1A]/80"}`}>
                    {mat1.weaknesses.map((weak, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Card: Summary Material 2 */}
            <div className="space-y-6">
              <div className={`flex items-center justify-between p-4 border ${theme === "oled" ? "bg-zinc-950 border-zinc-900" : "bg-[#F9F9F7] border-[#1A1A1A]/10"}`}>
                <div>
                  <span className={`text-2xl font-serif font-bold block ${theme === "oled" ? "text-white" : "text-[#1A1A1A]"}`}>{mat2.name}</span>
                  <span className={`text-xs block mt-0.5 ${theme === "oled" ? "text-zinc-400" : "text-[#1A1A1A]/60"}`}>{mat2.fullName}</span>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-mono block uppercase tracking-wider ${theme === "oled" ? "text-zinc-500" : "text-[#1A1A1A]/50"}`}>Thermique :</span>
                  <span className="text-sm font-bold text-orange-600 block">{mat2.tempRange}</span>
                </div>
              </div>

              {/* Strengths / Weaknesses for Mat 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`border p-4 space-y-2 ${theme === "oled" ? "bg-zinc-950/40 border-zinc-900" : "bg-[#F9F9F7]/50 border-[#1A1A1A]/10"}`}>
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-mono">Avantages :</h4>
                  <ul className={`space-y-1.5 text-xs ${theme === "oled" ? "text-zinc-300" : "text-[#1A1A1A]/80"}`}>
                    {mat2.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`border p-4 space-y-2 ${theme === "oled" ? "bg-zinc-950/40 border-zinc-900" : "bg-[#F9F9F7]/50 border-[#1A1A1A]/10"}`}>
                  <h4 className="text-xs font-bold text-rose-600 uppercase tracking-widest font-mono">Limites :</h4>
                  <ul className={`space-y-1.5 text-xs ${theme === "oled" ? "text-zinc-300" : "text-[#1A1A1A]/80"}`}>
                    {mat2.weaknesses.map((weak, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Performance Metrics comparison bars */}
          <div className={`mt-10 pt-8 border-t space-y-6 ${theme === "oled" ? "border-zinc-900" : "border-[#1A1A1A]/10"}`}>
            <h4 className={`text-center font-serif font-bold text-lg ${theme === "oled" ? "text-white" : "text-[#1A1A1A]"}`}>
              Performances Élastomères Comparées (Note sur 5)
            </h4>
            
            <div className="space-y-4 max-w-4xl mx-auto">
              {metricLabels.map((metric) => {
                const score1 = getMetricStars(mat1.id, metric.id);
                const score2 = getMetricStars(mat2.id, metric.id);
                
                return (
                  <div key={metric.id} className={`grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center py-2 border-b ${theme === "oled" ? "border-zinc-900" : "border-[#1A1A1A]/5"}`}>
                    {/* Metric Details */}
                    <div className="md:col-span-4 text-left">
                      <span className={`block text-xs font-bold ${theme === "oled" ? "text-white" : "text-[#1A1A1A]"}`}>{metric.label}</span>
                      <span className={`block text-[10px] font-mono ${theme === "oled" ? "text-zinc-400" : "text-[#1A1A1A]/60"}`}>{metric.description}</span>
                    </div>

                    {/* Progress Bar 1 */}
                    <div className="md:col-span-4 flex items-center gap-3">
                      <span className={`text-xs font-mono font-bold w-28 shrink-0 text-right whitespace-nowrap ${theme === "oled" ? "text-zinc-400" : "text-[#1A1A1A]/60"}`}>{mat1.name}</span>
                      <div className={`flex-1 h-2 border overflow-hidden ${theme === "oled" ? "bg-zinc-950 border-zinc-800" : "bg-[#F9F9F7] border-[#1A1A1A]/10"}`}>
                        <div
                          className={`h-full transition-all duration-500 ${theme === "oled" ? "bg-zinc-200" : "bg-[#1A1A1A]"}`}
                          style={{ width: `${(score1 / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-mono font-bold w-6 ${theme === "oled" ? "text-white" : "text-[#1A1A1A]"}`}>{score1}/5</span>
                    </div>

                    {/* Progress Bar 2 */}
                    <div className="md:col-span-4 flex items-center gap-3">
                      <span className={`text-xs font-mono font-bold w-28 shrink-0 text-right whitespace-nowrap ${theme === "oled" ? "text-zinc-400" : "text-[#1A1A1A]/60"}`}>{mat2.name}</span>
                      <div className={`flex-1 h-2 border overflow-hidden ${theme === "oled" ? "bg-zinc-950 border-zinc-800" : "bg-[#F9F9F7] border-[#1A1A1A]/10"}`}>
                        <div
                          className={`h-full transition-all duration-500 ${theme === "oled" ? "bg-orange-500" : "bg-orange-600"}`}
                          style={{ width: `${(score2 / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-mono font-bold w-6 ${theme === "oled" ? "text-orange-400" : "text-orange-600"}`}>{score2}/5</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Static Cards overview Grid for all materials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {MATERIALS.map((mat) => {
            const isEmerald = mat.color === "emerald";
            const isBlue = mat.color === "blue";
            const isOrange = mat.color === "orange";
            const isRose = mat.color === "rose";
            const glowColors = isEmerald
              ? ['#10b981', '#34d399', '#a7f3d0']
              : isBlue
              ? ['#3b82f6', '#60a5fa', '#bfdbfe']
              : isOrange
              ? ['#f97316', '#fb923c', '#ffedd5']
              : isRose
              ? ['#f43f5e', '#fb7185', '#ffe4e6']
              : ['#84cc16', '#a3e635', '#ecfccb'];

            return (
              <BorderGlow
                key={mat.id}
                edgeSensitivity={30}
                glowColor={isEmerald ? "142 70 50" : isBlue ? "217 90 60" : isOrange ? "24 95 70" : isRose ? "340 85 65" : "80 75 60"}
                backgroundColor={theme === "oled" ? "#000000" : "#ffffff"}
                borderRadius={16}
                glowRadius={35}
                glowIntensity={1.0}
                coneSpread={25}
                animated={false}
                colors={glowColors}
                className="h-full w-full"
              >
                <div className="p-5 flex flex-col justify-between h-full group relative bg-transparent overflow-hidden text-left">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`font-serif font-bold text-xl ${theme === "oled" ? "text-white" : "text-[#1A1A1A]"}`}>{mat.name}</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        mat.color === "emerald" ? "bg-emerald-500" :
                        mat.color === "blue" ? "bg-blue-500" :
                        mat.color === "orange" ? "bg-orange-500" :
                        mat.color === "rose" ? "bg-rose-500" : "bg-lime-500"
                      }`} />
                    </div>
                    <h4 className={`text-xs h-8 font-light line-clamp-2 leading-snug ${theme === "oled" ? "text-zinc-400" : "text-[#1A1A1A]/60"}`}>{mat.fullName}</h4>
                    
                    <div className={`border-t pt-3 space-y-2 ${theme === "oled" ? "border-zinc-900" : "border-[#1A1A1A]/10"}`}>
                      <div className={`flex items-center gap-1.5 ${theme === "oled" ? "text-zinc-500" : "text-[#1A1A1A]/50"}`}>
                        <Thermometer className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Plage thermique</span>
                      </div>
                      <span className={`text-xs font-bold block ${theme === "oled" ? "text-zinc-200" : "text-[#1A1A1A]"}`}>{mat.tempRange}</span>
                    </div>
                  </div>

                  {/* Common use-case badge */}
                  <div className={`border-t mt-4 pt-3 ${theme === "oled" ? "border-zinc-900" : "border-[#1A1A1A]/10"}`}>
                    <span className={`block text-[9px] font-mono uppercase tracking-widest mb-1 font-bold ${theme === "oled" ? "text-zinc-500" : "text-[#1A1A1A]/40"}`}>Exemple phare :</span>
                    <span className={`text-[11px] block line-clamp-1 ${theme === "oled" ? "text-zinc-300" : "text-[#1A1A1A]/70"}`}>{mat.commonApplications[0]}</span>
                  </div>
                </div>
              </BorderGlow>
            );
          })}
        </div>

      </div>
    </section>
  );
}
