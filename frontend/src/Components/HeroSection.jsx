import React from "react";
import { ArrowRight, Sparkles, Share2, Play } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

// HeroSection.animated.jsx
// - Enhanced animations: polished entrances, subtle loops, hover micro-interactions
// - Uses Tailwind CSS + framer-motion
// - Default export: <HeroSection />

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 14 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45 } },
};

export default function HeroSection() {
  // micro-parallax for card tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-30, 30], [8, -8]);
  const rotateY = useTransform(mouseX, [-30, 30], [-10, 10]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      {/* animated background orb */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
        animate={{ opacity: [0.6, 0.85, 0.6], scale: [0.98, 1.02, 0.98], rotate: [ -6, 6, -6 ] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        className="absolute -left-20 top-10 w-[520px] h-[520px] rounded-full bg-gradient-to-r from-indigo-100 to-cyan-50 opacity-60 blur-3xl transform-gpu"
      />

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT: Text */}
          <motion.div
            className="relative z-10"
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            <motion.div variants={itemUp} className="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-sm font-medium w-max">
              <Sparkles size={16} /> <span>New</span>
              <motion.span className="ml-2 text-xs text-indigo-600/70" variants={fadeIn}>AI-driven interviews</motion.span>
            </motion.div>

            <motion.h1
              variants={itemUp}
              className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
            >
              Hire faster with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-400">AI-powered interviews</span>
            </motion.h1>

            <motion.p variants={itemUp} className="mt-6 text-lg text-slate-600 max-w-2xl">
              Design role-specific interview flows, run automated candidate sessions with live transcription,
              and get clear hire/reject recommendations — all inside a single polished admin dashboard.
            </motion.p>

            <motion.div variants={itemUp} className="mt-8 flex flex-wrap gap-3">
              <motion.a
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                href="#build"
                className="inline-flex items-center gap-3 rounded-lg bg-indigo-600 px-5 py-3 text-white font-semibold shadow-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                Create Interview
                <ArrowRight size={16} />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02, translateY: -1 }}
                whileTap={{ scale: 0.98 }}
                href="#features"
                className="inline-flex items-center gap-3 rounded-lg border border-slate-200 px-5 py-3 text-sm text-slate-700 bg-white"
              >
                See features
              </motion.a>
            </motion.div>

            <motion.div variants={itemUp} className="mt-8 flex flex-wrap gap-3 text-sm text-slate-500">
              <motion.div variants={fadeIn} className="flex items-center gap-3 bg-white/60 backdrop-blur rounded-lg px-4 py-2 shadow-sm">
                <div className="font-semibold">Trusted by</div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                  <span className="font-medium">Forward</span>
                  <span className="text-xs">•</span>
                  <span className="font-medium">Nexa</span>
                  <span className="text-xs">•</span>
                  <span className="font-medium">Innovo</span>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="flex items-center gap-2 text-xs text-slate-400">Live demo • 15 min setup • Free trial</motion.div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Generic Public-Facing Professional Card */}
          <div className="relative z-10">
            <motion.div
              className="mx-auto max-w-xl"
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.55, ease: 'easeOut' }}
            >
              <motion.div
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 60; // -30..30
                  const y = ((e.clientY - rect.top) / rect.height - 0.5) * 60; // -30..30
                  mouseX.set(x);
                  mouseY.set(y);
                }}
                onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
                style={{ rotateX, rotateY }}
                whileHover={{ scale: 1.01, transition: { type: 'spring', stiffness: 200, damping: 18 } }}
                className="rounded-3xl bg-white p-6 shadow-2xl border border-slate-100"
              >
                {/* top bar */}
                <motion.div layout className="flex items-center justify-between gap-3">
                  <div>
                    <motion.div variants={itemUp} className="text-xs text-slate-400">Product</motion.div>
                    <motion.div variants={itemUp} className="text-xl font-semibold">Interview Overview</motion.div>
                    <motion.div variants={itemUp} className="mt-1 text-sm text-slate-500">Public demo — no personal or candidate data</motion.div>
                  </div>

                  <motion.div variants={fadeIn} className="inline-flex items-center gap-3">
                    <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">Demo</div>
                  </motion.div>
                </motion.div>

                {/* visual illustration area */}
                <motion.div variants={itemUp} className="mt-4 rounded-xl bg-gradient-to-r from-indigo-50 to-cyan-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">Session</div>
                      <div className="font-semibold text-slate-800">Sample Interview Flow</div>
                    </div>
                    <div className="text-xs text-slate-500">~15 min • 8 steps</div>
                  </div>

                  <div className="mt-3 h-2 w-full bg-white/60 rounded-full overflow-hidden">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full"
                      initial={{ width: '6%' }}
                      animate={{ width: ['6%', '26%', '56%', '76%', '86%'] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <motion.div variants={fadeIn} className="rounded-md bg-white p-3">
                      <div className="text-xs text-slate-500">Adaptive Flow</div>
                      <div className="font-medium">Adjusts questions in real-time</div>
                    </motion.div>
                    <motion.div variants={fadeIn} className="rounded-md bg-white p-3">
                      <div className="text-xs text-slate-500">Scorecards</div>
                      <div className="font-medium">Competency-focused summaries</div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* features chips */}
                <motion.div variants={fadeIn} className="mt-4 flex flex-wrap gap-2">
                  <motion.span whileHover={{ scale: 1.02 }} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">Live Transcript</motion.span>
                  <motion.span whileHover={{ scale: 1.02 }} className="px-3 py-1 rounded-full bg-slate-50 text-slate-700 text-xs">Custom Flows</motion.span>
                  <motion.span whileHover={{ scale: 1.02 }} className="px-3 py-1 rounded-full bg-slate-50 text-slate-700 text-xs">Bias Controls</motion.span>
                </motion.div>

                {/* capability */}
                <motion.div variants={itemUp} className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">AI Capability</div>
                    <div className="font-semibold text-indigo-600">Automated summaries & recommendations</div>
                  </div>
                  <div className="text-xs text-slate-400">Public demo</div>
                </motion.div>

                {/* actions */}
                <motion.div variants={itemUp} className="mt-6 flex gap-3">
                  <motion.button whileHover={{ scale: 1.02, translateY: -2 }} whileTap={{ scale: 0.98 }} className="flex-1 rounded-lg bg-indigo-600 text-white px-4 py-2 font-semibold inline-flex items-center justify-center gap-2">
                    <Play size={16} /> Try Demo
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="rounded-lg border border-slate-200 px-4 py-2 text-sm inline-flex items-center gap-2">
                    View Features
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="rounded-lg border border-slate-200 px-3 py-2 text-sm inline-flex items-center gap-2">
                    <Share2 size={14} /> Share
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* subtle floating caption */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.45 }}
                className="mt-6 flex items-center gap-3 justify-between"
              >
                <motion.div className="rounded-full bg-white p-3 shadow-md border border-slate-100" whileHover={{ scale: 1.03 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2v6" stroke="#0ea5a4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 12h-6" stroke="#0ea5a4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22v-6" stroke="#0ea5a4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 12h6" stroke="#0ea5a4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>

                <div className="text-sm text-slate-600 flex-1">
                  <div className="font-semibold">Feature demo</div>
                  <div className="text-xs text-slate-400">Explore core features without signing in</div>
                </div>

                <div className="text-xs text-slate-400">Public • Demo</div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Decorative blurred shape below */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.48, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute inset-x-0 bottom-0 -mb-24 flex justify-center"
      >
        <div className="w-[760px] h-[220px] bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-3xl opacity-40 blur-2xl transform-gpu" />
      </motion.div>
    </section>
  );
}
