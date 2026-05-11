import React from 'react';
import Navbar from '@/Components/Navbar';
import Hero from '@/Components/Hero';
import About from '@/Components/About';
import Contact from '@/Components/Contact';
import AboutUs from '@/Components/AboutUs';

export default function Landing() {
  return (
    <div className="bg-slate-50 dark:bg-gunmetal min-h-screen font-sans selection:bg-targetred selection:text-slate-800 dark:text-white flex flex-col">
      <main className="flex-grow">
        <Navbar />
        <Hero />
        <About />
        <Contact />
        <AboutUs />
        <footer className="bg-white dark:bg-navy/70 py-8 border-t border-slate-200 dark:border-slate-700 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-slate-600 dark:text-slate-300 font-tactical tracking-widest text-sm">
              &copy; {new Date().getFullYear()} HELPDESK DART COMMAND CENTER. HAK CIPTA DILINDUNGI.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-2 font-mono uppercase">
              Koneksi Aman Terverifikasi. Sistem Terenkripsi.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
