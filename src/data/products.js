// =============================================
// NEXUS — PRODUCTS DATA
// modelColor: color que se aplica dinámicamente al GLB
// modelMesh:  nombre del mesh dentro del GLB a colorear
// =============================================

export const PC_PARTS = {
  cpu: [
    {
      id: "cpu-1", nombre: "AMD Ryzen 5 5600X", precio: 180,
      socket: "AM4", nucleos: 6, hilos: 12, velocidad: "3.7GHz", tdp: 65, marca: "AMD",
      imagen: "https://m.media-amazon.com/images/I/61aT9w3l1xL.jpg",
      modelGlb: "cpu-amd", modelColor: "#ed1c24", modelMesh: "heatspreader",
    },
    {
      id: "cpu-2", nombre: "AMD Ryzen 7 5800X", precio: 260,
      socket: "AM4", nucleos: 8, hilos: 16, velocidad: "3.8GHz", tdp: 105, marca: "AMD",
      imagen: "https://m.media-amazon.com/images/I/61GpvoJxL5L.jpg",
      modelGlb: "cpu-amd", modelColor: "#cc0000", modelMesh: "heatspreader",
    },
    {
      id: "cpu-3", nombre: "Intel Core i5-12400F", precio: 190,
      socket: "LGA1700", nucleos: 6, hilos: 12, velocidad: "2.5GHz", tdp: 65, marca: "Intel",
      imagen: "https://m.media-amazon.com/images/I/51yRl+qb5hL.jpg",
      modelGlb: "cpu-amd", modelColor: "#0071c5", modelMesh: "heatspreader",
    },
    {
      id: "cpu-4", nombre: "Intel Core i7-12700K", precio: 340,
      socket: "LGA1700", nucleos: 12, hilos: 20, velocidad: "3.6GHz", tdp: 125, marca: "Intel",
      imagen: "https://m.media-amazon.com/images/I/61LxYdH1pJL.jpg",
      modelGlb: "cpu-amd", modelColor: "#004a99", modelMesh: "heatspreader",
    },
    {
      id: "cpu-5", nombre: "AMD Ryzen 9 7900X", precio: 420,
      socket: "AM5", nucleos: 12, hilos: 24, velocidad: "4.7GHz", tdp: 170, marca: "AMD",
      imagen: "https://m.media-amazon.com/images/I/71gB2iC9WEL.jpg",
      modelGlb: "cpu-amd", modelColor: "#ff6600", modelMesh: "heatspreader",
    },
  ],

  gpu: [
    {
      id: "gpu-1", nombre: "NVIDIA RTX 3060", precio: 320,
      vram: "12GB", potencia: 170, marca: "NVIDIA",
      imagen: "https://m.media-amazon.com/images/I/71P1M0mHt-L.jpg",
      modelGlb: "gpu-nvidia", modelMesh: "shroud",
    },
    {
      id: "gpu-2", nombre: "NVIDIA RTX 3070 Ti", precio: 520,
      vram: "8GB", potencia: 285, marca: "NVIDIA",
      imagen: "https://m.media-amazon.com/images/I/71dz9pQrL0L.jpg",
      modelGlb: "gpu-nvidia", modelColor: "#4a9900", modelMesh: "shroud",
    },
    {
      id: "gpu-3", nombre: "AMD RX 6700 XT", precio: 350,
      vram: "12GB", potencia: 230, marca: "AMD",
      imagen: "https://m.media-amazon.com/images/I/71cVHUSnKBL.jpg",
      modelGlb: "gpu-amd", modelColor: "#ed1c24", modelMesh: "shroud",
    },
    {
      id: "gpu-4", nombre: "NVIDIA RTX 4070", precio: 599,
      vram: "12GB", potencia: 200, marca: "NVIDIA",
      imagen: "https://m.media-amazon.com/images/I/71Q52U6HLPL.jpg",
      modelGlb: "gpu-nvidia", modelMesh: "shroud",
    },
    {
      id: "gpu-5", nombre: "AMD RX 7900 XT", precio: 850,
      vram: "20GB", potencia: 315, marca: "AMD",
      imagen: "https://m.media-amazon.com/images/I/81kqFpJ7t7L.jpg",
      modelGlb: "gpu-amd", modelColor: "#a38080", modelMesh: "shroud",
    },
  ],

  ram: [
    {
      id: "ram-1", nombre: "Corsair Vengeance 16GB DDR4", precio: 55,
      capacidad: "16GB", tipo: "DDR4", velocidad: "3200MHz",
      imagen: "https://m.media-amazon.com/images/I/71P7M7YnBXL.jpg",
      modelGlb: "ram-ddr4", modelColor: "#ffcc00", modelMesh: "heatsink",
    },
    {
      id: "ram-2", nombre: "G.Skill Ripjaws 32GB DDR4", precio: 95,
      capacidad: "32GB", tipo: "DDR4", velocidad: "3600MHz",
      imagen: "https://m.media-amazon.com/images/I/61l+NzO7FXL.jpg",
      modelGlb: "ram-ddr4", modelColor: "#cc0000", modelMesh: "LED_Strip",
    },
    {
      id: "ram-3", nombre: "Kingston Fury 16GB DDR5", precio: 90,
      capacidad: "16GB", tipo: "DDR5", velocidad: "5200MHz",
      imagen: "https://m.media-amazon.com/images/I/61QkRk2yR3L.jpg",
      modelGlb: "ram-kingston", modelColor: "#000000", modelMesh: "heatsink",
    },
    {
      id: "ram-4", nombre: "Corsair Dominator 32GB DDR5", precio: 160,
      capacidad: "32GB", tipo: "DDR5", velocidad: "6000MHz",
      imagen: "https://m.media-amazon.com/images/I/61pCqC8vqAL.jpg",
      modelGlb: "ram-ddr4", modelColor: "#ffffff", modelMesh: "heatsink",
    },
  ],

  motherboard: [
    {
      id: "mb-1", nombre: "ASUS B550-F Gaming", precio: 165,
      socket: "AM4", chipset: "B550", formatoRam: "DDR4", slotsRam: 4,
      imagen: "https://dlcdnwebimgs.asus.com/gain/4B1F2B3C/w800",
      modelGlb: "motherboard", modelColor: "#1a1a2e", modelMesh: "pcb",
    },
    {
      id: "mb-2", nombre: "MSI MAG B550 Tomahawk", precio: 140,
      socket: "AM4", chipset: "B550", formatoRam: "DDR4", slotsRam: 4,
      imagen: "https://asset.msi.com/resize/image/global/product/product_1596000929.png",
      modelGlb: "motherboard", modelColor: "#1a1a1a", modelMesh: "pcb",
    },
    {
      id: "mb-3", nombre: "Gigabyte Z690 Aorus Elite", precio: 210,
      socket: "LGA1700", chipset: "Z690", formatoRam: "DDR5", slotsRam: 4,
      imagen: "https://static.gigabyte.com/StaticFile/Image/Global/product/28935/png/1000",
      modelGlb: "motherboard", modelColor: "#0d1b2a", modelMesh: "pcb",
    },
    {
      id: "mb-4", nombre: "ASUS ROG Strix X570-E", precio: 280,
      socket: "AM4", chipset: "X570", formatoRam: "DDR4", slotsRam: 4,
      imagen: "https://dlcdnwebimgs.asus.com/gain/ROG-STRIX-X570-E/w800",
      modelGlb: "motherboard", modelColor: "#111111", modelMesh: "pcb",
    },
    {
      id: "mb-5", nombre: "MSI PRO Z790-A WiFi", precio: 190,
      socket: "LGA1700", chipset: "Z790", formatoRam: "DDR5", slotsRam: 4,
      imagen: "https://asset.msi.com/resize/image/global/product/product_z790.png",
      modelGlb: "motherboard", modelColor: "#162032", modelMesh: "pcb",
    },
  ],

  storage: [
    {
      id: "sto-1", nombre: "Samsung 970 EVO 500GB NVMe", precio: 75,
      capacidad: "500GB", tipo: "NVMe", velocidadLec: "3500 MB/s", marca: "Samsung",
      imagen: "https://image-us.samsung.com/SamsungUS/home/computing/memory-and-storage/mz-v7e500bw/gallery/01_SSD_970EVO_500GB.jpg",
      modelGlb: "storage-samsung", modelColor: "#1428a0", modelMesh: "label",
    },
    {
      id: "sto-2", nombre: "WD Blue SN570 1TB NVMe", precio: 80,
      capacidad: "1TB", tipo: "NVMe", velocidadLec: "3500 MB/s", marca: "WD",
      imagen: "https://shop.westerndigital.com/content/dam/store/en-us/assets/products/internal-flash-storage/wd-blue-sn570-nvme/gallery/wd-blue-sn570-nvme-ssd-1tb-front.png",
      modelGlb: "storage-samsung", modelColor: "#005eb8", modelMesh: "label",
    },
    {
      id: "sto-3", nombre: "Seagate Barracuda 2TB HDD", precio: 50,
      capacidad: "2TB", tipo: "HDD", velocidadLec: "210 MB/s", marca: "Seagate",
      imagen: "https://www.seagate.com/content/dam/seagate/migrated-assets/www-content/product-content/barracuda-fam/barracuda/en-us/images/barracuda-hard-drive-fam-top-image-web.png",
      modelGlb: "storage-samsung", modelColor: "#2d9e2d", modelMesh: "label",
    },
    {
      id: "sto-4", nombre: "Samsung 990 Pro 1TB NVMe", precio: 120,
      capacidad: "1TB", tipo: "NVMe", velocidadLec: "7450 MB/s", marca: "Samsung",
      imagen: "https://image-us.samsung.com/SamsungUS/home/computing/memory-and-storage/mz-v9p1t0b/gallery/990PRO_main_1T.jpg",
      modelGlb: "storage-samsung", modelColor: "#0a1464", modelMesh: "label",
    },
  ],

  psu: [
    {
      id: "psu-1", nombre: "Corsair CV550 550W Bronze", precio: 65,
      potencia: 550, certificacion: "80+ Bronze", modular: false,
      imagen: "https://m.media-amazon.com/images/I/71L+JqUzJ3L.jpg",
      modelGlb: "psu3", modelScale: 9.10, modelOffset: [0.1, 0, 0.2], modelRotation: [0,0,0], modelColor: "#ffcc00", modelMesh: "casing",
    },
    {
      id: "psu-2", nombre: "EVGA 650W Gold", precio: 90,
      potencia: 650, certificacion: "80+ Gold", modular: false,
      imagen: "https://m.media-amazon.com/images/I/71I5Q3HqJ5L.jpg",
      modelGlb: "psu4", modelScale: 1.12, modelOffset: [0, 0, 0], modelRotation: [0,0,0], modelColor: "#222222", modelMesh: "casing",
    },
    {
      id: "psu-3", nombre: "Seasonic Focus GX-750W Gold", precio: 120,
      potencia: 750, certificacion: "80+ Gold", modular: true,
      imagen: "https://m.media-amazon.com/images/I/71VQ5Q3qJ5L.jpg",
      modelGlb: "psu4", modelScale: 0.45, modelOffset: [0, 0, 0], modelRotation: [0,0,0], modelColor: "#1a1a1a", modelMesh: "casing",
    },
    {
      id: "psu-4", nombre: "Corsair RM850x 850W Gold", precio: 150,
      potencia: 850, certificacion: "80+ Gold", modular: true,
      imagen: "https://m.media-amazon.com/images/I/71Q5Q3qJ5L.jpg",
      modelGlb: "psu4", modelScale: 0.45, modelOffset: [0, 0, 0], modelRotation: [0,0,0], modelColor: "#ffcc00", modelMesh: "casing",
    },
  ],

  case: [
    {
      id: "case-1", nombre: "NZXT H510", precio: 70,
      formato: "mid-tower", ventanas: true,
      imagen: "https://m.media-amazon.com/images/I/71VQ5Q3qJ5L.jpg",
      modelColor: "#111111",
    },
    {
      id: "case-2", nombre: "Fractal Design Meshify C", precio: 90,
      formato: "mid-tower", ventanas: true,
      imagen: "https://m.media-amazon.com/images/I/71Q5Q3qJ5L.jpg",
      modelColor: "#ffffff",
    },
    {
      id: "case-3", nombre: "Phanteks Eclipse P360A", precio: 80,
      formato: "mid-tower", ventanas: true,
      imagen: "https://m.media-amazon.com/images/I/71VQ5Q3qJ5L.jpg",
      modelColor: "#222222",
    },
    {
      id: "case-4", nombre: "Lian Li O11 Dynamic EVO", precio: 150,
      formato: "full-tower", ventanas: true,
      imagen: "https://m.media-amazon.com/images/I/71Q5Q3qJ5L.jpg",
      modelColor: "#1a1a1a",
    },
  ],

  cooling: [
    {
      id: "cool-1", nombre: "Cooler Master Hyper 212", precio: 35,
      tipo: "Air", tdpSoporte: 150,
      imagen: "https://m.media-amazon.com/images/I/71VQ5Q3qJ5L.jpg",
      modelGlb: "cooler", modelColor: "#888888", modelMesh: "fan_ring",
    },
    {
      id: "cool-2", nombre: "be quiet! Dark Rock 4", precio: 75,
      tipo: "Air", tdpSoporte: 200,
      imagen: "https://m.media-amazon.com/images/I/71Q5Q3qJ5L.jpg",
      modelGlb: "cooler", modelColor: "#111111", modelMesh: "fan_ring",
    },
    {
      id: "cool-3", nombre: "Corsair H100i Elite 240mm", precio: 130,
      tipo: "Líquido AIO", tdpSoporte: 250,
      imagen: "https://m.media-amazon.com/images/I/71VQ5Q3qJ5L.jpg",
      modelGlb: "cooler", modelColor: "#ffcc00", modelMesh: "fan_ring",
    },
    {
      id: "cool-4", nombre: "NZXT Kraken X63 280mm", precio: 160,
      tipo: "Líquido AIO", tdpSoporte: 300,
      imagen: "https://m.media-amazon.com/images/I/71Q5Q3qJ5L.jpg",
      modelGlb: "cooler", modelColor: "#cc0000", modelMesh: "fan_ring",
    },
  ],
}
