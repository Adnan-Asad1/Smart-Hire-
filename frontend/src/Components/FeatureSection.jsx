import React from "react";
import { ShieldCheck, Activity, Layers, Zap, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";

// Upgraded Features Section — More professional, premium UI
// - Enhanced animations
// - Glassmorphism cards
// - Soft gradients + depth shadows
// - Better spacing + visual hierarchy
// - Premium colors for HR SaaS UX

const features = [
  {
    id: 1,
    title: "Custom Interview Flows",
    desc: "Build role-specific flows, set weightages, and reuse templates.",
    icon: Layers,
  },
  {
    id: 2,
    title: "AI Scorecards",
    desc: "Automated competency scoring with clear insights.",
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: "Live Transcription",
    desc: "Real-time transcripts with structured summaries.",
    icon: Activity,
  },
  {
    id: 4,
    title: "Bias Controls",
    desc: "Fairness reports and bias-reduction settings.",
    icon: Zap,
  },
  {
    id: 5,
    title: "Scheduling & Integrations",
    desc: "Calendar sync, Slack alerts, and workflow automation.",
    icon: Calendar,
  },
  {
    id: 6,
    title: "Team Collaboration",
    desc: "Share scorecards and collaborate with reviewers.",
    icon: Users,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 bg-gradient-to-br from-white via-indigo-50/40 to-slate-100 overflow-hidden">
      {/* subtle background glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-200 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent drop-shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Powerful features to streamline hiring
          </motion.h2>

          <motion.p
            className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.6 }}
          >
            OfficeAI combines structured interviewing, AI-driven scoring, and modern HR automations into one seamless platform.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.id}
                className="group relative rounded-3xl border border-white/40 backdrop-blur-xl bg-white/70 p-7 shadow-xl hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                whileHover={{ translateY: -10, scale: 1.02 }}
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 drop-shadow-sm">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="text-sm text-indigo-500 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    Learn more
                  </div>
                  <div className="text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity text-lg">
                    →
                  </div>
                </div>

                {/* Decorative glowing accent */}
                <div className="pointer-events-none absolute -right-8 -top-8 opacity-30 group-hover:opacity-60 transition-opacity">
                  <svg width="140" height="140" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id={`g-${f.id}`} x1="0" x2="1">
                        <stop offset="0" stopColor="#a5b4fc" />
                        <stop offset="1" stopColor="#6ee7b7" />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="60" fill={`url(#g-${f.id})`} />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
