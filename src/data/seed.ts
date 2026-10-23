import type { Monitor, Review, Service, Video, WeeklyAvailability } from '../types'

/**
 * DATOS DE DEMOSTRACIÓN — todo lo de este archivo es ficticio.
 * Personas, valoraciones, vídeos y horarios no corresponden a profesionales reales.
 * Sustituir por datos de backend (ver services/api.ts) y mantener separado de usuarios y reservas reales.
 *
 * Vídeos: `Video.src` apunta a clips de ejemplo públicos (gtv-videos-bucket de Google). Son vídeos reales
 * pero NO son de deporte: sirven de relleno. Cambia `src` por tu mp4 vertical 9:16 o súbelos desde
 * «Perfil → Mi perfil de monitor». Si un vídeo no carga, el feed muestra la ilustración de sustitución.
 */

export const MONITORS: Monitor[] = [
  {
    "id": "m-elena",
    "name": "Elena Vidal",
    "sport": "Esquí",
    "tagline": "Mejora tu técnica de esquí desde cero",
    "specialties": [
      "Técnica de giro",
      "Esquí infantil",
      "Fuera de pista básico"
    ],
    "bio": "Instructora de esquí con enfoque en la técnica y la seguridad. Me gusta que cada alumno termine el día sabiendo qué corregir.",
    "location": "Baqueira, Lleida",
    "city": "Lleida",
    "languages": [
      "Español",
      "Catalán",
      "Inglés"
    ],
    "levelsTaught": [
      "Principiante",
      "Intermedio"
    ],
    "yearsExperience": 9,
    "credentials": [
      "Titulación de ejemplo (dato ficticio)"
    ],
    "fromPrice": 45,
    "verified": false,
    "isDemo": true,
    "accent": "#4cc9f0",
    "createdAt": "2026-01-15"
  },
  {
    "id": "m-diego",
    "name": "Diego Ferrer",
    "sport": "Snowboard",
    "tagline": "Domina el freestyle sin miedo a caerte",
    "specialties": [
      "Freestyle",
      "Carving",
      "Snowpark"
    ],
    "bio": "Rider y coach de freestyle. Trabajamos progresión por pasos: del carving limpio al primer salto.",
    "location": "Sierra Nevada, Granada",
    "city": "Granada",
    "languages": [
      "Español",
      "Inglés"
    ],
    "levelsTaught": [
      "Intermedio",
      "Avanzado"
    ],
    "yearsExperience": 7,
    "credentials": [
      "Titulación de ejemplo (dato ficticio)"
    ],
    "fromPrice": 50,
    "verified": false,
    "isDemo": true,
    "accent": "#a78bfa",
    "createdAt": "2026-01-15"
  },
  {
    "id": "m-marco",
    "name": "Marco Salinas",
    "sport": "Surf",
    "tagline": "Tu primera ola en una sola sesión",
    "specialties": [
      "Iniciación",
      "Lectura del mar",
      "Longboard"
    ],
    "bio": "Surfista local y monitor de iniciación. Aprenderás a leer el mar y a levantarte con confianza.",
    "location": "Sopelana, Bizkaia",
    "city": "Bizkaia",
    "languages": [
      "Español",
      "Euskera",
      "Inglés"
    ],
    "levelsTaught": [
      "Principiante",
      "Intermedio"
    ],
    "yearsExperience": 11,
    "credentials": [
      "Titulación de ejemplo (dato ficticio)"
    ],
    "fromPrice": 40,
    "verified": false,
    "isDemo": true,
    "accent": "#22d3ee",
    "createdAt": "2026-01-15"
  },
  {
    "id": "m-laura",
    "name": "Laura Quintana",
    "sport": "Tenis",
    "tagline": "Saca con confianza y gana puntos",
    "specialties": [
      "Saque",
      "Revés a dos manos",
      "Competición juvenil"
    ],
    "bio": "Entrenadora con años de experiencia en categorías base y adultos. Sesiones técnicas y partidos guiados.",
    "location": "Chamartín, Madrid",
    "city": "Madrid",
    "languages": [
      "Español",
      "Inglés",
      "Francés"
    ],
    "levelsTaught": [
      "Principiante",
      "Intermedio",
      "Avanzado"
    ],
    "yearsExperience": 12,
    "credentials": [
      "Titulación de ejemplo (dato ficticio)"
    ],
    "fromPrice": 38,
    "verified": false,
    "isDemo": true,
    "accent": "#a3e635",
    "createdAt": "2026-01-15"
  },
  {
    "id": "m-pablo",
    "name": "Pablo Mendoza",
    "sport": "Pádel",
    "tagline": "Más control en la pared y mejor bandeja",
    "specialties": [
      "Bandeja y víbora",
      "Táctica de parejas",
      "Iniciación"
    ],
    "bio": "Entrenador centrado en táctica y golpes de pared. Vídeo-análisis de tus errores más comunes.",
    "location": "Poblenou, Barcelona",
    "city": "Barcelona",
    "languages": [
      "Español",
      "Catalán"
    ],
    "levelsTaught": [
      "Principiante",
      "Intermedio",
      "Avanzado"
    ],
    "yearsExperience": 8,
    "credentials": [
      "Titulación de ejemplo (dato ficticio)"
    ],
    "fromPrice": 32,
    "verified": false,
    "isDemo": true,
    "accent": "#fb923c",
    "createdAt": "2026-01-15"
  },
  {
    "id": "m-irene",
    "name": "Irene Casas",
    "sport": "Natación",
    "tagline": "Nada más rápido gastando menos energía",
    "specialties": [
      "Crol y espalda",
      "Aguas abiertas",
      "Pérdida del miedo al agua"
    ],
    "bio": "Monitor de natación para adultos y jóvenes. Corrección de brazada y respiración paso a paso.",
    "location": "Ruzafa, Valencia",
    "city": "Valencia",
    "languages": [
      "Español",
      "Valenciano",
      "Inglés"
    ],
    "levelsTaught": [
      "Principiante",
      "Intermedio"
    ],
    "yearsExperience": 10,
    "credentials": [
      "Titulación de ejemplo (dato ficticio)"
    ],
    "fromPrice": 30,
    "verified": false,
    "isDemo": true,
    "accent": "#38bdf8",
    "createdAt": "2026-01-15"
  },
  {
    "id": "m-raul",
    "name": "Raúl Ortega",
    "sport": "Fútbol",
    "tagline": "Entrena como un profesional, juega como tú",
    "specialties": [
      "Técnica individual",
      "Porteros",
      "Preparación física"
    ],
    "bio": "Entrenador de fútbol base y adultos. Ejercicios técnicos con balón y trabajo de coordinación.",
    "location": "Nervión, Sevilla",
    "city": "Sevilla",
    "languages": [
      "Español"
    ],
    "levelsTaught": [
      "Principiante",
      "Intermedio",
      "Avanzado"
    ],
    "yearsExperience": 14,
    "credentials": [
      "Titulación de ejemplo (dato ficticio)"
    ],
    "fromPrice": 28,
    "verified": false,
    "isDemo": true,
    "accent": "#4ade80",
    "createdAt": "2026-01-15"
  },
  {
    "id": "m-sofia",
    "name": "Sofía Navarro",
    "sport": "Ciclismo",
    "tagline": "Sube puertos sin sufrir y disfruta la ruta",
    "specialties": [
      "Ascensos",
      "Plan de entrenamiento",
      "Ruta de grupo"
    ],
    "bio": "Entrenadora de ciclismo de carretera. Planificación, técnica en subida y salidas guiadas.",
    "location": "Sierra de Madrid",
    "city": "Madrid",
    "languages": [
      "Español",
      "Inglés"
    ],
    "levelsTaught": [
      "Principiante",
      "Intermedio",
      "Avanzado"
    ],
    "yearsExperience": 6,
    "credentials": [
      "Titulación de ejemplo (dato ficticio)"
    ],
    "fromPrice": 35,
    "verified": false,
    "isDemo": true,
    "accent": "#f472b6",
    "createdAt": "2026-01-15"
  }
]

export const SERVICES: Service[] = [
  {
    "id": "m-elena-s1",
    "monitorId": "m-elena",
    "name": "Clase de iniciación",
    "description": "Primeros giros y control de velocidad.",
    "durationMin": 60,
    "price": 45,
    "modality": "Presencial",
    "level": "Principiante",
    "status": "active"
  },
  {
    "id": "m-elena-s2",
    "monitorId": "m-elena",
    "name": "Perfeccionamiento de técnica",
    "description": "Mejora giros cortos y largos.",
    "durationMin": 120,
    "price": 80,
    "modality": "Presencial",
    "level": "Intermedio",
    "status": "active"
  },
  {
    "id": "m-elena-s3",
    "monitorId": "m-elena",
    "name": "Clase grupal (hasta 4)",
    "description": "Ideal para amigos o familia.",
    "durationMin": 120,
    "price": 120,
    "modality": "Grupal",
    "level": "Todos",
    "status": "active"
  },
  {
    "id": "m-diego-s1",
    "monitorId": "m-diego",
    "name": "Carving esencial",
    "description": "Bordes limpios y control.",
    "durationMin": 90,
    "price": 60,
    "modality": "Presencial",
    "level": "Intermedio",
    "status": "active"
  },
  {
    "id": "m-diego-s2",
    "monitorId": "m-diego",
    "name": "Primer salto en snowpark",
    "description": "Progresión segura a módulos.",
    "durationMin": 120,
    "price": 95,
    "modality": "Presencial",
    "level": "Avanzado",
    "status": "active"
  },
  {
    "id": "m-diego-s3",
    "monitorId": "m-diego",
    "name": "Análisis en vídeo online",
    "description": "Revisamos tus clips y plan.",
    "durationMin": 45,
    "price": 25,
    "modality": "Online",
    "level": "Todos",
    "status": "active"
  },
  {
    "id": "m-marco-s1",
    "monitorId": "m-marco",
    "name": "Primera ola",
    "description": "Seguridad, remada y levantarse.",
    "durationMin": 90,
    "price": 40,
    "modality": "Presencial",
    "level": "Principiante",
    "status": "active"
  },
  {
    "id": "m-marco-s2",
    "monitorId": "m-marco",
    "name": "Mejora en pico",
    "description": "Elección de ola y giros.",
    "durationMin": 90,
    "price": 55,
    "modality": "Presencial",
    "level": "Intermedio",
    "status": "active"
  },
  {
    "id": "m-marco-s3",
    "monitorId": "m-marco",
    "name": "Sesión grupal de iniciación",
    "description": "Hasta 5 personas.",
    "durationMin": 120,
    "price": 100,
    "modality": "Grupal",
    "level": "Principiante",
    "status": "active"
  },
  {
    "id": "m-laura-s1",
    "monitorId": "m-laura",
    "name": "Clase individual",
    "description": "Trabajo técnico personalizado.",
    "durationMin": 60,
    "price": 38,
    "modality": "Presencial",
    "level": "Todos",
    "status": "active"
  },
  {
    "id": "m-laura-s2",
    "monitorId": "m-laura",
    "name": "Saque y revés",
    "description": "Sesión monográfica.",
    "durationMin": 90,
    "price": 52,
    "modality": "Presencial",
    "level": "Intermedio",
    "status": "active"
  },
  {
    "id": "m-laura-s3",
    "monitorId": "m-laura",
    "name": "Partido guiado",
    "description": "Juego con correcciones.",
    "durationMin": 60,
    "price": 45,
    "modality": "Presencial",
    "level": "Avanzado",
    "status": "active"
  },
  {
    "id": "m-pablo-s1",
    "monitorId": "m-pablo",
    "name": "Clase individual",
    "description": "Golpes y posición en pista.",
    "durationMin": 60,
    "price": 32,
    "modality": "Presencial",
    "level": "Todos",
    "status": "active"
  },
  {
    "id": "m-pablo-s2",
    "monitorId": "m-pablo",
    "name": "Clase de pareja",
    "description": "Táctica de pareja.",
    "durationMin": 60,
    "price": 48,
    "modality": "Grupal",
    "level": "Intermedio",
    "status": "active"
  },
  {
    "id": "m-pablo-s3",
    "monitorId": "m-pablo",
    "name": "Vídeo-análisis online",
    "description": "Revisión de partido grabado.",
    "durationMin": 45,
    "price": 22,
    "modality": "Online",
    "level": "Todos",
    "status": "active"
  },
  {
    "id": "m-irene-s1",
    "monitorId": "m-irene",
    "name": "Pérdida del miedo al agua",
    "description": "Confianza y flotación.",
    "durationMin": 45,
    "price": 30,
    "modality": "Presencial",
    "level": "Principiante",
    "status": "active"
  },
  {
    "id": "m-irene-s2",
    "monitorId": "m-irene",
    "name": "Técnica de crol",
    "description": "Brazada y respiración.",
    "durationMin": 60,
    "price": 36,
    "modality": "Presencial",
    "level": "Intermedio",
    "status": "active"
  },
  {
    "id": "m-irene-s3",
    "monitorId": "m-irene",
    "name": "Aguas abiertas",
    "description": "Salida guiada con seguridad.",
    "durationMin": 90,
    "price": 50,
    "modality": "Presencial",
    "level": "Intermedio",
    "status": "active"
  },
  {
    "id": "m-raul-s1",
    "monitorId": "m-raul",
    "name": "Técnica individual",
    "description": "Control, pase y conducción.",
    "durationMin": 60,
    "price": 28,
    "modality": "Presencial",
    "level": "Todos",
    "status": "active"
  },
  {
    "id": "m-raul-s2",
    "monitorId": "m-raul",
    "name": "Entrenamiento de porteros",
    "description": "Posición y blocaje.",
    "durationMin": 60,
    "price": 32,
    "modality": "Presencial",
    "level": "Intermedio",
    "status": "active"
  },
  {
    "id": "m-raul-s3",
    "monitorId": "m-raul",
    "name": "Sesión de pequeños grupos",
    "description": "Hasta 6 jugadores.",
    "durationMin": 90,
    "price": 60,
    "modality": "Grupal",
    "level": "Todos",
    "status": "active"
  },
  {
    "id": "m-sofia-s1",
    "monitorId": "m-sofia",
    "name": "Plan y valoración",
    "description": "Objetivos y ritmos.",
    "durationMin": 60,
    "price": 35,
    "modality": "Online",
    "level": "Todos",
    "status": "active"
  },
  {
    "id": "m-sofia-s2",
    "monitorId": "m-sofia",
    "name": "Salida técnica de ascensos",
    "description": "Postura, cadencia y marchas.",
    "durationMin": 150,
    "price": 65,
    "modality": "Presencial",
    "level": "Intermedio",
    "status": "active"
  },
  {
    "id": "m-sofia-s3",
    "monitorId": "m-sofia",
    "name": "Ruta guiada en grupo",
    "description": "Hasta 6 ciclistas.",
    "durationMin": 180,
    "price": 90,
    "modality": "Grupal",
    "level": "Todos",
    "status": "active"
  }
]

export const VIDEOS: Video[] = [
  {
    "id": "v-m-elena-1",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "monitorId": "m-elena",
    "caption": "3 claves para empezar a esquiar sin miedo",
    "sport": "Esquí",
    "publishedAt": "2026-03-10",
    "status": "published",
    "likes": 120,
    "isDemo": true
  },
  {
    "id": "v-m-elena-2",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "monitorId": "m-elena",
    "caption": "Sesión de esquí: ejercicio clave",
    "sport": "Esquí",
    "publishedAt": "2026-04-01",
    "status": "published",
    "likes": 60,
    "isDemo": true
  },
  {
    "id": "v-m-diego-1",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "monitorId": "m-diego",
    "caption": "Del carving al primer 180",
    "sport": "Snowboard",
    "publishedAt": "2026-04-11",
    "status": "published",
    "likes": 157,
    "isDemo": true
  },
  {
    "id": "v-m-diego-2",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "monitorId": "m-diego",
    "caption": "Sesión de snowboard: ejercicio clave",
    "sport": "Snowboard",
    "publishedAt": "2026-05-02",
    "status": "published",
    "likes": 79,
    "isDemo": true
  },
  {
    "id": "v-m-marco-1",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "monitorId": "m-marco",
    "caption": "Cómo levantarte en la tabla a la primera",
    "sport": "Surf",
    "publishedAt": "2026-05-12",
    "status": "published",
    "likes": 194,
    "isDemo": true
  },
  {
    "id": "v-m-marco-2",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "monitorId": "m-marco",
    "caption": "Sesión de surf: ejercicio clave",
    "sport": "Surf",
    "publishedAt": "2026-06-03",
    "status": "published",
    "likes": 98,
    "isDemo": true
  },
  {
    "id": "v-m-laura-1",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "monitorId": "m-laura",
    "caption": "El saque que cambia tu partido",
    "sport": "Tenis",
    "publishedAt": "2026-06-13",
    "status": "published",
    "likes": 231,
    "isDemo": true
  },
  {
    "id": "v-m-laura-2",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "monitorId": "m-laura",
    "caption": "Sesión de tenis: ejercicio clave",
    "sport": "Tenis",
    "publishedAt": "2026-07-04",
    "status": "published",
    "likes": 117,
    "isDemo": true
  },
  {
    "id": "v-m-pablo-1",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "monitorId": "m-pablo",
    "caption": "La bandeja perfecta, paso a paso",
    "sport": "Pádel",
    "publishedAt": "2026-07-14",
    "status": "published",
    "likes": 268,
    "isDemo": true
  },
  {
    "id": "v-m-pablo-2",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "monitorId": "m-pablo",
    "caption": "Sesión de pádel: ejercicio clave",
    "sport": "Pádel",
    "publishedAt": "2026-08-05",
    "status": "published",
    "likes": 136,
    "isDemo": true
  },
  {
    "id": "v-m-irene-1",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "monitorId": "m-irene",
    "caption": "Respira bien y nada sin cansarte",
    "sport": "Natación",
    "publishedAt": "2026-08-15",
    "status": "published",
    "likes": 305,
    "isDemo": true
  },
  {
    "id": "v-m-irene-2",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "monitorId": "m-irene",
    "caption": "Sesión de natación: ejercicio clave",
    "sport": "Natación",
    "publishedAt": "2026-04-06",
    "status": "published",
    "likes": 155,
    "isDemo": true
  },
  {
    "id": "v-m-raul-1",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "monitorId": "m-raul",
    "caption": "Control orientado: el ejercicio de 5 minutos",
    "sport": "Fútbol",
    "publishedAt": "2026-03-16",
    "status": "published",
    "likes": 342,
    "isDemo": true
  },
  {
    "id": "v-m-raul-2",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "monitorId": "m-raul",
    "caption": "Sesión de fútbol: ejercicio clave",
    "sport": "Fútbol",
    "publishedAt": "2026-05-07",
    "status": "published",
    "likes": 174,
    "isDemo": true
  },
  {
    "id": "v-m-sofia-1",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "monitorId": "m-sofia",
    "caption": "Cadencia y marchas en subida",
    "sport": "Ciclismo",
    "publishedAt": "2026-04-17",
    "status": "published",
    "likes": 379,
    "isDemo": true
  },
  {
    "id": "v-m-sofia-2",
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "monitorId": "m-sofia",
    "caption": "Sesión de ciclismo: ejercicio clave",
    "sport": "Ciclismo",
    "publishedAt": "2026-06-08",
    "status": "published",
    "likes": 193,
    "isDemo": true
  }
]

export const REVIEWS: Review[] = [
  {
    "id": "r-m-elena-1",
    "monitorId": "m-elena",
    "userAlias": "Ana",
    "rating": 4,
    "comment": "Muy clara explicando y con mucha paciencia.",
    "date": "2026-05-10",
    "isDemo": true
  },
  {
    "id": "r-m-elena-2",
    "monitorId": "m-elena",
    "userAlias": "Carlos",
    "rating": 4,
    "comment": "Buena sesión, salí con ejercicios para practicar.",
    "date": "2026-06-11",
    "isDemo": true
  },
  {
    "id": "r-m-elena-3",
    "monitorId": "m-elena",
    "userAlias": "Lucía",
    "rating": 5,
    "comment": "Superó mis expectativas, repetiré.",
    "date": "2026-07-12",
    "isDemo": true
  },
  {
    "id": "r-m-diego-1",
    "monitorId": "m-diego",
    "userAlias": "Carlos",
    "rating": 4,
    "comment": "Buena sesión, salí con ejercicios para practicar.",
    "date": "2026-05-11",
    "isDemo": true
  },
  {
    "id": "r-m-diego-2",
    "monitorId": "m-diego",
    "userAlias": "Lucía",
    "rating": 5,
    "comment": "Superó mis expectativas, repetiré.",
    "date": "2026-06-12",
    "isDemo": true
  },
  {
    "id": "r-m-diego-3",
    "monitorId": "m-diego",
    "userAlias": "Javi",
    "rating": 4,
    "comment": "Correcto, aunque me hubiera gustado más tiempo.",
    "date": "2026-07-13",
    "isDemo": true
  },
  {
    "id": "r-m-marco-1",
    "monitorId": "m-marco",
    "userAlias": "Lucía",
    "rating": 5,
    "comment": "Superó mis expectativas, repetiré.",
    "date": "2026-05-12",
    "isDemo": true
  },
  {
    "id": "r-m-marco-2",
    "monitorId": "m-marco",
    "userAlias": "Javi",
    "rating": 4,
    "comment": "Correcto, aunque me hubiera gustado más tiempo.",
    "date": "2026-06-13",
    "isDemo": true
  },
  {
    "id": "r-m-marco-3",
    "monitorId": "m-marco",
    "userAlias": "Marta",
    "rating": 4,
    "comment": "Aprendí más en una hora que en meses solo.",
    "date": "2026-07-14",
    "isDemo": true
  },
  {
    "id": "r-m-laura-1",
    "monitorId": "m-laura",
    "userAlias": "Javi",
    "rating": 4,
    "comment": "Correcto, aunque me hubiera gustado más tiempo.",
    "date": "2026-05-13",
    "isDemo": true
  },
  {
    "id": "r-m-laura-2",
    "monitorId": "m-laura",
    "userAlias": "Marta",
    "rating": 4,
    "comment": "Aprendí más en una hora que en meses solo.",
    "date": "2026-06-14",
    "isDemo": true
  },
  {
    "id": "r-m-laura-3",
    "monitorId": "m-laura",
    "userAlias": "Ana",
    "rating": 5,
    "comment": "Muy clara explicando y con mucha paciencia.",
    "date": "2026-07-15",
    "isDemo": true
  },
  {
    "id": "r-m-pablo-1",
    "monitorId": "m-pablo",
    "userAlias": "Marta",
    "rating": 4,
    "comment": "Aprendí más en una hora que en meses solo.",
    "date": "2026-05-14",
    "isDemo": true
  },
  {
    "id": "r-m-pablo-2",
    "monitorId": "m-pablo",
    "userAlias": "Ana",
    "rating": 5,
    "comment": "Muy clara explicando y con mucha paciencia.",
    "date": "2026-06-15",
    "isDemo": true
  },
  {
    "id": "r-m-pablo-3",
    "monitorId": "m-pablo",
    "userAlias": "Carlos",
    "rating": 4,
    "comment": "Buena sesión, salí con ejercicios para practicar.",
    "date": "2026-07-16",
    "isDemo": true
  },
  {
    "id": "r-m-irene-1",
    "monitorId": "m-irene",
    "userAlias": "Ana",
    "rating": 5,
    "comment": "Muy clara explicando y con mucha paciencia.",
    "date": "2026-05-15",
    "isDemo": true
  },
  {
    "id": "r-m-irene-2",
    "monitorId": "m-irene",
    "userAlias": "Carlos",
    "rating": 4,
    "comment": "Buena sesión, salí con ejercicios para practicar.",
    "date": "2026-06-16",
    "isDemo": true
  },
  {
    "id": "r-m-irene-3",
    "monitorId": "m-irene",
    "userAlias": "Lucía",
    "rating": 5,
    "comment": "Superó mis expectativas, repetiré.",
    "date": "2026-07-17",
    "isDemo": true
  },
  {
    "id": "r-m-raul-1",
    "monitorId": "m-raul",
    "userAlias": "Carlos",
    "rating": 4,
    "comment": "Buena sesión, salí con ejercicios para practicar.",
    "date": "2026-05-16",
    "isDemo": true
  },
  {
    "id": "r-m-raul-2",
    "monitorId": "m-raul",
    "userAlias": "Lucía",
    "rating": 5,
    "comment": "Superó mis expectativas, repetiré.",
    "date": "2026-06-17",
    "isDemo": true
  },
  {
    "id": "r-m-raul-3",
    "monitorId": "m-raul",
    "userAlias": "Javi",
    "rating": 4,
    "comment": "Correcto, aunque me hubiera gustado más tiempo.",
    "date": "2026-07-18",
    "isDemo": true
  },
  {
    "id": "r-m-sofia-1",
    "monitorId": "m-sofia",
    "userAlias": "Lucía",
    "rating": 5,
    "comment": "Superó mis expectativas, repetiré.",
    "date": "2026-05-17",
    "isDemo": true
  },
  {
    "id": "r-m-sofia-2",
    "monitorId": "m-sofia",
    "userAlias": "Javi",
    "rating": 4,
    "comment": "Correcto, aunque me hubiera gustado más tiempo.",
    "date": "2026-06-18",
    "isDemo": true
  },
  {
    "id": "r-m-sofia-3",
    "monitorId": "m-sofia",
    "userAlias": "Marta",
    "rating": 5,
    "comment": "Aprendí más en una hora que en meses solo.",
    "date": "2026-07-19",
    "isDemo": true
  }
]

export const AVAILABILITY: WeeklyAvailability[] = [
  {
    "monitorId": "m-elena",
    "days": {
      "1": [
        "09:00",
        "10:00",
        "17:00",
        "18:00"
      ],
      "3": [
        "09:00",
        "10:00",
        "17:00"
      ],
      "6": [
        "10:00",
        "11:00",
        "12:00"
      ]
    }
  },
  {
    "monitorId": "m-diego",
    "days": {
      "2": [
        "10:00",
        "11:00",
        "16:00"
      ],
      "4": [
        "10:00",
        "11:00",
        "16:00",
        "17:00"
      ],
      "6": [
        "09:00",
        "10:00",
        "11:00"
      ],
      "7": [
        "10:00",
        "11:00"
      ]
    }
  },
  {
    "monitorId": "m-marco",
    "days": {
      "1": [
        "08:00",
        "09:00"
      ],
      "2": [
        "08:00",
        "09:00"
      ],
      "5": [
        "08:00",
        "09:00",
        "10:00"
      ],
      "6": [
        "08:00",
        "09:00",
        "10:00",
        "11:00"
      ],
      "7": [
        "08:00",
        "09:00",
        "10:00"
      ]
    }
  },
  {
    "monitorId": "m-laura",
    "days": {
      "1": [
        "17:00",
        "18:00",
        "19:00"
      ],
      "2": [
        "17:00",
        "18:00",
        "19:00"
      ],
      "4": [
        "17:00",
        "18:00"
      ],
      "6": [
        "09:00",
        "10:00",
        "11:00"
      ]
    }
  },
  {
    "monitorId": "m-pablo",
    "days": {
      "3": [
        "18:00",
        "19:00",
        "20:00"
      ],
      "5": [
        "18:00",
        "19:00",
        "20:00"
      ],
      "6": [
        "10:00",
        "11:00",
        "12:00",
        "13:00"
      ]
    }
  },
  {
    "monitorId": "m-irene",
    "days": {
      "1": [
        "07:00",
        "08:00",
        "19:00"
      ],
      "3": [
        "07:00",
        "08:00",
        "19:00"
      ],
      "5": [
        "07:00",
        "08:00",
        "19:00"
      ]
    }
  },
  {
    "monitorId": "m-raul",
    "days": {
      "2": [
        "17:00",
        "18:00"
      ],
      "4": [
        "17:00",
        "18:00",
        "19:00"
      ],
      "6": [
        "10:00",
        "11:00",
        "12:00"
      ],
      "7": [
        "10:00",
        "11:00"
      ]
    }
  },
  {
    "monitorId": "m-sofia",
    "days": {
      "6": [
        "08:00",
        "09:00",
        "10:00"
      ],
      "7": [
        "08:00",
        "09:00",
        "10:00"
      ],
      "3": [
        "18:00",
        "19:00"
      ]
    }
  }
]
