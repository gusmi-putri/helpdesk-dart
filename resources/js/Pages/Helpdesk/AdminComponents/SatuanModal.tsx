import React from 'react';
import { MapPin, Building2, Save } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { INDONESIA_BOUNDS } from './MapCoordinates';

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

const MapClickHandler = ({ onLocationSelected }: { onLocationSelected: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click(e) {
            onLocationSelected(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const MapSearchControl = ({ onLocationSelected }: { onLocationSelected?: (lat: number, lng: number, label?: string) => void }) => {
    const map = useMap();
    React.useEffect(() => {
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

interface SatuanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  data: any;
  setData: (field: string, value: any) => void;
  errors: any;
  processing: boolean;
  isAddMode: boolean;
  isPengajuan?: boolean;
  submitDisabled?: boolean;
}

const SatuanModal: React.FC<SatuanModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  data,
  setData,
  errors,
  processing,
  isAddMode,
  isPengajuan,
  submitDisabled
}) => {
  if (!isOpen) return null;

  const lat = parseFloat(data.latitude);
  const lng = parseFloat(data.longitude);
  const hasValidCoords = !isNaN(lat) && !isNaN(lng);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isPengajuan ? (isAddMode ? 'PENGAJUAN TAMBAH SATUAN' : 'PENGAJUAN EDIT SATUAN') : (isAddMode ? 'TAMBAH DATA SATUAN' : 'EDIT DATA SATUAN')}
      icon={<Building2 />}
      maxWidth="2xl"
      headerColor="primary"
      footer={
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex gap-4">
            <Button 
              type="submit" 
              onClick={onSubmit}
              variant="primary" 
              disabled={processing || submitDisabled || !hasValidCoords}
              className="flex-[2] uppercase" 
              size="lg"
            >
              {processing ? 'MEMPROSES...' : isPengajuan ? 'AJUKAN DATA' : (
                <>
                  <Save className="w-5 h-5" /> SIMPAN DATA SATUAN
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose} 
              className="flex-1 uppercase" 
              size="lg"
            >
              BATAL
            </Button>
          </div>
          {!hasValidCoords && (
            <p className="text-red-500 text-[10px] font-mono text-center tracking-widest mt-1 uppercase italic">
              * WAJIB MENANDAI KOORDINAT LOKASI PADA PETA SEBELUM MENYIMPAN.
            </p>
          )}
        </div>
      }
    >
      <form id="satuan-form" onSubmit={onSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Form Fields */}
          <div className="col-span-2">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">
              Nama SATUAN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.nama_satuan}
              onChange={(e) => setData('nama_satuan', e.target.value.toUpperCase())}
              placeholder="CTH: SATBRIMOB POLDA JABAR"
              className="w-full bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-700 p-2 text-sm font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none uppercase"
            />
            {errors.nama_satuan && <p className="text-red-500 text-[11px] mt-1 font-mono uppercase">{errors.nama_satuan}</p>}
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">
              Kode Satuan
            </label>
            <input
              type="text"
              value={data.kode_satuan}
              onChange={(e) => setData('kode_satuan', e.target.value.toUpperCase())}
              placeholder="CTH: SBRM-01"
              className="w-full bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-700 p-2 text-sm font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none uppercase"
            />
            {errors.kode_satuan && <p className="text-red-500 text-[11px] mt-1 font-mono uppercase">{errors.kode_satuan}</p>}
          </div>

          <div className="col-span-2 space-y-3">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 tracking-widest uppercase flex justify-between items-center">
              <span>Pilih Koordinat Pada Peta</span>
              <span className="text-[10px] text-slate-400 normal-case italic">Klik area peta untuk menandai lokasi</span>
            </label>
            <div className="h-[250px] w-full rounded border border-gray-400 dark:border-slate-700 overflow-hidden relative z-0">
               <MapContainer 
                  center={hasValidCoords ? [lat, lng] : [-2.5489, 118.0149]}
                  zoom={hasValidCoords ? 14 : 4}
                  style={{ height: '100%', width: '100%' }}
                  maxBounds={INDONESIA_BOUNDS}
                  maxBoundsViscosity={1.0}
                  minZoom={4}
               >
                  <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  <MapSearchControl onLocationSelected={(lat, lng, label) => {
                      setData('latitude', lat.toFixed(6));
                      setData('longitude', lng.toFixed(6));
                      if (label) {
                          setData('alamat', label);
                      }
                  }} />
                  <MapClickHandler onLocationSelected={(lat, lng) => {
                      setData('latitude', lat.toFixed(6));
                      setData('longitude', lng.toFixed(6));
                  }} />
                  {hasValidCoords && (
                      <Marker position={[lat, lng]} />
                  )}
               </MapContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">
                  Latitude
                </label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={data.latitude || ''}
                    onChange={(e) => setData('latitude', e.target.value)}
                    placeholder="-6.123456"
                    className="w-full pl-8 pr-2 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 text-xs font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none"
                  />
                </div>
                {errors.latitude && <p className="text-red-500 text-[11px] mt-1 font-mono uppercase">{errors.latitude}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">
                  Longitude
                </label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={data.longitude || ''}
                    onChange={(e) => setData('longitude', e.target.value)}
                    placeholder="106.123456"
                    className="w-full pl-8 pr-2 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 text-xs font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none"
                  />
                </div>
                {errors.longitude && <p className="text-red-500 text-[11px] mt-1 font-mono uppercase">{errors.longitude}</p>}
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">
              Alamat Lengkap
            </label>
            <textarea
              value={data.alamat || ''}
              onChange={(e) => setData('alamat', e.target.value)}
              placeholder="Alamat Lengkap Satuan..."
              rows={2}
              className="w-full bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-700 p-2 text-sm focus:border-cighra-primary dark:focus:border-cighra-gold outline-none"
            />
            {errors.alamat && <p className="text-red-500 text-[11px] mt-1 font-mono uppercase">{errors.alamat}</p>}
          </div>

          <div className="col-span-2">
            {isPengajuan ? (
              <div className="bg-yellow-500/10 p-4 border-l-4 border-yellow-500">
                <p className="text-xs text-yellow-600 dark:text-yellow-400 font-mono leading-relaxed">
                  <span className="font-bold uppercase tracking-widest block mb-1">PEMBERITAHUAN:</span> 
                  Data SATUAN yang Anda buat akan masuk sebagai pengajuan dan menunggu persetujuan Admin.
                </p>
              </div>
            ) : (
              <div className="bg-blue-500/10 p-4 border-l-4 border-blue-500">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono leading-relaxed">
                  <span className="font-bold uppercase tracking-widest block mb-1">INFO VERIFIKASI:</span> 
                  Menyimpan kordinat (latitude & longitude) akan secara otomatis memverifikasi SATUAN ini.
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default SatuanModal;

