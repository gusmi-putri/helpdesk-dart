import React from 'react';
import Navbar from '@/Components/Navbar';
import Hero from '@/Components/Hero';
import About from '@/Components/About';
import Contact from '@/Components/Contact';
import AboutUs from '@/Components/AboutUs';

export default function Landing() {
  return (
    <div className="bg-sand dark:bg-gunmetal min-h-screen font-sans selection:bg-targetred selection:text-gunmetal dark:text-white flex flex-col">
      <main className="flex-grow">
        <Navbar />
        <Hero />
        <About />
        <Contact />
        <AboutUs />
        <footer className="bg-sand/30 dark:bg-black/60 py-8 border-t border-soft-gunmetal/10 dark:border-soft-sand/5 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-soft-gunmetal/70 dark:text-soft-sand/50 font-tactical tracking-widest text-sm">
              &copy; {new Date().getFullYear()} HELPDESK DART COMMAND CENTER. HAK CIPTA DILINDUNGI.
            </p>
            <p className="text-soft-gunmetal/50 dark:text-soft-sand/30 text-[10px] mt-2 font-mono uppercase">
              Koneksi Aman Terverifikasi. Sistem Terenkripsi.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
