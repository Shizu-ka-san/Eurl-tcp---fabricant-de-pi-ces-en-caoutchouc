import React from "react";
import { MACHINES } from "../data";
import { Cpu, Hammer, CheckSquare, Layers, HelpCircle } from "lucide-react";
import BorderGlow from "./BorderGlow";

export default function TechnologySection() {
  return (
    <section id="technologie" className="py-20 bg-transparent border-t border-[#1A1A1A]/10 text-left relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl space-y-4 mb-16 border-l-4 border-[#1A1A1A] pl-6">
          <span className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-[#1A1A1A]/50">PROCÉDÉS & PARC MACHINES</span>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#1A1A1A] tracking-tight mt-1">
            Nos Procédés de Vulcanisation Industrielle
          </h2>
          <p className="text-[#1A1A1A]/70 text-lg leading-relaxed font-light">
            Nous exploitons des équipements d'avant-garde permettant de façonner les élastomères de manière optimale selon les contraintes de votre projet.
          </p>
        </div>

        {/* Machine cards comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {MACHINES.map((mach) => (
            <BorderGlow
              key={mach.id}
              edgeSensitivity={30}
              glowColor="24 95 70"
              backgroundColor="#ffffff"
              borderRadius={16}
              glowRadius={45}
              glowIntensity={1.2}
              coneSpread={25}
              animated={false}
              colors={['#ea580c', '#fb923c', '#fcd34d']}
              className="h-full w-full"
            >
              <div className="p-6 sm:p-8 flex flex-col justify-between h-full group relative bg-transparent overflow-hidden">
                <div className="space-y-6">
                  
                  {/* Header info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 text-[#1A1A1A]">
                        {mach.type === "injection" ? <Cpu className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-orange-600 uppercase tracking-widest bg-orange-600/10 px-2 py-0.5 rounded font-bold">
                          {mach.type === "injection" ? "Injection Caoutchouc" : "Vulcanisation Compression"}
                        </span>
                        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1A1A1A] mt-1">
                          {mach.name}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-[#1A1A1A]/70 text-sm leading-relaxed">
                      {mach.description}
                    </p>
                  </div>

                  {/* Capacity Parameter Badge */}
                  <div className="bg-[#F9F9F7] border border-[#1A1A1A]/10 p-4 font-mono text-xs text-[#1A1A1A]/80">
                    <span className="block text-[10px] text-[#1A1A1A]/50 uppercase mb-1 tracking-wider">Capacité machine :</span>
                    <span className="font-bold text-orange-600 block">{mach.capacity}</span>
                  </div>

                  {/* Benefits / Avantages */}
                  <div className="space-y-3 pt-2">
                    <span className="font-mono font-bold text-xs text-[#1A1A1A] uppercase tracking-wider block">
                      Avantages Opérationnels :
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#1A1A1A]/80">
                      {mach.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-[#F9F9F7]/50 p-3 border border-[#1A1A1A]/5">
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Features Checklist */}
                  <div className="space-y-3 pt-4 border-t border-[#1A1A1A]/10">
                    <span className="font-mono font-bold text-xs text-[#1A1A1A] uppercase tracking-wider block">
                      Spécificités Techniques :
                    </span>
                    <ul className="space-y-2 text-xs text-[#1A1A1A]/80">
                      {mach.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CornerArrow />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            </BorderGlow>
          ))}
        </div>

        {/* Co-design recommendation block */}
        <div className="mt-16 bg-[#1A1A1A] text-[#F9F9F7] p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 text-left border border-black shadow-xl">
          <div className="p-3 bg-white/10 text-white shrink-0">
            <HelpCircle className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-lg text-white">
              Une hésitation sur le choix du moule ou du procédé ?
            </h4>
            <p className="text-white/80 text-sm leading-relaxed font-light">
              Ne vous inquiétez pas ! Notre <strong className="text-white font-bold">bureau d'études technique</strong> se charge d'analyser vos plans 2D/3D et d'orienter le choix de l'outillage vers la presse la plus adaptée à vos cadences de livraison.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

function CornerArrow() {
  return (
    <svg
      className="w-4 h-4 text-orange-500 shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}
