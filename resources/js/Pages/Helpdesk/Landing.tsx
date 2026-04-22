import React from 'react';
import Navbar from '@/Components/Navbar';
import Hero from '@/Components/Hero';
import About from '@/Components/About';
import Features from '@/Components/Features';
import Contact from '@/Components/Contact';

export default function Landing() {
  return (
    <div className="bg-sand dark:bg-gunmetal min-h-screen font-sans selection:bg-targetred selection:text-gunmetal dark:text-white flex flex-col">
      <main className="flex-grow">
        <Navbar />
        <Hero />
        <About />
        <Features />
        <Contact />
        <footer className="bg-white dark:bg-black py-8 border-t border-gray-300 dark:border-gray-800 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-gray-600 dark:text-gray-500 font-tactical tracking-widest text-sm">
              &copy; {new Date().getFullYear()} HELPDESK DART COMMAND CENTER. ALL RIGHTS RESERVED.
            </p>
            <p className="text-gray-600 text-xs mt-2 font-mono">
              SECURE CONNECTION ESTABLISHED. AES-256 ACTIVE.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
