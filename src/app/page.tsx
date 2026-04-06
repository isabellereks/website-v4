"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { workEntries } from "@/data/work";
import { writingEntries } from "@/data/writing";
import { projects } from "@/data/projects";

const tabs = ["Home", "About", "Work", "Contact"] as const;
type Tab = (typeof tabs)[number];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ── Home Tab ──
function HomeTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4">
      {/* Hero card */}
      <Card className="md:row-span-2">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/headshot.jpeg" alt="Isabelle" width={48} height={48} className="rounded-full" />
          <div>
            <h1 className="text-xl font-semibold">Isabelle Reksopuro</h1>
            <p className="text-xs text-neutral-400">Tech & Public Policy</p>
          </div>
        </div>
        <div className="space-y-4 text-neutral-500 leading-relaxed">
          <p className="text-neutral-800 text-lg">
            Hi! I&apos;m Isabelle, an Indonesian-American <span className="inline-block animate-pulse">🇮🇩🇺🇸</span> exploring the intersection of tech & public policy.
          </p>
          <p>
            I think it&apos;s terrible our politicians don&apos;t know how wifi works, and the ones that do are misusing taxpayer funds to develop weapons with AI.
          </p>
          <p>
            I&apos;ve made it my personal mission to work on projects dealing with tech and improving how it intersects in our lives.
          </p>
          <p>
            On the side, I plan on traveling the world and eating through all the cuisines it has to offer.
          </p>
        </div>
      </Card>

      {/* Twitter card */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Image src="/headshot.jpeg" alt="Isabelle" width={36} height={36} className="rounded-full" />
            <div>
              <p className="text-sm font-semibold">Isabelle Reksopuro</p>
              <p className="text-xs text-neutral-400">@isareksopuro</p>
            </div>
          </div>
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1DA1F2] fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </div>
        <p className="text-sm leading-relaxed">
          building side projects & running the{" "}
          <a href="https://www.instagram.com/seattlejunkjournalclub/" className="text-[#1DA1F2]">@seattlejunkjournalclub</a>
          {" "}☕ tech x public policy @ UW
        </p>
        <a href="https://twitter.com/isareksopuro" className="mt-4 block w-full text-center py-2 rounded-full border border-neutral-200 text-sm font-medium hover:bg-neutral-50 transition-colors">
          Follow me ↗
        </a>
      </Card>

      {/* Currently card */}
      <Card>
        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-2">Currently</p>
        <div className="space-y-2 text-sm text-neutral-600">
          <p>
            <s className="text-neutral-300">In class</s> — Building side projects
          </p>
          <p>Writing on <a href="https://isabellereksopuro.substack.com/" className="text-[#AD606E] font-medium">Substack</a></p>
          <p>Campaigning with <a href="https://www.advocatesforyouth.org/" className="text-[#AD606E] font-medium">Advocates for Youth</a></p>
        </div>
      </Card>
    </div>
  );
}

// ── About Tab ──
function AboutTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4">
      {/* Bio card */}
      <Card className="md:row-span-2">
        <h2 className="text-2xl font-semibold mb-4">What I&apos;m About.</h2>
        <hr className="border-neutral-100 mb-4" />

        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-2">Background</p>
        <p className="text-neutral-500 leading-relaxed mb-5">
          I&apos;m an Indonesian-American student at the University of Washington. I care deeply about making technology work for people, not against them. I believe our politicians need to understand the tools shaping our world.
        </p>

        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-2">What I Do Now</p>
        <p className="text-neutral-500 leading-relaxed mb-5">
          I&apos;m building side projects, running the{" "}
          <a href="https://www.instagram.com/seattlejunkjournalclub/" className="text-neutral-800 font-medium">Seattle Junk Journal Club</a>,
          and writing on <a href="https://isabellereksopuro.substack.com/" className="text-neutral-800 font-medium">Substack</a>.
          I&apos;m also campaigning for reproductive justice with{" "}
          <a href="https://www.advocatesforyouth.org/" className="text-neutral-800 font-medium">Advocates for Youth</a>.
        </p>

        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-2">On the Side</p>
        <p className="text-neutral-500 leading-relaxed mb-5">
          I lead the student ambassador program at the{" "}
          <a href="https://aaylc.org" className="text-neutral-800 font-medium">Asian American Youth Leadership Conference</a>{" "}
          for 600+ students.
        </p>

        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-2">Misc</p>
        <p className="text-neutral-500 leading-relaxed">
          I like binging K-dramas, downing gallons of matcha, baking blueberry scones, and reading at 1,200+ WPM (unofficially benchmarked).
        </p>
      </Card>

      {/* Social card */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Image src="/headshot.jpeg" alt="Isabelle" width={36} height={36} className="rounded-full" />
            <div>
              <p className="text-sm font-semibold">Isabelle Reksopuro</p>
              <p className="text-xs text-neutral-400">@isareksopuro</p>
            </div>
          </div>
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1DA1F2] fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </div>
        <p className="text-sm leading-relaxed">
          tech x public policy 🌏 building things that matter
        </p>
        <a href="https://twitter.com/isareksopuro" className="mt-4 block w-full text-center py-2 rounded-full border border-neutral-200 text-sm font-medium hover:bg-neutral-50 transition-colors">
          Read mid tweets ↗
        </a>
      </Card>

      {/* Photo card */}
      <Card className="p-0 overflow-hidden">
        <Image src="/headshot.jpeg" alt="Isabelle" width={400} height={400} className="w-full h-48 object-cover" />
      </Card>
    </div>
  );
}

// ── Work Tab ──
function WorkTab() {
  const [openWork, setOpenWork] = useState<Record<number, boolean>>({});
  let lastYear = "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4">
      {/* Experience card */}
      <Card className="md:row-span-2">
        <h2 className="text-2xl font-semibold mb-4">Experience.</h2>
        <hr className="border-neutral-100 mb-2" />
        <div>
          {workEntries.map((entry, i) => {
            const showYear = entry.year !== lastYear;
            lastYear = entry.year;
            return (
              <button key={i} onClick={() => setOpenWork((prev) => ({ ...prev, [i]: !prev[i] }))}
                className={`w-full text-left cursor-pointer py-3 flex gap-4 items-start ${showYear && i !== 0 ? "border-t border-neutral-100" : ""}`}>
                <span className="text-sm text-neutral-300 w-10 shrink-0 pt-0.5">{showYear ? entry.year : ""}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <a href={entry.orgUrl} onClick={(e) => e.stopPropagation()} className="text-sm font-medium hover:text-neutral-500 transition-colors">{entry.org}</a>
                    <motion.span className="text-neutral-400 shrink-0 inline-flex" animate={{ rotate: openWork[i] ? 90 : 0 }} transition={{ duration: 0.15 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </motion.span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">{entry.title}</p>
                  <AnimatePresence>
                    {openWork[i] && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }} className="overflow-hidden">
                        <p className="text-sm text-neutral-500 mt-2 leading-relaxed">{entry.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Writing card */}
      <Card>
        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-3">Writing</p>
        <div className="space-y-0">
          {writingEntries.map((entry, i) => (
            <a key={i} href={entry.url} className="block py-2 group">
              <p className="text-sm group-hover:text-neutral-500 transition-colors">{entry.title}</p>
              <p className="text-xs text-neutral-400">{entry.date}</p>
            </a>
          ))}
        </div>
        <a href="https://isabellereksopuro.substack.com/" className="mt-3 block w-full text-center py-2 rounded-full border border-neutral-200 text-sm font-medium hover:bg-neutral-50 transition-colors">
          Read on Substack ↗
        </a>
      </Card>

      {/* Projects card */}
      <Card>
        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-3">Projects</p>
        <div className="space-y-0">
          {projects.map((project, i) => (
            <div key={i} className="py-2">
              {project.url ? (
                <a href={project.url} className="text-sm font-medium hover:text-neutral-500 transition-colors">{project.name}</a>
              ) : (
                <p className="text-sm font-medium">{project.name}</p>
              )}
              <p className="text-xs text-neutral-400">{project.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Contact Tab ──
function ContactTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* iMessage card */}
      <Card className="md:col-span-2">
        <div className="max-w-md mx-auto py-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-end">
              <Image src="/headshot.jpeg" alt="Isabelle" width={28} height={28} className="rounded-full shrink-0" />
              <div>
                <p className="text-xs text-neutral-400 mb-1">Isabelle</p>
                <div className="bg-neutral-100 rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <p className="text-sm">Want to work together? Just want to chat? Send me a message!</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#007AFF] text-white rounded-2xl rounded-br-sm px-4 py-2.5">
                <p className="text-sm">sounds good 🙏</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <a href="mailto:reksopuro.isabelle@gmail.com" className="text-neutral-400 hover:text-neutral-600 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
            <a href="https://twitter.com/isareksopuro" className="text-neutral-400 hover:text-neutral-600 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <div className="flex-1 ml-1">
              <div className="bg-neutral-100 rounded-full px-4 py-2 text-sm text-neutral-400">iMessage</div>
            </div>
            <div className="w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
            </div>
          </div>
        </div>
      </Card>

      {/* Email card */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold">Isabelle Reksopuro</p>
            <p className="text-xs text-neutral-400">reksopuro.isabelle@gmail.com</p>
          </div>
        </div>
        <div className="border-l-2 border-[#AD606E]/30 pl-3 space-y-1 text-sm text-neutral-500 mb-4">
          <p className="text-xs text-neutral-400">To reksopuro.isabelle@gmail.com</p>
          <p>Let&apos;s Chat</p>
          <p className="text-neutral-400">Say hello</p>
        </div>
        <a href="mailto:reksopuro.isabelle@gmail.com" className="block w-full text-center py-2 rounded-full border border-neutral-200 text-sm font-medium hover:bg-neutral-50 transition-colors">
          Email Me ↗
        </a>
      </Card>

      {/* Twitter DM card */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Image src="/headshot.jpeg" alt="Isabelle" width={36} height={36} className="rounded-full" />
            <div>
              <p className="text-sm font-semibold">Isabelle Reksopuro</p>
              <p className="text-xs text-neutral-400">@isareksopuro</p>
            </div>
          </div>
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1DA1F2] fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </div>
        <p className="text-sm leading-relaxed mb-4">
          tech & public policy 🌏 building things @ <a href="https://www.washington.edu/" className="text-[#1DA1F2]">UW</a>
        </p>
        <a href="https://twitter.com/isareksopuro" className="block w-full text-center py-2 rounded-full border border-neutral-200 text-sm font-medium hover:bg-neutral-50 transition-colors">
          DM Me ↗
        </a>
      </Card>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Home");

  return (
    <div className="min-h-screen bg-neutral-100/80 font-[family-name:var(--font-inter)]">
      {/* Floating Navbar */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center bg-white rounded-full shadow-sm border border-neutral-200/60 p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2 rounded-full text-sm transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-neutral-100 font-medium text-neutral-800"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab === "Work" && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#AD606E] rounded-full" />}
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          >
            {activeTab === "Home" && <HomeTab />}
            {activeTab === "About" && <AboutTab />}
            {activeTab === "Work" && <WorkTab />}
            {activeTab === "Contact" && <ContactTab />}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <p className="text-center text-neutral-400 text-xs mt-12">Made with stardust ★ by Isabelle</p>
      </main>
    </div>
  );
}
