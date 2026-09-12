import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Quote } from "lucide-react";
import { Verse, VersesConfig } from "../types";

interface FloatingVersesProps {
  location: "login" | "loading" | "dashboard" | "ebook" | "sales" | "publish" | "success" | "footer" | "waiting";
  inline?: boolean;
}

// Module-level cache to share verses and config across multiple mounted components without multi-fetching
let cachedData: { verses: Verse[]; config: VersesConfig } | null = null;
let fetchPromise: Promise<{ verses: Verse[]; config: VersesConfig }> | null = null;

async function getVersesData(): Promise<{ verses: Verse[]; config: VersesConfig }> {
  if (cachedData) return cachedData;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch("/api/verses")
    .then((res) => {
      if (!res.ok) throw new Error("Falha ao carregar versículos");
      return res.json();
    })
    .then((data) => {
      cachedData = data;
      return data;
    })
    .catch((err) => {
      console.error("[FloatingVerses] Erro carregando versículos do servidor:", err);
      // Fallback local safe
      const localConfig: VersesConfig = {
        enabled: true,
        version: "Paráfrases",
        locations: {
          login: true,
          loading: true,
          dashboard: true,
          ebook: true,
          sales: true,
          publish: true,
          success: true,
          footer: true,
          waiting: true,
        },
        duration: 12,
        style: "discrete",
        color: "gold",
        glowIntensity: "medium",
        speed: "normal",
      };
      return { verses: [], config: localConfig };
    });

  return fetchPromise;
}

// Event system to notify all FloatingVerses components when config is modified in the AdminPanel
const configChangeListeners = new Set<() => void>();
export function notifyVersesConfigChanged() {
  cachedData = null;
  fetchPromise = null;
  configChangeListeners.forEach((listener) => listener());
}

export default function FloatingVerses({ location, inline = false }: FloatingVersesProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [config, setConfig] = useState<VersesConfig | null>(null);
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load and subscribe to config changes
  const loadData = () => {
    getVersesData().then((data) => {
      setVerses(data.verses);
      setConfig(data.config);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadData();
    configChangeListeners.add(loadData);
    return () => {
      configChangeListeners.delete(loadData);
    };
  }, []);

  // Determine if we should display in this location
  const isEnabled = useMemo(() => {
    if (!config || !config.enabled) return false;
    return config.locations[location] ?? true;
  }, [config, location]);

  // Select next verse without repeating the recent ones
  const selectNextVerse = () => {
    if (verses.length === 0) return;

    // Filter out verses that have been shown recently (unless we have very few verses)
    const historyLimit = Math.min(5, Math.floor(verses.length / 2));
    const availableVerses = verses.filter((v) => !history.slice(-historyLimit).includes(v.id));

    const pool = availableVerses.length > 0 ? availableVerses : verses;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];

    if (selected) {
      setCurrentVerse(selected);
      setHistory((prev) => [...prev.slice(-10), selected.id]);
    }
  };

  // Set up verse rotation interval
  useEffect(() => {
    if (!isEnabled || verses.length === 0) return;

    // Pick first verse immediately
    if (!currentVerse) {
      selectNextVerse();
    }

    const intervalMs = (config?.duration || 12) * 1000;
    const timer = setInterval(() => {
      selectNextVerse();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isEnabled, verses, config?.duration, currentVerse]);

  // If loading or disabled, do not render
  if (isLoading || !isEnabled || !currentVerse) return null;

  // Determine styling speeds
  const speedDuration = (() => {
    switch (config?.speed) {
      case "slow":
        return 2.5;
      case "fast":
        return 0.6;
      case "normal":
      default:
        return 1.2;
    }
  })();

  // Determine glow class
  const glowShadowClass = (() => {
    const intensity = config?.glowIntensity || "medium";
    const color = config?.color || "gold";

    const opacity = intensity === "low" ? "0.15" : intensity === "high" ? "0.6" : "0.35";

    switch (color) {
      case "blue":
        return `shadow-[0_0_20px_rgba(56,189,248,${opacity})] border-sky-500/20`;
      case "cyan":
        return `shadow-[0_0_20px_rgba(34,211,238,${opacity})] border-cyan-500/20`;
      case "white":
        return `shadow-[0_0_20px_rgba(255,255,255,${opacity})] border-white/15`;
      case "gold":
      default:
        return `shadow-[0_0_20px_rgba(245,158,11,${opacity})] border-amber-500/20`;
    }
  })();

  // Text colors
  const textClass = (() => {
    switch (config?.color) {
      case "blue":
        return "text-sky-200/90 hover:text-sky-100";
      case "cyan":
        return "text-cyan-200/90 hover:text-cyan-100";
      case "white":
        return "text-slate-100/90 hover:text-white";
      case "gold":
      default:
        return "text-amber-200/95 hover:text-amber-100";
    }
  })();

  const labelClass = (() => {
    switch (config?.color) {
      case "blue":
        return "text-sky-400 bg-sky-950/40 border-sky-800/30";
      case "cyan":
        return "text-cyan-400 bg-cyan-950/40 border-cyan-800/30";
      case "white":
        return "text-slate-300 bg-slate-800/40 border-slate-700/30";
      case "gold":
      default:
        return "text-amber-400 bg-amber-950/40 border-amber-800/30";
    }
  })();

  const isHighlighted = config?.style === "highlighted";

  // Different layout wrapper styles depending on whether it's inline (like in loading screen) or absolute floating overlay
  const containerClasses = inline
    ? "w-full max-w-xl mx-auto py-4 px-6 rounded-2xl bg-black/30 backdrop-blur-md border border-white/5"
    : location === "footer"
    ? "w-full py-3 px-4 border-t border-white/5 bg-black/40 backdrop-blur-md"
    : location === "login"
    ? "w-full max-w-md mx-auto mt-6 py-4 px-5 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/5"
    : "fixed bottom-6 right-6 z-40 max-w-sm py-4 px-5 rounded-2xl bg-slate-950/60 backdrop-blur-lg border";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentVerse.id}
        initial={{ opacity: 0, y: 15, scale: 0.97 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { duration: speedDuration, ease: "easeOut" }
        }}
        exit={{ 
          opacity: 0, 
          y: -15, 
          scale: 0.97,
          transition: { duration: speedDuration * 0.8, ease: "easeIn" }
        }}
        className={`${containerClasses} ${isHighlighted ? glowShadowClass : ""} transition-all duration-300`}
        id={`floating-verse-${location}-${currentVerse.id}`}
      >
        {/* Continuous looping vertical float effect (nested child to keep exit/entry translations perfectly linear) */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 6, 
            ease: "easeInOut" 
          }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between gap-3">
            <span className={`text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 rounded-full border ${labelClass} flex items-center gap-1.5`}>
              <Sparkles className="w-2.5 h-2.5" />
              {currentVerse.theme}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {config?.version || "Paráfrases"}
            </span>
          </div>

          <div className="relative pl-4 mt-1">
            <Quote className="absolute -left-1 -top-1.5 w-4 h-4 text-white/5 rotate-180" />
            <p className={`text-xs md:text-[13px] leading-relaxed font-sans italic ${textClass} select-none`}>
              {currentVerse.text}
            </p>
          </div>

          <div className="flex items-center justify-end gap-1 mt-1">
            <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-slate-600"></div>
            <span className="text-[11px] font-medium font-mono text-slate-400">
              {currentVerse.reference}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
