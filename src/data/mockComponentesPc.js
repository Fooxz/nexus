// =============================================
// NEXUS — PRODUCTS DATA
// modelColor: color que se aplica dinámicamente al GLB
// modelMesh:  nombre del mesh dentro del GLB a colorear
// caseConfigId: clave en caseConfigs.js que usa este gabinete
//
// STORAGE — todos usan storage-samsung.glb (SSD SATA 2.5")
// tipo: "SATA" → va en bahía del chasis (caseConfigs.storageSata)
// tipo: "NVMe" → iría en ranura M.2 de la board (boardGeometry.m2)
// Como el GLB es un SSD SATA, todos se dejan como SATA.
// Cuando tengas un GLB de M.2, agrega productos con tipo: "NVMe"
// =============================================

export const PC_PARTS = {
  cpu: [
    {
      id: "cpu-1", nombre: "AMD Ryzen 5 5600X", precio: 738000,
      socket: "AM4", nucleos: 6, hilos: 12, velocidad: "3.7GHz", tdp: 65, marca: "AMD",
      imagen: "https://m.media-amazon.com/images/I/61aT9w3l1xL.jpg",
      modelGlb: "cpu-amd", modelMesh: "heatspreader",
    },
    {
      id: "cpu-2", nombre: "AMD Ryzen 7 5800X", precio: 1066000,
      socket: "AM4", nucleos: 8, hilos: 16, velocidad: "3.8GHz", tdp: 105, marca: "AMD",
      imagen: "https://m.media-amazon.com/images/I/61GpvoJxL5L.jpg",
      modelGlb: "cpu-amd", modelMesh: "heatspreader",
    },
    {
      id: "cpu-3", nombre: "Intel Core i5-12400F", precio: 779000,
      socket: "LGA1700", nucleos: 6, hilos: 12, velocidad: "2.5GHz", tdp: 65, marca: "Intel",
      imagen: "https://m.media-amazon.com/images/I/51yRl+qb5hL.jpg",
      modelGlb: "cpu-amd", modelMesh: "heatspreader",
    },
    {
      id: "cpu-4", nombre: "Intel Core i7-12700K", precio: 1394000,
      socket: "LGA1700", nucleos: 12, hilos: 20, velocidad: "3.6GHz", tdp: 125, marca: "Intel",
      imagen: "https://m.media-amazon.com/images/I/61LxYdH1pJL.jpg",
      modelGlb: "cpu-amd", modelMesh: "heatspreader",
    },
    {
      id: "cpu-5", nombre: "AMD Ryzen 9 7900X", precio: 1722000,
      socket: "AM5", nucleos: 12, hilos: 24, velocidad: "4.7GHz", tdp: 170, marca: "AMD",
      imagen: "https://m.media-amazon.com/images/I/71gB2iC9WEL.jpg",
      modelGlb: "cpu-amd", modelMesh: "heatspreader",
    },
    {
      id: "cpu-6", nombre: "Intel Core i5-10400F", precio: 620000,
      socket: "LGA1200", nucleos: 6, hilos: 12, velocidad: "2.9GHz", tdp: 65, marca: "Intel",
      imagen: "https://m.media-amazon.com/images/I/61oV7qXBiHL.jpg",
      modelGlb: "cpu-amd", modelMesh: "heatspreader",
    },
    {
      id: "cpu-7", nombre: "Intel Core i7-10700K", precio: 950000,
      socket: "LGA1200", nucleos: 8, hilos: 16, velocidad: "3.8GHz", tdp: 125, marca: "Intel",
      imagen: "https://m.media-amazon.com/images/I/61C8pL3c3ML.jpg",
      modelGlb: "cpu-amd", modelMesh: "heatspreader",
    },
  ],

  gpu: [
    {
      id: "gpu-1", nombre: "NVIDIA RTX 3060", precio: 1312000,
      vram: "12GB", potencia: 170, marca: "NVIDIA",
      imagen: "https://m.media-amazon.com/images/I/71P1M0mHt-L.jpg",
      modelGlb: "gpu-nvidia", modelMesh: "shroud",
    },
    {
      id: "gpu-2", nombre: "NVIDIA RTX 3070 Ti", precio: 2132000,
      vram: "8GB", potencia: 285, marca: "NVIDIA",
      imagen: "https://m.media-amazon.com/images/I/71dz9pQrL0L.jpg",
      modelGlb: "gpu-nvidia", modelColor: "#4a9900", modelMesh: "shroud",
    },
    {
  id: "gpu-3", nombre: "AMD RX 6700 XT", precio: 1435000,
  vram: "12GB", potencia: 230, marca: "AMD",
  imagen: "https://m.media-amazon.com/images/I/71cVHUSnKBL.jpg",
  modelGlb: "gpu-amd", modelColor: "#ed1c24", modelMesh: "shroud",
  modelScale: 10.9, modelOffset: [-0.01, -0.259, 1.5], modelRotation: [Math.PI/2, 0, Math.PI],
},
    {
      id: "gpu-4", nombre: "NVIDIA RTX 4070", precio: 2455900,
      vram: "12GB", potencia: 200, marca: "NVIDIA",
      imagen: "https://m.media-amazon.com/images/I/71Q52U6HLPL.jpg",
      modelGlb: "gpu-nvidia", modelMesh: "shroud",
    },
    {
  id: "gpu-5", nombre: "AMD RX 7900 XT", precio: 3485000,
  vram: "20GB", potencia: 315, marca: "AMD",
  imagen: "https://m.media-amazon.com/images/I/81kqFpJ7t7L.jpg",
  modelGlb: "gpu-amd", modelColor: "#a38080", modelMesh: "shroud",
  modelScale: 10.9, modelOffset: [-0.01, -0.259, 1.5], modelRotation: [Math.PI/2, 0, Math.PI],
},
  ],

  ram: [
    {
      id: "ram-1", nombre: "Corsair Vengeance 16GB DDR4", precio: 225500,
      capacidad: "16GB", tipo: "DDR4", velocidad: "3200MHz",
      imagen: "https://m.media-amazon.com/images/I/71P7M7YnBXL.jpg",
      modelGlb: "ram-ddr4", modelColor: "#ffcc00", modelMesh: "heatsink",
    },
    {
      id: "ram-2", nombre: "G.Skill Ripjaws 32GB DDR4", precio: 389500,
      capacidad: "32GB", tipo: "DDR4", velocidad: "3600MHz",
      imagen: "https://m.media-amazon.com/images/I/61l+NzO7FXL.jpg",
      modelGlb: "ram-ddr4", modelColor: "#cc0000", modelMesh: "LED_Strip",
    },
    {
      id: "ram-3", nombre: "Kingston Fury 16GB DDR5", precio: 369000,
      capacidad: "16GB", tipo: "DDR5", velocidad: "5200MHz",
      imagen: "https://m.media-amazon.com/images/I/61QkRk2yR3L.jpg",
      modelGlb: "ram-kingston", modelColor: "#000000", modelMesh: "heatsink",
    },
    {
      id: "ram-4", nombre: "Corsair Dominator 32GB DDR5", precio: 656000,
      capacidad: "32GB", tipo: "DDR5", velocidad: "6000MHz",
      imagen: "https://m.media-amazon.com/images/I/61pCqC8vqAL.jpg",
      modelGlb: "ram-ddr4", modelColor: "#ffffff", modelMesh: "heatsink",
    },
  ],

  motherboard: [
    {
      id: "mb-1", nombre: "ASUS Prime H510M-K", precio: 450000,
      socket: "LGA1200", chipset: "H510", formatoRam: "DDR4", slotsRam: 2,
      imagen: "...",
      modelGlb: "motherboard", modelMesh: "pcb",
    },
    {
      id: "mb-2", nombre: "ASUS ROG Strix B550-F", precio: 676500,
      socket: "AM4", chipset: "B550", formatoRam: "DDR4", slotsRam: 4,
      imagen: "...",
      modelGlb: "motherboard-b550f", modelMesh: "pcb",
    },
    {
      id: "mb-3", nombre: "ASUS TUF Gaming B660M", precio: 750000,
      socket: "LGA1700", chipset: "B660", formatoRam: "DDR4", slotsRam: 4,
      imagen: "...",
      modelGlb: "motherboard-b660m", modelMesh: "pcb",
    },
  ],

  storage: [
    {
      id: "sto-1", nombre: "Samsung 970 EVO 500GB", precio: 307500,
      capacidad: "500GB", tipo: "SATA", velocidadLec: "3500 MB/s", marca: "Samsung",
      imagen: "https://image-us.samsung.com/SamsungUS/home/computing/memory-and-storage/mz-v7e500bw/gallery/01_SSD_970EVO_500GB.jpg",
      modelGlb: "storage-samsung", modelColor: "#1428a0", modelMesh: "label",
    },
    {
      id: "sto-2", nombre: "WD Blue SN570 1TB", precio: 328000,
      capacidad: "1TB", tipo: "SATA", velocidadLec: "3500 MB/s", marca: "WD",
      imagen: "https://shop.westerndigital.com/content/dam/store/en-us/assets/products/internal-flash-storage/wd-blue-sn570-nvme/gallery/wd-blue-sn570-nvme-ssd-1tb-front.png",
      modelGlb: "storage-samsung", modelColor: "#005eb8", modelMesh: "label",
    },
    {
      id: "sto-3", nombre: "Seagate Barracuda 2TB HDD", precio: 205000,
      capacidad: "2TB", tipo: "HDD", velocidadLec: "210 MB/s", marca: "Seagate",
      imagen: "https://www.seagate.com/content/dam/seagate/migrated-assets/www-content/product-content/barracuda-fam/barracuda/en-us/images/barracuda-hard-drive-fam-top-image-web.png",
      modelGlb: "storage-samsung", modelColor: "#2d9e2d", modelMesh: "label",
    },
    {
      id: "sto-4", nombre: "Samsung 990 Pro 1TB", precio: 492000,
      capacidad: "1TB", tipo: "SATA", velocidadLec: "7450 MB/s", marca: "Samsung",
      imagen: "https://image-us.samsung.com/SamsungUS/home/computing/memory-and-storage/mz-v9p1t0b/gallery/990PRO_main_1T.jpg",
      modelGlb: "storage-samsung", modelColor: "#0a1464", modelMesh: "label",
    },
  ],

  psu: [
    {
      id: "psu-1", nombre: "Corsair CV550 550W Bronze", precio: 266500,
      potencia: 550, certificacion: "80+ Bronze", modular: false,
      imagen: "https://m.media-amazon.com/images/I/71L+JqUzJ3L.jpg",
      modelGlb: "psu3", modelScale: 9.10, modelOffset: [0.1, 0, 0.2], modelRotation: [0,0,0], modelColor: "#ffcc00", modelMesh: "casing",
    },
    {
      id: "psu-2", nombre: "EVGA 650W Gold", precio: 369000,
      potencia: 650, certificacion: "80+ Gold", modular: false,
      imagen: "https://m.media-amazon.com/images/I/71I5Q3HqJ5L.jpg",
      modelGlb: "psu4", modelScale: 1.12, modelOffset: [0, 0, 0], modelRotation: [0,0,0], modelColor: "#222222", modelMesh: "casing",
    },
    {
      id: "psu-3", nombre: "Seasonic Focus GX-750W Gold", precio: 492000,
      potencia: 750, certificacion: "80+ Gold", modular: true,
      imagen: "https://m.media-amazon.com/images/I/71VQ5Q3qJ5L.jpg",
      modelGlb: "psu4", modelScale: 0.45, modelOffset: [0, 0, 0], modelRotation: [0,0,0], modelColor: "#1a1a1a", modelMesh: "casing",
    },
    {
      id: "psu-4", nombre: "Corsair RM850x 850W Gold", precio: 615000,
      potencia: 850, certificacion: "80+ Gold", modular: true,
      imagen: "https://m.media-amazon.com/images/I/71Q5Q3qJ5L.jpg",
      modelGlb: "psu4", modelScale: 0.45, modelOffset: [0, 0, 0], modelRotation: [0,0,0], modelColor: "#ffcc00", modelMesh: "casing",
    },
  ],

  case: [
    {
      id: "case-1", nombre: "NZXT H510", precio: 287000,
      formato: "mid-tower", ventanas: true,
      imagen: "",
      caseConfigId: "mid-tower",
      modelGlb: "case",
      modelColor: "#ffffff",
    },
    {
      id: "case-gamer", nombre: "Nightshark RGB", precio: 850000,
      formato: "mid-tower", ventanas: true,
      imagen: "",
      caseConfigId: "case-gamer",
      modelGlb: "case-gamer",
      modelColor: "#111111",
    },
    {
      id: "case-pro", nombre: "Lian Li O11 Dynamic EVO", precio: 615000,
      formato: "mid-tower", ventanas: true,
      imagen: "",
      caseConfigId: "case-pro",
      modelGlb: "case-pro",
      modelColor: "#ffffff",
    },
  ],

  cooling: [
    {
      id: "cool-1", nombre: "Cooler Master Hyper 212", precio: 143500,
      tipo: "Air", tdpSoporte: 150,
      imagen: "https://m.media-amazon.com/images/I/71VQ5Q3qJ5L.jpg",
      modelGlb: "cooler", modelColor: "#888888", modelMesh: "fan_ring",
    },
    {
      id: "cool-2", nombre: "be quiet! Dark Rock 4", precio: 307500,
      tipo: "Air", tdpSoporte: 200,
      imagen: "https://m.media-amazon.com/images/I/71Q5Q3qJ5L.jpg",
      modelGlb: "cooler", modelColor: "#111111", modelMesh: "fan_ring",
    },
    {
      id: "cool-3", nombre: "Corsair H100i Elite 240mm", precio: 533000,
      tipo: "Líquido AIO", tdpSoporte: 250,
      imagen: "https://m.media-amazon.com/images/I/71VQ5Q3qJ5L.jpg",
      modelGlb: "cooler", modelColor: "#ffcc00", modelMesh: "fan_ring",
    },
    {
      id: "cool-4", nombre: "NZXT Kraken X63 280mm", precio: 656000,
      tipo: "Líquido AIO", tdpSoporte: 300,
      imagen: "https://m.media-amazon.com/images/I/71Q5Q3qJ5L.jpg",
      modelGlb: "cooler", modelColor: "#cc0000", modelMesh: "fan_ring",
    },
    ,
  ],
}