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
}

import { getCoordinatesForSatuan, INDONESIA_BOUNDS } from './MapCoordinates';

const MonitoringMap: React.FC<MonitoringMapProps> = ({ dbUnits, dbCases }) => {
    const [mapCenter] = useState<[number, number]>([-2.5489, 118.0149]); // Center of Indonesia
    const [zoom] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<any>(null);

    // Filter units based on search
    const filteredUnits = dbUnits.filter(unit => 
        unit.nama_dart.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.nomor_seri.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.asal_satuan.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group units by Satuan to show on map
    const satuanGroups = filteredUnits.reduce((acc, unit) => {
        const satuan = unit.asal_satuan || 'Umum';
        if (!acc[satuan]) {
            acc[satuan] = {
                name: satuan,
                coords: getCoordinatesForSatuan(satuan),
                units: [],
                hasDamage: false
            };
        }
        acc[satuan].units.push(unit);
        
        // Check if this unit has an active case
        const hasActiveCase = dbCases.some(c => 
            c.unit_id === unit.db_id && (c.status !== 'SELESAI' && c.status !== 'DITOLAK')
        );
        if (hasActiveCase) acc[satuan].hasDamage = true;
        
        return acc;
    }, {} as Record<string, any>);

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

                    <div className="glass-panel p-4 flex-1 overflow-hidden flex flex-col">
                        {selectedGroup ? (
                            <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
                                    <button 
                                        onClick={() => setSelectedGroup(null)}
                                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-500"
                                    >
                                        <ArrowLeft size={16} />
                                    </button>
                                    <Target size={16} className="text-cighra-gold" />
                                    <h3 className="font-tactical font-bold text-sm tracking-widest uppercase flex-1 truncate">{selectedGroup.name}</h3>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                                    {selectedGroup.units.map((unit: any) => {
                                        const hasCase = dbCases.some(c => c.unit_id === unit.db_id && (c.status !== 'SELESAI' && c.status !== 'DITOLAK'));
                                        return (
                                            <div key={unit.db_id} className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-200 dark:border-slate-700/50">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="font-bold text-xs text-slate-700 dark:text-slate-300">{unit.nomor_seri}</div>
                                                    {hasCase ? (
                                                        <span className="bg-orange-500/20 text-orange-600 dark:text-orange-500 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-500/30">RUSAK</span>
                                                    ) : (
                                                        <span className="bg-green-500/20 text-green-600 dark:text-green-500 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-500/30">BEROPERASI</span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-mono italic">{unit.nama_dart}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                    <div className="text-[9px] text-slate-500 font-mono text-center">
                                        COORD: {selectedGroup.coords[0].toFixed(4)}, {selectedGroup.coords[1].toFixed(4)}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col animate-in fade-in duration-300">
                                <h3 className="font-tactical font-bold text-sm tracking-widest uppercase border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">RINGKASAN SATUAN</h3>
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                                    {Object.values(satuanGroups).map((group: any) => (
                                        <div 
                                            key={group.name} 
                                            onClick={() => setSelectedGroup(group)}
                                            className={`p-3 border rounded-sm transition-all cursor-pointer hover:shadow-md ${group.hasDamage ? 'bg-orange-500/5 border-orange-500/30 hover:border-orange-500/60' : 'bg-slate-50 dark:bg-cighra-dark/30 border-slate-200 dark:border-slate-700 hover:border-cighra-gold/50'}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold font-tactical tracking-wider truncate max-w-[120px] uppercase">{group.name}</span>
                                                {group.hasDamage ? <AlertTriangle size={14} className="text-orange-500" /> : <Shield size={14} className="text-green-500" />}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-slate-500 uppercase">{group.units.length} Unit</span>
                                                <span className={`text-[10px] font-bold ${group.hasDamage ? 'text-orange-500' : 'text-green-500'}`}>
                                                    {group.hasDamage ? 'PERLU ATENSI' : 'NORMAL'}
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
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default MonitoringMap;
