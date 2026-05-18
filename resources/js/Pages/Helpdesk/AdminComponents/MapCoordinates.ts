export const SATUAN_COORDINATES: Record<string, [number, number]> = {
    // KOSTRAD
    'MAKOSTRAD': [-6.1738, 106.8286],
    'DIVISI INFANTERI 1 KOSTRAD': [-6.4385, 106.8458],
    'DIVIF 1 KOSTRAD': [-6.4385, 106.8458],
    'DIVISI INFANTERI 2 KOSTRAD': [-7.8761, 112.6687],
    'DIVIF 2 KOSTRAD': [-7.8761, 112.6687],
    'DIVISI INFANTERI 3 KOSTRAD': [-5.2285, 119.5168],
    'DIVIF 3 KOSTRAD': [-5.2285, 119.5168],

    // KOPASSUS
    'MAKO KOPASSUS': [-6.3168, 106.8596],
    'GRUP 1 KOPASSUS': [-6.1037, 106.1158],
    'GRUP 2 KOPASSUS': [-7.5489, 110.7410],
    'PUSDIKLATPASSUS': [-6.9248, 107.4912],

    // MARINIR & TNI AL
    'MAKO KORPS MARINIR': [-6.1779, 106.8378],
    'MAKO MARINIR': [-6.1779, 106.8378],
    'PASMAR 1': [-6.1039, 106.9455],
    'PASMAR 2': [-7.3916, 112.7246],
    'PASMAR 3': [-0.8931, 131.3129],
    'LANTAMAL III': [-6.1305, 106.8267],
    'LANTAMAL V': [-7.2023, 112.7381],

    // KOPASGAT & TNI AU
    'MAKO KOPASGAT': [-6.9749, 107.5448],
    'LANUD HALIM': [-6.2655, 106.8856],
    'LANUD HALIM PERDANAKUSUMA': [-6.2655, 106.8856],
    'LANUD ISWAHJUDI': [-7.6163, 111.4361],
    'LANUD ROESMIN NURJADIN': [-0.4608, 101.4475],
    'LANUD ROESMIN': [-0.4608, 101.4475],
    'LANUD SULTAN HASANUDDIN': [-5.0616, 119.5540],
    'LANUD HASANUDDIN': [-5.0616, 119.5540],
    'LANUD SUPADIO': [-0.1448, 109.4042],

    // DEFAULT KODAM
    'BENGPUSKOMLEKAD': [-6.2088, 106.8456], // Jakarta
    'PUSKOMLEKAD': [-6.2088, 106.8456], // Jakarta
    'KODAM JAYA': [-6.255, 106.877], // Jakarta East
    'KODAM III/SILIWANGI': [-6.9147, 107.6098], // Bandung
    'KODAM III': [-6.9147, 107.6098], 
    'KODAM IV/DIPONEGORO': [-7.048, 110.409], // Semarang
    'KODAM IV': [-7.048, 110.409], 
    'KODAM V/BRAWIJAYA': [-7.289, 112.721], // Surabaya
    'KODAM V': [-7.289, 112.721],
    'KODAM I/BUKIT BARISAN': [3.595, 98.672], // Medan
    'KODAM I': [3.595, 98.672], 
    'KODAM XIV/HASANUDDIN': [-5.147, 119.432], // Makassar
    'KODAM XIV': [-5.147, 119.432], 
    'KODAM XVII/CENDERAWASIH': [-2.591, 140.669], // Jayapura
    'KODAM XVII': [-2.591, 140.669], 
    'KODAM VI/MULAWARMAN': [-1.242, 116.852], // Balikpapan
    'KODAM VI': [-1.242, 116.852], 
    'KODAM IX/UDAYANA': [-8.670, 115.212], // Denpasar
    'KODAM IX': [-8.670, 115.212], 

    // KOTA-KOTA UMUM (FALLBACK)
    'JAKARTA': [-6.2088, 106.8456],
    'BANDUNG': [-6.9147, 107.6098],
    'SEMARANG': [-7.048, 110.409],
    'SURABAYA': [-7.289, 112.721],
    'MEDAN': [3.595, 98.672],
    'MAKASSAR': [-5.147, 119.432],
    'JAYAPURA': [-2.591, 140.669],
    'BALIKPAPAN': [-1.242, 116.852],
    'DENPASAR': [-8.670, 115.212],
    'BOGOR': [-6.5950, 106.8166],
    'DEPOK': [-6.4025, 106.7942],
    'TANGERANG': [-6.1702, 106.6403],
    'BEKASI': [-6.2383, 106.9756],

    // DUMMY DATA FROM SEEDER (Untuk Demo Map agar tidak menumpuk)
    'SEKTOR UTARA': [3.5852, 108.6270], // Natuna / Tarakan area
    'SEKTOR SELATAN': [-8.7990, 115.1610], // Bali / Nusa Tenggara area
    'SEKTOR TIMUR': [-2.591, 140.669], // Jayapura / Papua
    'SEKTOR BARAT': [3.595, 98.672], // Medan / Sumatra
    'POS KOMANDO PUSAT': [-6.1738, 106.8286], // Makostrad Jakarta
    'SATUAN RADAR': [-6.1039, 106.9455], // Area Utara Jakarta
    'SATUAN RADAR 211': [-6.1039, 106.9455],
    
    // DEFAULT TENGAH INDONESIA
    'DEFAULT': [-2.5489, 118.0149]
};

export const INDONESIA_BOUNDS: L.LatLngBoundsExpression = [
    [-11.0, 95.0], // Southwest
    [6.0, 141.0]   // Northeast
];

export const getCoordinatesForSatuan = (satuan: string): [number, number] => {
    const upper = satuan.toUpperCase();
    
    // Exact match first
    if (SATUAN_COORDINATES[upper]) {
        return SATUAN_COORDINATES[upper];
    }
    
    // Substring match
    for (const [key, coords] of Object.entries(SATUAN_COORDINATES)) {
        if (key !== 'DEFAULT' && (upper.includes(key) || key.includes(upper))) {
            return coords;
        }
    }
    
    // Add small random offset so default markers don't completely overlap
    const base = SATUAN_COORDINATES['DEFAULT'];
    const offsetLat = (Math.random() - 0.5) * 2.0; 
    const offsetLng = (Math.random() - 0.5) * 2.0;
    return [base[0] + offsetLat, base[1] + offsetLng];
};
