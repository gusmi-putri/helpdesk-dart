import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Contact from './components/Contact';
import Login from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardStaf from './components/DashboardStaf';
import DashboardTeknisi from './components/DashboardTeknisi';
import DashboardPelapor from './components/DashboardPelapor';
import { useStore } from './store/useStore';

// Komponen Pembungkus untuk Halaman yang Membutuhkan Login
const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) => {
  const currentUser = useStore((state) => state.currentUser);
  
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role.toLowerCase() !== allowedRole) return <Navigate to="/login" replace />;
  
  return children;
};

// Komponen Landing Page Keseluruhan
const LandingPage = () => (
  <>
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
  </>
);

function App() {
  const currentUser = useStore((state) => state.currentUser);
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="bg-sand dark:bg-gunmetal min-h-screen font-sans selection:bg-targetred selection:text-gunmetal dark:text-white flex flex-col">
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/login" element={
            currentUser ? <Navigate to={`/${currentUser.role.toLowerCase()}`} replace /> :
            <div className="pt-16">
               <Navbar />
               <Login onLoginSuccess={() => {}} /> 
            </div>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin"><DashboardAdmin /></ProtectedRoute>
          } />
          <Route path="/staf" element={
            <ProtectedRoute allowedRole="staf"><DashboardStaf /></ProtectedRoute>
          } />
          <Route path="/teknisi" element={
            <ProtectedRoute allowedRole="teknisi"><DashboardTeknisi /></ProtectedRoute>
          } />
          <Route path="/pelapor" element={
            <ProtectedRoute allowedRole="pelapor"><DashboardPelapor /></ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
