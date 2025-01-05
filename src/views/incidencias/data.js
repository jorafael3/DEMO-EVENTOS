const eventosData = [
    {
        id: 1,
        nombre: "Expo Cartimex 2025",
        fecha: "2025-03-10",
        lugar: "Centro de Convenciones",
        descripcion: "Un evento empresarial para conectar negocios.",
        imagenMapa: "https://feriadelbaulcci.wordpress.com/wp-content/uploads/2011/04/plano-feria-olivos-cubierto-12.jpg", // Ruta de la imagen del mapa
        ubicaciones: [
            { id: "A1", nombre: "Stand A1", precio: "$200", estado: "Disponible", x: 50, y: 100 },
            { id: "A2", nombre: "Stand A2", precio: "$250", estado: "Reservado", x: 150, y: 100 },
        ],
    },
    {
        id: 2,
        nombre: "Tech Innovate 2025",
        fecha: "2025-04-20",
        lugar: "Parque Tecnológico",
        descripcion: "Descubre las últimas innovaciones tecnológicas.",
        imagenMapa: "/path/to/mapa_tech_innovate.png", // Ruta de la imagen del mapa
        ubicaciones: [
            { id: "B1", nombre: "Mesa B1", precio: "$150", estado: "Disponible", x: 80, y: 120 },
            { id: "B2", nombre: "Mesa B2", precio: "$150", estado: "Disponible", x: 200, y: 120 },
        ],
    },
];

export default eventosData;
