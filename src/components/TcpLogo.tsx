import React, { useState } from "react";
import { motion } from "motion/react";

interface TcpLogoProps {
  className?: string;
  showText?: boolean;
  holeColor?: string;
}

export default function TcpLogo({ className = "w-12 h-12", showText = false, holeColor = "#f8fafc" }: TcpLogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${showText ? "" : "inline-block"}`}>
      <motion.svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ filter: "drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.12))" }}
        animate={{
          y: [-1, 1, -1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <defs>
          <radialGradient id="yellowGrad" cx="50%" cy="45%">
            <stop offset="0%" stopColor="#FFF200" />
            <stop offset="70%" stopColor="#FFC107" />
            <stop offset="100%" stopColor="#F39C12" />
          </radialGradient>

          <radialGradient id="orangeGrad" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#ED7D31" />
          </radialGradient>

          <linearGradient id="redGrad" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#ff3b30" />
            <stop offset="100%" stopColor="#c40000" />
          </linearGradient>

          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow 
              dx={0} 
              dy={4} 
              stdDeviation={4} 
              floodOpacity={0.25}
              floodColor="#000000"
            />
          </filter>
        </defs>

        {/* Grand anneau jaune (Outer Ring) - Slow gentle breathing with minor wobble */}
        <motion.g
          style={{ transformOrigin: "400px 300px" }}
          animate={{
            y: [-3, 3, -3],
            rotate: [-0.8, 0.8, -0.8],
            scale: [1, 1.01, 1],
          }}
          transition={{
            y: { duration: 5.8, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 5.8, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 5.8, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Grand anneau */}
          <ellipse
            cx="400"
            cy="300"
            rx="330"
            ry="120"
            fill="url(#yellowGrad)"
            filter="url(#shadow)"
            stroke="#ffffff"
            strokeWidth={1.5}
            strokeOpacity={0.85}
          />

          {/* Trou grand anneau */}
          <ellipse
            cx="400"
            cy="245"
            rx="250"
            ry="80"
            fill={holeColor}
            stroke="#ffffff"
            strokeWidth={1.5}
            strokeOpacity={0.85}
          />
        </motion.g>

        {/* Anneau orange (Middle Ring) - Medium altitude floating with opposite sway phase */}
        <motion.g
          style={{ transformOrigin: "400px 235px" }}
          animate={{
            y: [-11, 9, -11],
            rotate: [1.4, -1.4, 1.4],
            scale: [1, 1.025, 1],
          }}
          transition={{
            y: { duration: 4.6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4.6, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 4.6, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Anneau orange */}
          <ellipse
            cx="400"
            cy="235"
            rx="230"
            ry="70"
            fill="url(#orangeGrad)"
            filter="url(#shadow)"
            stroke="#ffffff"
            strokeWidth={1.5}
            strokeOpacity={0.85}
          />

          {/* Trou anneau orange */}
          <ellipse
            cx="400"
            cy="235"
            rx="160"
            ry="48"
            fill={holeColor}
            stroke="#ffffff"
            strokeWidth={1.5}
            strokeOpacity={0.85}
          />
        </motion.g>

        {/* Anneau rouge (Inner Ring) - Agile, floating higher with a more energetic gyroscope wobble */}
        <motion.g
          style={{ transformOrigin: "400px 225px" }}
          animate={{
            y: [-20, 14, -20],
            rotate: [-2.2, 2.2, -2.2],
            scale: [1, 1.045, 1],
          }}
          transition={{
            y: { duration: 3.6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 3.6, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Anneau rouge */}
          <ellipse
            cx="400"
            cy="225"
            rx="120"
            ry="36"
            fill="url(#redGrad)"
            filter="url(#shadow)"
            stroke="#ffffff"
            strokeWidth={1.5}
            strokeOpacity={0.85}
          />

          {/* Trou anneau rouge */}
          <ellipse
            cx="400"
            cy="225"
            rx="65"
            ry="18"
            fill={holeColor}
            stroke="#ffffff"
            strokeWidth={1.5}
            strokeOpacity={0.85}
          />
        </motion.g>

        {/* Axe Central / Spindle Needle (Base, segments, needle tip) - Sways slightly in reaction to gravity */}
        <motion.g
          style={{ transformOrigin: "400px 505px" }}
          animate={{
            rotate: [0.6, -0.6, 0.6],
            scaleY: [1, 1.01, 1],
          }}
          transition={{
            rotate: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
            scaleY: { duration: 5.2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Pointe de l'axe */}
          <path
            d="M 400,10 L 396,60 L 396,243 L 404,243 L 404,60 Z"
            fill="#111111"
          />

          {/* Segments de l'axe central */}
          <line
            x1={400}
            y1={261}
            x2={400}
            y2={283}
            stroke="#111111"
            strokeWidth={8}
            strokeLinecap="round"
          />
          <line
            x1={400}
            y1={305}
            x2={400}
            y2={325}
            stroke="#111111"
            strokeWidth={8}
            strokeLinecap="round"
          />
          <line
            x1={400}
            y1={420}
            x2={400}
            y2={475}
            stroke="#111111"
            strokeWidth={8}
            strokeLinecap="round"
          />

          {/* Base de l'axe */}
          <path
            d="M 396,475 Q 396,495 388,505 H 412 Q 404,495 404,475 Z"
            fill="#111111"
          />
        </motion.g>
      </motion.svg>

      {showText && (
        <motion.div
          animate={{
            y: [-0.5, 0.5, -0.5]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="font-serif font-black text-xl italic tracking-tight text-[#1A1A1A] block leading-none">
            Eurl <span className="not-italic font-sans font-extrabold tracking-tighter">TCP</span>
          </span>
          <span className="text-[9px] text-[#1A1A1A]/60 font-mono tracking-widest block mt-1 uppercase font-bold">
            Manufacture Caoutchouc
          </span>
        </motion.div>
      )}
    </div>
  );
}
