import React from "react";
import { motion } from "motion/react";
import { Hammer, Settings, Shield, Award, Cpu, Sparkles, ArrowRight } from "lucide-react";
import TcpLogo from "./TcpLogo";
import BorderGlow from "./BorderGlow";

interface HeroProps {
  onNavigate: (section: string) => void;
  theme?: "light" | "oled";
}

export default function Hero({ onNavigate, theme }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const statItems = [
    { value: "Moyennes & Grandes", label: "Séries de Production", detail: "Spécialisation industrielle" },
    { value: "0.1 mm", label: "Tolérance Dimensionnelle", detail: "Norme de précision ISO 3302-1" },
    { value: "Compression & Injection", label: "Presses de Dernière Génération", detail: "Vulcanisation optimale" },
    { value: "100% Sur Mesure", label: "Conception par Bureau d'Études", detail: "Selon votre cahier des charges" },
  ];

  return (
    <section id="accueil-hero" className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden bg-transparent text-[#1A1A1A] pt-12 pb-20 border-b border-[#1A1A1A]/10">
      {/* Editorial Grid overlay - very subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a05_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a05_1px,transparent_1px)] bg-[size:6rem_6rem] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        {/* Column 1: Huge Typography & Pitch (Spans 8 columns on desktop) */}
        <motion.div
          className="lg:col-span-8 flex flex-col justify-between space-y-8 text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A]/5 border border-[#1A1A1A]/20 text-[#1A1A1A] text-[10px] font-mono uppercase tracking-widest font-bold">
              <span>Moulage Caoutchouc de Haute Précision</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-serif italic text-5xl sm:text-6xl lg:text-[76px] leading-[0.9] text-[#1A1A1A] tracking-tight"
            >
              L'Excellence <br/> <span className="not-italic font-sans font-black tracking-tighter uppercase">Industrielle</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-[#1A1A1A] text-lg sm:text-xl leading-relaxed max-w-2xl font-light"
            >
              Spécialiste de la fabrication d'articles en caoutchouc de haute technologie en <span className="font-semibold underline decoration-[#1A1A1A] underline-offset-4">moyennes et grandes séries</span>. Une maîtrise totale de la vulcanisation selon un cahier des charges rigoureux.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-[#1A1A1A]/70 text-sm sm:text-base border-l-2 border-[#1A1A1A] pl-4 max-w-xl italic font-serif leading-relaxed"
            >
              « Au-delà des produits standards, notre bureau d'études conçoit et fabrique vos pièces sur mesure les plus complexes grâce à nos presses de dernière génération. »
            </motion.p>
          </div>

          {/* Action Callouts */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              id="hero-cta-devis"
              onClick={() => onNavigate("contact")}
              className={`px-6 py-4 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                theme === "oled"
                  ? "oled-primary-cta"
                  : "bg-[#1A1A1A] hover:bg-[#333333] text-[#F9F9F7] border-[#1A1A1A] hover:border-[#333333]"
              }`}
            >
              <span>Lancer un Devis de Série</span>
              <ArrowRight className="w-4 h-4 text-current" />
            </button>
            <button
              id="hero-cta-bureau"
              onClick={() => onNavigate("bureau-etudes")}
              className={`px-6 py-4 bg-transparent font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                theme === "oled"
                  ? "border-zinc-700 hover:border-white text-zinc-300 hover:text-white hover:bg-white/10"
                  : "border-[#1A1A1A] hover:bg-[#1A1A1A]/5 text-[#1A1A1A]"
              }`}
            >
              <span>Consulter le Bureau d'Études IA</span>
              <Cpu className={`w-4 h-4 ${theme === "oled" ? "text-zinc-300" : "text-[#1A1A1A]"}`} />
            </button>
          </motion.div>

          {/* Staggered visual stats built as minimalist editorial blocks */}
          <motion.div 
            variants={itemVariants} 
            className={`grid grid-cols-2 gap-6 pt-8 border-t w-full ${
              theme === "oled" ? "border-zinc-800" : "border-[#1A1A1A]/10"
            }`}
          >
            <div className={`border-l-2 pl-4 ${theme === "oled" ? "border-orange-500" : "border-[#1A1A1A]"}`}>
              <span className={`block text-[9px] uppercase font-mono tracking-widest mb-1 ${
                theme === "oled" ? "text-zinc-400" : "text-[#1A1A1A]/50"
              }`}>CAPACITÉ</span>
              <span className={`text-xl sm:text-2xl font-serif italic ${
                theme === "oled" ? "text-zinc-100" : "text-[#1A1A1A]"
              }`}>Moyennes & Grandes Séries</span>
            </div>
            <div className={`border-l-2 pl-4 ${theme === "oled" ? "border-orange-500" : "border-[#1A1A1A]"}`}>
              <span className={`block text-[9px] uppercase font-mono tracking-widest mb-1 ${
                theme === "oled" ? "text-zinc-400" : "text-[#1A1A1A]/50"
              }`}>TOLÉRANCE</span>
              <span className={`text-xl sm:text-2xl font-serif italic ${
                theme === "oled" ? "text-zinc-100" : "text-[#1A1A1A]"
              }`}>ISO 3302-1 Classe M2</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Column 2: Tech Specs & Focus Block (Spans 4 columns - high contrast charcoal sidebar) */}
        <motion.div
          className="lg:col-span-4 flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <BorderGlow
            edgeSensitivity={30}
            glowColor="24 95 70"
            backgroundColor="#1A1A1A"
            borderRadius={0}
            glowRadius={45}
            glowIntensity={1.2}
            coneSpread={25}
            animated={false}
            colors={['#ea580c', '#fb923c', '#fcd34d']}
            className="h-full w-full flex-1 flex flex-col"
          >
            <div className="text-[#F9F9F7] p-8 sm:p-10 flex-1 flex flex-col justify-between h-full group relative bg-transparent overflow-hidden">
              <div className="space-y-8">
                <div>
                  <h2 className="text-[10px] uppercase tracking-[0.25em] mb-6 font-bold border-b border-white/15 pb-4 font-mono text-[#F9F9F7]/60">
                    Spécificités & Savoir-Faire
                  </h2>
                  <p className="text-sm leading-relaxed mb-6 italic opacity-85 font-serif">
                    "Chaque composé polymère ou élastomère est préparé selon les normes de vulcanisation pour garantir l'élasticité et l'étanchéité."
                  </p>
                </div>

                <ul className="space-y-4 text-xs font-bold font-mono tracking-wider">
                  <li className="flex justify-between border-b border-white/10 pb-2.5">
                    <span>VULCANISATION SUR PLAN</span>
                    <span className="text-orange-400">01</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2.5">
                    <span>MOULAGE PAR COMPRESSION</span>
                    <span className="text-orange-400">02</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2.5">
                    <span>INJECTION DE CAOUTCHOUC</span>
                    <span className="text-orange-400">03</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2.5">
                    <span>SÉRIES ET OUTILLAGES</span>
                    <span className="text-orange-400">04</span>
                  </li>
                </ul>
              </div>

              <div className="pt-10 mt-10 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-6xl font-serif leading-none italic text-orange-400">100%</div>
                  <div className="text-[9px] uppercase tracking-widest font-bold mt-2 text-[#F9F9F7]/70 font-mono">
                    Qualité & Service
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <TcpLogo className="w-14 h-14" holeColor="#1A1A1A" />
                  <div className="text-right text-[9px] font-mono tracking-wider text-[#F9F9F7]/50 font-bold uppercase">
                    Eurl TCP Alger
                  </div>
                </div>
              </div>
            </div>
          </BorderGlow>
        </motion.div>
      </div>

      {/* Grid of Key Stats in bottom of Hero - Editorial Layout */}
      <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-16 pt-8 border-t ${
        theme === "oled" ? "border-zinc-800" : "border-[#1A1A1A]/10"
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((stat, i) => (
            <div 
              key={i} 
              className={`text-left space-y-1.5 p-4 border transition-all ${
                theme === "oled" 
                  ? "border-zinc-800 bg-zinc-950/70 shadow-sm shadow-black/50" 
                  : "border-[#1A1A1A]/10 bg-white/50"
              }`}
            >
              <span className={`block text-[10px] font-mono font-bold tracking-widest uppercase ${
                theme === "oled" ? "text-zinc-400" : "text-[#1A1A1A]/50"
              }`}>
                {stat.label}
              </span>
              <span className={`block font-serif font-bold text-xl ${
                theme === "oled" ? "text-white" : "text-[#1A1A1A]"
              }`}>
                {stat.value}
              </span>
              <span className={`block text-[11px] ${
                theme === "oled" ? "text-zinc-500" : "text-[#1A1A1A]/60"
              }`}>
                {stat.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
