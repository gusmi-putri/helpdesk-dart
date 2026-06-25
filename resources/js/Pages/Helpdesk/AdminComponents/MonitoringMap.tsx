import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Shield, AlertTriangle, CheckCircle, Search, Target, Map as MapIcon, ArrowLeft } from 'lucide-react';

// Fix for default marker icons in Leaflet with Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MonitoringMapProps {
    dbUnits: any[];
    dbCases: any[];
    dbSatuans?: any[];
}

import { INDONESIA_BOUNDS } from './MapCoordinates';
import { router } from '@inertiajs/react';

const MonitoringMap: React.FC<MonitoringMapProps> = ({ dbUnits, dbCases, dbSatuans = [] }) => {
    const [mapCenter] = useState<[number, number]>([-2.5489, 118.0149]); // Center of Indonesia
    const [zoom] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<any>(null);

    // Filter pending satuans
    const pendingSatuans = dbSatuans.filter(s => s.latitude === null || s.longitude === null);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [pendingSatuanEdit, setPendingSatuanEdit] = useState<any>(null);
    const [latInput, setLatInput] = useState('');
    const [lngInput, setLngInput] = useState('');

    // Filter units based on search
    const filteredUnits = dbUnits.filter(unit => 

        unit.nomor_seri.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.asal_satuan.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group units by Satuan to show on map
    const satuanGroups = filteredUnits.reduce((acc, unit) => {
        const satuanName = unit.satuan ? unit.satuan.nama_satuan : (unit.asal_satuan || 'Umum');
        
        // Lookup coordinates from dbSatuans
        const satuanData = unit.satuan || dbSatuans.find(s => s.nama_satuan === satuanName);
        const coords = satuanData && satuanData.latitude !== null && satuanData.longitude !== null 
            ? [parseFloat(satuanData.latitude), parseFloat(satuanData.longitude)] 
            : null;

        if (!acc[satuanName]) {
            acc[satuanName] = {
                name: satuanName,
                coords: coords,
                units: [],
                hasDamage: false
            };
        }
        acc[satuanName].units.push(unit);
        
        // Check if this unit has an active case
        const hasActiveCase = dbCases.some(c => 
            c.unit_id === unit.db_id && (c.status !== 'SELESAI' && c.status !== 'DITOLAK')
        );
        if (hasActiveCase) acc[satuanName].hasDamage = true;
        
        return acc;
    }, {} as Record<string, any>);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSaveCoordinate = () => {
        if (!pendingSatuanEdit) return;
        router.put(`/satuans/${pendingSatuanEdit.id}`, {
            nama_satuan: pendingSatuanEdit.nama_satuan,
            latitude: latInput,
            longitude: lngInput
        }, {
            onSuccess: () => {
                setPendingSatuanEdit(null);
                setLatInput('');
                setLngInput('');
                if (pendingSatuans.length <= 1) setShowPendingModal(false);
            }
        });
    };

    const handleDeleteSatuan = () => {
        if (!pendingSatuanEdit) return;
        router.delete(`/satuans/${pendingSatuanEdit.id}`, {
            onSuccess: () => {
                setShowDeleteConfirm(false);
                setPendingSatuanEdit(null);
                if (pendingSatuans.length <= 1) setShowPendingModal(false);
            }
        });
    };

    const createCustomIcon = (hasDamage: boolean) => {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="${hasDamage ? 'marker-pin-red' : 'marker-pin-green'}"></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header Taktis */}
            <div className="glass-panel border-t-4 border-t-cighra-gold p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-cighra-gold/10 text-cighra-gold rounded-sm border border-cighra-gold/20">
                        <MapIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-tactical font-bold tracking-widest uppercase text-slate-800 dark:text-white">PETA MONITORING OPERASIONAL DART</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-tighter uppercase">Real-time Saturation & Deployment Status</p>
                    </div>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="CARI SATUAN / NO SERI..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-cighra-dark border border-slate-200 dark:border-slate-700 rounded-sm py-2 pl-10 pr-4 text-xs font-tactical tracking-widest focus:ring-1 focus:ring-cighra-gold outline-none uppercase transition-all"
                    />
                </div>
            </div>

            {/* Pending Satuans Alert */}
            {pendingSatuans.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/50 p-4 rounded-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="text-orange-500" />
                        <div>
                            <h3 className="text-sm font-bold font-tactical tracking-widest text-orange-600 dark:text-orange-400">PERHATIAN: ADA {pendingSatuans.length} SATUAN BARU TANPA KOORDINAT</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Satuan dan unitnya tidak akan muncul di Peta Monitor sebelum koordinat ditambahkan.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowPendingModal(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-xs font-bold font-tactical tracking-widest rounded-sm transition-colors"
                    >
                        TETAPKAN KOORDINAT
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Legenda & Status List */}
                <div className="lg:col-span-1 space-y-4 h-[600px] flex flex-col">
                    <div className="glass-panel p-4 space-y-4">
                        <h3 className="font-tactical font-bold text-sm tracking-widest uppercase border-b border-slate-200 dark:border-slate-700 pb-2">LEGENDA STATUS</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                                <span className="text-xs font-tactical tracking-wider uppercase text-slate-600 dark:text-slate-400">BEROPERASI</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(229,87,34,0.6)] animate-pulse"></div>
                                <span className="text-xs font-tactical tracking-wider uppercase text-slate-600 dark:text-slate-400">KENDALA TEKNIS</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-4 flex-1 overflow-hidden flex flex-col min-h-0">
                        {selectedGroup ? (
                            <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300 min-h-0">
                                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 mb-3 shrink-0">
                                    <button 
                                        onClick={() => setSelectedGroup(null)}
                                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-500"
                                    >
                                        <ArrowLeft size={16} />
                                    </button>
                                    <Target size={16} className="text-cighra-gold" />
                                    <h3 className="font-tactical font-bold text-sm tracking-widest uppercase flex-1 truncate">{selectedGroup.name}</h3>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 min-h-0">
                                    {selectedGroup.units.map((unit: any) => {
                                        const hasCase = dbCases.some(c => c.unit_id === unit.db_id && (c.status !== 'SELESAI' && c.status !== 'DITOLAK'));
                                        return (
                                            <div key={unit.db_id} className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-200 dark:border-slate-700/50">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{unit.nomor_seri}</span>
                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                                                            <Target size={10} className="text-cighra-gold" /> {unit.jenis || 'DART'}
                                                        </span>
                                                    </div>
                                                    {hasCase ? (
                                                        <span className="bg-orange-500/20 text-orange-600 dark:text-orange-500 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-500/30">RUSAK</span>
                                                    ) : (
                                                        <span className="bg-green-500/20 text-green-600 dark:text-green-500 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-500/30">BEROPERASI</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 shrink-0">
                                    <div className="text-[9px] text-slate-500 font-mono text-center">
                                        COORD: {selectedGroup.coords[0].toFixed(4)}, {selectedGroup.coords[1].toFixed(4)}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col animate-in fade-in duration-300 min-h-0">
                                <h3 className="font-tactical font-bold text-sm tracking-widest uppercase border-b border-slate-200 dark:border-slate-700 pb-2 mb-3 shrink-0">RINGKASAN SATUAN</h3>
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 min-h-0">
                                    {Object.values(satuanGroups).map((group: any) => (
                                        <div 
                                            key={group.name} 
                                            onClick={() => group.coords && setSelectedGroup(group)}
                                            className={`p-3 border rounded-sm transition-all ${group.coords ? 'cursor-pointer hover:shadow-md' : 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-cighra-dark/60 border-slate-300 dark:border-slate-600 border-dashed'} ${group.hasDamage && group.coords ? 'bg-orange-500/5 border-orange-500/30 hover:border-orange-500/60' : (group.coords ? 'bg-slate-50 dark:bg-cighra-dark/30 border-slate-200 dark:border-slate-700 hover:border-cighra-gold/50' : '')}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold font-tactical tracking-wider truncate max-w-[120px] uppercase">{group.name}</span>
                                                {group.hasDamage ? <AlertTriangle size={14} className="text-orange-500" /> : <Shield size={14} className="text-green-500" />}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-slate-500 uppercase">{group.units.length} Unit</span>
                                                <span className={`text-[10px] font-bold ${!group.coords ? 'text-slate-400' : (group.hasDamage ? 'text-orange-500' : 'text-green-500')}`}>
                                                    {!group.coords ? 'TANPA KOORDINAT' : (group.hasDamage ? 'PERLU ATENSI' : 'NORMAL')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Container */}
                <div className="lg:col-span-3 glass-panel p-2 h-[600px] overflow-hidden relative group">
                    <div className="absolute top-4 right-4 z-[1000] bg-cighra-dark/80 backdrop-blur-md border border-cighra-gold/30 p-2 rounded-sm text-[10px] font-mono text-cighra-gold uppercase tracking-widest pointer-events-none">
                        Tactical View Enabled
                    </div>
                    
                    <MapContainer 
                        center={mapCenter} 
                        zoom={zoom} 
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                        scrollWheelZoom={true}
                        className="z-0"
                        maxBounds={INDONESIA_BOUNDS}
                        maxBoundsViscosity={1.0}
                        minZoom={5}
                    >
                        {/* Bright Modern Map Tiles */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        
                        <ZoomControl position="bottomright" />

                        {Object.values(satuanGroups).map((group: any) => (
                            group.coords && (
                                <Marker 
                                    key={group.name} 
                                    position={group.coords} 
                                    icon={createCustomIcon(group.hasDamage)}
                                    eventHandlers={{
                                        click: () => {
                                            setSelectedGroup(group);
                                        }
                                    }}
                                >
                                </Marker>
                            )
                        ))}
                    </MapContainer>
                </div>
            </div>

            {/* Pending Satuans Modal */}
            {showPendingModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-2xl shadow-xl animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 flex justify-between items-center">
                            <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold">PENGATURAN KOORDINAT SATUAN BARU</h3>
                            <button onClick={() => { setShowPendingModal(false); setPendingSatuanEdit(null); }} className="text-slate-500 hover:text-red-500">✕</button>
                        </div>
                        <div className="p-6 flex flex-col md:flex-row gap-6">
                            <div className="flex-1 border-r border-slate-200 dark:border-slate-700 pr-6">
                                <h4 className="text-xs font-bold uppercase mb-4 opacity-70">DAFTAR SATUAN BARU:</h4>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {pendingSatuans.map(s => (
                                        <div 
                                            key={s.id} 
                                            onClick={() => { setPendingSatuanEdit(s); setLatInput(''); setLngInput(''); }}
                                            className={`p-3 border rounded-sm cursor-pointer transition-colors ${pendingSatuanEdit?.id === s.id ? 'bg-cighra-primary/10 border-cighra-primary dark:border-cighra-gold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
                                        >
                                            <div className="font-bold text-sm tracking-wider">{s.nama_satuan}</div>
                                        </div>
                                    ))}
                                    {pendingSatuans.length === 0 && <p className="text-sm italic opacity-50">Semua satuan sudah memiliki koordinat.</p>}
                                </div>
                            </div>
                            <div className="flex-1">
                                {pendingSatuanEdit ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b border-cighra-primary/30 pb-2 mb-2">
                                            <h4 className="text-sm font-bold text-cighra-primary dark:text-cighra-gold truncate uppercase">Edit Data Satuan</h4>
                                            <button 
                                                onClick={() => setShowDeleteConfirm(true)}
                                                className="text-[10px] text-red-500 hover:underline font-mono"
                                            >
                                                HAPUS SATUAN
                                            </button>
                                        </div>

                                        {showDeleteConfirm ? (
                                            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-sm animate-in zoom-in-95 duration-200">
                                                <p className="text-xs text-red-600 dark:text-red-400 font-bold mb-3 uppercase tracking-tighter">
                                                    ANDA YAKIN INGIN MENGHAPUS SATUAN "{pendingSatuanEdit.nama_satuan}"? 
                                                    <span className="block font-normal mt-1 opacity-70 italic text-[10px]">Tindakan ini tidak dapat dibatalkan.</span>
                                                </p>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={handleDeleteSatuan}
                                                        className="flex-1 bg-red-600 text-white py-2 text-[10px] font-bold font-tactical tracking-widest uppercase hover:bg-red-700"
                                                    >
                                                        IYA, HAPUS SEKARANG
                                                    </button>
                                                    <button 
                                                        onClick={() => setShowDeleteConfirm(false)}
                                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold"
                                                    >
                                                        BATAL
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div>
                                                    <label className="block text-[10px] font-mono font-bold mb-1">NAMA SATUAN (Huruf Kapital)</label>
                                                    <input 
                                                        type="text" 
                                                        value={pendingSatuanEdit.nama_satuan} 
                                                        onChange={e => setPendingSatuanEdit({...pendingSatuanEdit, nama_satuan: e.target.value.toUpperCase()})} 
                                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-mono focus:border-cighra-primary uppercase" 
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-[10px] font-mono font-bold mb-1">LATITUDE</label>
                                                        <input type="number" step="0.000001" value={latInput} onChange={e => setLatInput(e.target.value)} placeholder="-6.2..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-mono" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-mono font-bold mb-1">LONGITUDE</label>
                                                        <input type="number" step="0.000001" value={lngInput} onChange={e => setLngInput(e.target.value)} placeholder="106.8..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-mono" />
                                                    </div>
                                                </div>

                                                <div className="pt-4 flex flex-col gap-2">
                                                    <button 
                                                        onClick={handleSaveCoordinate}
                                                        className="w-full py-3 bg-cighra-primary dark:bg-cighra-gold text-white dark:text-slate-900 font-tactical tracking-widest text-xs shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
                                                    >
                                                        SIMPAN & VERIFIKASI SEKARANG
                                                    </button>
                                                    <p className="text-[9px] text-center opacity-50 font-mono">Menyimpan akan membuat satuan ini muncul di pilihan pendaftaran.</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-sm font-mono opacity-50 italic text-center p-4">
                                        Pilih satuan di samping untuk mulai mengatur koordinat.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonitoringMap;

