import React from 'react';
import Navbar from '@/Components/Navbar';
import Hero from '@/Components/Hero';
import About from '@/Components/About';
import Contact from '@/Components/Contact';
import AboutUs from '@/Components/AboutUs';

export default function Landing() {
  return (
    <div className="bg-cighra-light dark:bg-cighra-dark min-h-screen font-sans selection:bg-cighra-primary selection:text-white flex flex-col">
      <main className="flex-grow">
        <Navbar />
        <Hero />
        <About />
        <Contact />
        <AboutUs />
        <footer className="bg-white dark:bg-cighra-darkcard/70 py-8 border-t border-slate-200 dark:border-slate-600 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-slate-600 dark:text-slate-300 font-tactical tracking-widest text-sm">
              &copy; {new Date().getFullYear()} SISFO DART (DYNAMIC AUTONOMOUS RETALIATORY TARGET) COMMAND CENTER.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 font-mono uppercase">
              CIGRHA APTA NIRBHAYA
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

