import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Shield, AlertTriangle, Search, Target, Map as MapIcon, ArrowLeft } from 'lucide-react';
import { Badge } from '@/Components/ui/Badge';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// Fix for default marker icons in Leaflet with Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
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
    initialFocusSatuan?: string | null;
}

const MapController = ({ 
    selectedCoords, 
    activeZoom = 12 
}: { 
    selectedCoords: [number, number] | null, 
    activeZoom?: number 
}) => {
    const map = useMap();
    
    useEffect(() => {
        if (selectedCoords) {
            map.flyTo(selectedCoords, activeZoom, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }, [selectedCoords, map, activeZoom]);

    return null;
};

const MapSearchControl = ({ onLocationSelected }: { onLocationSelected?: (lat: number, lng: number, label?: string) => void }) => {
    const map = useMap();
    useEffect(() => {
        const provider = new OpenStreetMapProvider({
            params: {
                countrycodes: 'id', // Restrict search to Indonesia
                addressdetails: 1,
                limit: 5
            }
        });
        const searchControl = new (GeoSearchControl as any)({
            provider: provider,
            style: 'bar',
            showMarker: true,
            showPopup: false,
            autoClose: true,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: true,
            searchLabel: 'Cari alamat atau kota...',
        });
        map.addControl(searchControl);

        const handleLocationFound = (result: any) => {
            if (onLocationSelected && result && result.location) {
                // GeoSearch result location contains x (longitude) and y (latitude)
                onLocationSelected(result.location.y, result.location.x, result.location.label);
            }
        };
        map.on('geosearch/showlocation', handleLocationFound);

        return () => {
            map.removeControl(searchControl);
            map.off('geosearch/showlocation', handleLocationFound);
        };
    }, [map, onLocationSelected]);
    return null;
};

const MapClickHandler = ({ onLocationSelected }: { onLocationSelected: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click(e) {
            onLocationSelected(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

import { INDONESIA_BOUNDS } from './MapCoordinates';

const MonitoringMap: React.FC<MonitoringMapProps> = ({ dbUnits, dbCases, dbSatuans = [], initialFocusSatuan = null }) => {
    const [mapCenter] = useState<[number, number]>([-2.5489, 118.0149]); // Center of Indonesia
    const [zoom] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<any>(null);

    // Group units by Satuan to show on map
    const satuanGroups = React.useMemo(() => {
        return dbUnits.reduce((acc, unit) => {
            const satuanName = unit.satuan ? unit.satuan.nama_satuan : (unit.asal_satuan || 'Umum');
            
            // Lookup coordinates from dbSatuans
            const satuanData = unit.satuan || dbSatuans.find(s => s.nama_satuan === satuanName);
            const coords = satuanData && satuanData.latitude !== null && satuanData.longitude !== null 
                ? [parseFloat(satuanData.latitude), parseFloat(satuanData.longitude)] as [number, number]
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
    }, [dbUnits, dbCases, dbSatuans]);

    // Filter units based on search
    const filteredSatuanGroups = React.useMemo(() => {
        if (!searchQuery) return Object.values(satuanGroups);
        return Object.values(satuanGroups).filter((group: any) => 
            group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.units.some((u: any) => u.nomor_seri.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [satuanGroups, searchQuery]);

    // Auto-focus if initialFocusSatuan is provided
    useEffect(() => {
        if (initialFocusSatuan) {
            const group = satuanGroups[initialFocusSatuan];
            if (group && group.coords) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setSelectedGroup(group);
            }
        }
    }, [initialFocusSatuan, satuanGroups]);

    // Handle Search auto-select
    useEffect(() => {
        if (searchQuery.length > 2) {
            const exactMatch = Object.values(satuanGroups).find((g: any) => g.name.toLowerCase() === searchQuery.toLowerCase()) as any;
            if (exactMatch && exactMatch.coords) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setSelectedGroup(exactMatch);
            }
        }
    }, [searchQuery, satuanGroups]);

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
                        onBlur={() => setTimeout(() => {}, 200)} // Allow click to register
                        className="w-full bg-slate-100 dark:bg-cighra-dark border border-slate-200 dark:border-slate-700 rounded-sm py-2 pl-10 pr-4 text-xs font-tactical tracking-widest focus:ring-1 focus:ring-cighra-gold outline-none uppercase transition-all"
                    />

                    {/* Search Results Dropdown */}
                    {searchQuery.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white dark:bg-cighra-dark border border-slate-200 dark:border-cighra-gold/30 shadow-[0_10px_40px_rgba(0,0,0,0.4)] z-[3000] mt-2 rounded-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                            {filteredSatuanGroups.length > 0 ? (
                                filteredSatuanGroups.map((group: any) => (
                                    <button
                                        key={group.name}
                                        onClick={() => {
                                            if (group.coords) {
                                                setSelectedGroup(group);
                                                setSearchQuery('');
                                            }
                                        }}
                                        className={`w-full text-left p-4 hover:bg-cighra-primary/10 dark:hover:bg-cighra-gold/10 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-all flex items-center justify-between ${!group.coords ? 'opacity-50 grayscale' : ''}`}
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[11px] font-bold font-tactical tracking-widest uppercase text-slate-800 dark:text-cighra-gold">{group.name}</span>
                                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tracking-tighter">OPERATIONAL ASSETS: {group.units.length} UNITS</span>
                                        </div>
                                        {!group.coords ? (
                                            <span className="text-[8px] font-mono text-red-500 bg-red-500/10 px-1 border border-red-500/20">NO COORDS</span>
                                        ) : (
                                            group.hasDamage && <AlertTriangle size={12} className="text-orange-500" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-xs font-mono text-slate-500 italic">
                                    DATA TIDAK DITEMUKAN
                                </div>
                            )}
                        </div>
                    )}
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
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                                                            <Target size={10} className="text-cighra-gold" /> {unit.jenis || 'DART'}
                                                        </span>
                                                    </div>
                                                    {hasCase ? (
                                                        <Badge variant="warning">RUSAK</Badge>
                                                    ) : (
                                                        <Badge variant="success">BEROPERASI</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 shrink-0">
                                    <div className="text-[11px] text-slate-500 font-mono text-center">
                                        COORD: {selectedGroup.coords[0].toFixed(4)}, {selectedGroup.coords[1].toFixed(4)}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col animate-in fade-in duration-300 min-h-0">
                                <h3 className="font-tactical font-bold text-sm tracking-widest uppercase border-b border-slate-200 dark:border-slate-700 pb-2 mb-3 shrink-0">RINGKASAN SATUAN</h3>
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 min-h-0">
                                    {filteredSatuanGroups.map((group: any) => (
                                        <div 
                                            key={group.name} 
                                            onClick={() => group.coords && setSelectedGroup(group)}
                                            className={`p-3 border rounded-sm transition-all ${group.coords ? 'cursor-pointer hover:shadow-md' : 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-cighra-dark/60 border-slate-300 dark:border-slate-600 border-dashed'} ${selectedGroup?.name === group.name ? 'ring-2 ring-cighra-gold shadow-lg transform scale-[1.02] z-10' : ''} ${group.hasDamage && group.coords ? 'bg-orange-500/5 border-orange-500/30 hover:border-orange-500/60' : (group.coords ? 'bg-slate-50 dark:bg-cighra-dark/30 border-slate-200 dark:border-slate-700 hover:border-cighra-gold/50' : '')}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold font-tactical tracking-wider truncate max-w-[120px] uppercase">{group.name}</span>
                                                {group.hasDamage ? <AlertTriangle size={14} className="text-orange-500" /> : <Shield size={14} className="text-green-500" />}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500 uppercase">{group.units.length} Unit</span>
                                                <span className={`text-xs font-bold ${!group.coords ? 'text-slate-400' : (group.hasDamage ? 'text-orange-500' : 'text-green-500')}`}>
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
                    <div className="absolute top-4 right-4 z-[1000] bg-cighra-dark/80 backdrop-blur-md border border-cighra-gold/30 p-2 rounded-sm text-xs font-mono text-cighra-gold uppercase tracking-widest pointer-events-none">
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
                        
                        {/* Interactive Geosearch */}
                        <MapSearchControl />

                        <MapController selectedCoords={selectedGroup?.coords || null} />

                        {Object.values(satuanGroups).map((group: any) => (
                            group.coords && (
                                <React.Fragment key={group.name}>
                                    <Marker 
                                        position={group.coords} 
                                        icon={createCustomIcon(group.hasDamage)}
                                        eventHandlers={{
                                            click: () => {
                                                setSelectedGroup(group);
                                            }
                                        }}
                                    >
                                        <Popup className="tactical-popup">
                                            <div className="p-1">
                                                <div className="font-tactical font-bold text-xs border-b border-slate-200 pb-1 mb-1 uppercase">{group.name}</div>
                                                <div className="text-xs font-mono">{group.units.length} UNIT BERTAHAN</div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                    {selectedGroup?.name === group.name && (
                                        <Circle 
                                            center={group.coords} 
                                            radius={5000} 
                                            pathOptions={{ 
                                                color: group.hasDamage ? '#f97316' : '#eab308', 
                                                fillColor: group.hasDamage ? '#f97316' : '#eab308',
                                                fillOpacity: 0.1,
                                                weight: 1,
                                                dashArray: '5, 5'
                                            }} 
                                        />
                                    )}
                                </React.Fragment>
                            )
                        ))}
                    </MapContainer>
                </div>
            </div>

        </div>
    );
};

export default MonitoringMap;

