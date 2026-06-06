export const CATEGORIAS_PRODUCTO = [
  { value: 'cpu', label: 'CPU' },
  { value: 'gpu', label: 'GPU' },
  { value: 'ram', label: 'RAM' },
  { value: 'motherboard', label: 'Motherboard' },
  { value: 'storage', label: 'Almacenamiento' },
  { value: 'psu', label: 'Fuente' },
  { value: 'case', label: 'Gabinete' },
  { value: 'cooling', label: 'Refrigeracion' },
  { value: 'celular', label: 'Celular' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'monitor', label: 'Monitor' },
  { value: 'periferico', label: 'Periferico' },
  { value: 'audio', label: 'Audio' },
  { value: 'redes', label: 'Redes' },
  { value: 'consola', label: 'Consola' },
  { value: 'smartwatch', label: 'Smartwatch' },
  { value: 'camara', label: 'Camara' },
  { value: 'drone', label: 'Drone' },
]

export const PRODUCT_SPEC_FIELDS = {
  cpu: [
    { name: 'socket', label: 'Socket', placeholder: 'AM5, LGA1700' },
    { name: 'nucleos', label: 'Nucleos', type: 'number', placeholder: '8' },
    { name: 'hilos', label: 'Hilos', type: 'number', placeholder: '16' },
    { name: 'velocidad', label: 'Velocidad', placeholder: '4.7GHz' },
    { name: 'tdp', label: 'TDP (W)', type: 'number', placeholder: '105' },
  ],
  gpu: [
    { name: 'vram', label: 'VRAM', placeholder: '12GB GDDR6' },
    { name: 'chipset', label: 'Chipset', placeholder: 'RTX 4070' },
    { name: 'potencia', label: 'Consumo (W)', type: 'number', placeholder: '200' },
    { name: 'conectores', label: 'Conectores', placeholder: 'HDMI, DisplayPort' },
  ],
  ram: [
    { name: 'capacidad', label: 'Capacidad', placeholder: '16GB' },
    { name: 'tipo', label: 'Tipo', placeholder: 'DDR4, DDR5' },
    { name: 'velocidad', label: 'Velocidad', placeholder: '3200MHz' },
    { name: 'latencia', label: 'Latencia', placeholder: 'CL16' },
  ],
  motherboard: [
    { name: 'socket', label: 'Socket', placeholder: 'AM5, LGA1700' },
    { name: 'chipset', label: 'Chipset', placeholder: 'B650, Z790' },
    { name: 'formatoRam', label: 'Tipo RAM', placeholder: 'DDR5' },
    { name: 'slotsRam', label: 'Slots RAM', type: 'number', placeholder: '4' },
    { name: 'formato', label: 'Formato', placeholder: 'ATX, Micro-ATX' },
  ],
  storage: [
    { name: 'capacidad', label: 'Capacidad', placeholder: '1TB' },
    { name: 'tipo', label: 'Tipo', placeholder: 'NVMe, SATA, HDD' },
    { name: 'velocidadLec', label: 'Lectura', placeholder: '3500 MB/s' },
    { name: 'velocidadEsc', label: 'Escritura', placeholder: '3000 MB/s' },
  ],
  psu: [
    { name: 'potencia', label: 'Potencia (W)', type: 'number', placeholder: '750' },
    { name: 'certificacion', label: 'Certificacion', placeholder: '80+ Gold' },
    { name: 'modular', label: 'Modular', type: 'boolean' },
  ],
  case: [
    { name: 'formato', label: 'Formato', placeholder: 'Mid tower' },
    { name: 'ventanas', label: 'Ventana lateral', type: 'boolean' },
    { name: 'bahias', label: 'Bahias', placeholder: '2x 2.5, 2x 3.5' },
    { name: 'fansIncluidos', label: 'Fans incluidos', type: 'number', placeholder: '3' },
  ],
  cooling: [
    { name: 'tipo', label: 'Tipo', placeholder: 'Air, Liquido AIO' },
    { name: 'tdpSoporte', label: 'TDP max (W)', type: 'number', placeholder: '250' },
    { name: 'tamanoRadiador', label: 'Radiador', placeholder: '240mm' },
  ],
  celular: [
    { name: 'modelo', label: 'Modelo', placeholder: 'Galaxy S24' },
    { name: 'pantalla', label: 'Pantalla', placeholder: '6.2 AMOLED 120Hz' },
    { name: 'resolucion', label: 'Resolucion', placeholder: '3120x1440' },
    { name: 'so', label: 'Sistema operativo', placeholder: 'Android 14' },
    { name: 'procesador', label: 'Procesador', placeholder: 'Snapdragon 8 Gen 3' },
    { name: 'ram', label: 'RAM', placeholder: '12GB' },
    { name: 'almacenamiento', label: 'Almacenamiento', placeholder: '256GB' },
    { name: 'camaraPrincipal', label: 'Camara principal', placeholder: '50MP triple' },
    { name: 'camaraFrontal', label: 'Camara frontal', placeholder: '12MP' },
    { name: 'bateria', label: 'Bateria', placeholder: '5000 mAh' },
    { name: 'tieneNfc', label: 'NFC', type: 'boolean' },
    { name: 'tiene5g', label: '5G', type: 'boolean' },
  ],
  laptop: [
    { name: 'procesador', label: 'Procesador', placeholder: 'Intel Core i7' },
    { name: 'ram', label: 'RAM', placeholder: '16GB DDR5' },
    { name: 'almacenamiento', label: 'Almacenamiento', placeholder: '1TB SSD' },
    { name: 'gpu', label: 'GPU', placeholder: 'RTX 4060' },
    { name: 'pantalla', label: 'Pantalla', placeholder: '15.6 FHD 144Hz' },
    { name: 'bateria', label: 'Bateria', placeholder: '70Wh' },
  ],
  tablet: [
    { name: 'pantalla', label: 'Pantalla', placeholder: '11 IPS' },
    { name: 'procesador', label: 'Procesador', placeholder: 'Apple M2' },
    { name: 'ram', label: 'RAM', placeholder: '8GB' },
    { name: 'almacenamiento', label: 'Almacenamiento', placeholder: '128GB' },
    { name: 'conectividad', label: 'Conectividad', placeholder: 'WiFi, LTE' },
  ],
  monitor: [
    { name: 'tamano', label: 'Tamano', placeholder: '27 pulgadas' },
    { name: 'resolucion', label: 'Resolucion', placeholder: '2560x1440' },
    { name: 'tasaRefresco', label: 'Refresco', placeholder: '144Hz' },
    { name: 'panel', label: 'Panel', placeholder: 'IPS, OLED' },
    { name: 'conectores', label: 'Conectores', placeholder: 'HDMI, DP, USB-C' },
  ],
  periferico: [
    { name: 'tipo', label: 'Tipo', placeholder: 'Teclado, mouse, webcam' },
    { name: 'conectividad', label: 'Conectividad', placeholder: 'USB, Bluetooth' },
    { name: 'compatibilidad', label: 'Compatibilidad', placeholder: 'Windows, macOS' },
  ],
  audio: [
    { name: 'tipo', label: 'Tipo', placeholder: 'Audifonos, parlante' },
    { name: 'conectividad', label: 'Conectividad', placeholder: 'Bluetooth 5.3' },
    { name: 'autonomia', label: 'Autonomia', placeholder: '30 horas' },
    { name: 'cancelacionRuido', label: 'Cancelacion ruido', type: 'boolean' },
  ],
  redes: [
    { name: 'tipo', label: 'Tipo', placeholder: 'Router, switch' },
    { name: 'estandar', label: 'Estandar', placeholder: 'WiFi 6, Gigabit' },
    { name: 'velocidad', label: 'Velocidad', placeholder: '3000 Mbps' },
    { name: 'puertos', label: 'Puertos', placeholder: '4 LAN, 1 WAN' },
  ],
  consola: [
    { name: 'almacenamiento', label: 'Almacenamiento', placeholder: '1TB' },
    { name: 'resolucion', label: 'Resolucion', placeholder: '4K' },
    { name: 'incluyeControles', label: 'Controles incluidos', type: 'number', placeholder: '1' },
    { name: 'edicion', label: 'Edicion', placeholder: 'Digital, Standard' },
  ],
  smartwatch: [
    { name: 'pantalla', label: 'Pantalla', placeholder: '1.9 AMOLED' },
    { name: 'bateria', label: 'Bateria', placeholder: '18 horas' },
    { name: 'sensores', label: 'Sensores', placeholder: 'SpO2, ECG, GPS' },
    { name: 'compatibilidad', label: 'Compatibilidad', placeholder: 'iOS, Android' },
  ],
  camara: [
    { name: 'sensor', label: 'Sensor', placeholder: '24MP APS-C' },
    { name: 'resolucionVideo', label: 'Video', placeholder: '4K 60fps' },
    { name: 'lente', label: 'Lente', placeholder: '18-55mm' },
    { name: 'conectividad', label: 'Conectividad', placeholder: 'WiFi, Bluetooth' },
  ],
  drone: [
    { name: 'resolucionVideo', label: 'Video', placeholder: '4K 60fps' },
    { name: 'autonomia', label: 'Autonomia', placeholder: '34 min' },
    { name: 'alcance', label: 'Alcance', placeholder: '10 km' },
    { name: 'sensores', label: 'Sensores', placeholder: 'Obstaculos, GPS' },
  ],
}

export function getCategoriaLabel(value) {
  return CATEGORIAS_PRODUCTO.find(c => c.value === value)?.label ?? value
}

export function getSpecFields(categoria) {
  return PRODUCT_SPEC_FIELDS[categoria] ?? []
}
