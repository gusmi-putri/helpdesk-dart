import React from 'react';
import { Users, Package } from 'lucide-react';
import MutationHistory from './MutationHistory';
import UserMutationHistory from './UserMutationHistory';

interface StafMutationCenterProps {
  dbMutations: any[];
  dbUserMutations: any[];
  activeTab: 'PERSONEL' | 'INVENTARIS';
  setActiveTab: (tab: 'PERSONEL' | 'INVENTARIS') => void;
}

const StafMutationCenter: React.FC<StafMutationCenterProps> = ({
  dbMutations,
  dbUserMutations,
  activeTab,
  setActiveTab
}) => {
  const pendingPersonelCount = dbUserMutations.filter((m: any) => m.status === 'pending').length;
  const pendingMutationsCount = dbMutations.filter((m: any) => m.status === 'pending').length;

  return (
    <div className="animate-in fade-in relative space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('PERSONEL')}
          className={`flex-1 py-3 px-6 text-sm font-tactical tracking-widest uppercase transition-all border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'PERSONEL'
              ? 'border-cighra-primary dark:border-cighra-gold text-cighra-primary dark:text-cighra-gold bg-white dark:bg-slate-800/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/30'
          }`}
        >
          <Users className="w-4 h-4" /> PERSONEL
          {pendingPersonelCount > 0 && (
            <span className="bg-cighra-gold text-slate-900 font-bold text-xs px-1.5 py-0.5 rounded-full ml-1">{pendingPersonelCount}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('INVENTARIS')}
          className={`flex-1 py-3 px-6 text-sm font-tactical tracking-widest uppercase transition-all border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'INVENTARIS'
              ? 'border-cighra-primary dark:border-cighra-gold text-cighra-primary dark:text-cighra-gold bg-white dark:bg-slate-800/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/30'
          }`}
        >
          <Package className="w-4 h-4" /> INVENTARIS
          {pendingMutationsCount > 0 && (
            <span className="bg-cighra-gold text-slate-900 font-bold text-xs px-1.5 py-0.5 rounded-full ml-1">{pendingMutationsCount}</span>
          )}
        </button>
      </div>

      <div className="pt-2">
        {activeTab === 'PERSONEL' && (
          <UserMutationHistory dbMutations={dbUserMutations} />
        )}
        {activeTab === 'INVENTARIS' && (
          <MutationHistory dbMutations={dbMutations} />
        )}
      </div>
    </div>
  );
};

export default StafMutationCenter;
