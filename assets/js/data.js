// Config centralizzata
export const CONFIG = {
  PDF_NAME: "Tesi Di Liberti.pdf",                     // PDF tesi
    UPLOAD_LINK: "https://drive.google.com/drive/folders/1NWpm1EhBsw4P7qQxCAZiKlNBi9RuDfMN?usp=sharing",
    PHOTOS_API: "https://script.google.com/macros/s/AKfycbxZJfiSS2ghKGbKVZPMQZs7uRul36NOddrH7Q5vqs3bV8eDPzsW7Bs-q0Ou1as3RqGl9w/exec",
    PHOTOS_LIMIT: 40,
  
  COUPON_PDF: "assets/coupon/coupon.pdf",              // PDF del coupon (metti il tuo file)
  GALLERY: ["photos/foto1.jpg","photos/foto2.jpg","photos/foto3.jpg"],
  CHATGPT_GALLERY: ["assets/img/birra.png","assets/img/mare.png","assets/img/pub.png", "assets/img/studio.png"],
};

// Più spicchi (macro-temi)
export const SEGMENTS = [
  { label: "Informatica",    topic: "informatica" },
  { label: "Scout",          topic: "scout" },
  { label: "Cibo",           topic: "cibo" },
  { label: "Bevande",        topic: "beverage" },
  { label: "Cultura",        topic: "cultura" },
  { label: "Geografia",      topic: "geografia" },
  { label: "Storia",         topic: "storia" },
  { label: "Matematica",     topic: "matematica" },
  { label: "Tecnologia",     topic: "tecnologia" },
];

// Domande per tema (4 opzioni ciascuna)
export const QUIZ = {
  informatica: [
    {
      q: "Complessità temporale della ricerca binaria su array ordinato:",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correctIndex: 1
    },
    {
      q: "HTTPS usa di default la porta:",
      options: ["21", "25", "80", "443"],
      correctIndex: 3
    },
    {
      q: "Cosa indica l'errore HTTP 404?",
      options: ["Server non disponibile", "Risorsa non trovata", "Accesso negato", "Richiesta non valida"],
      correctIndex: 1
    },
    {
      q: "Quale comando Git unisce le modifiche di un branch nell'altro?",
      options: ["git clone", "git merge", "git stash", "git clean"],
      correctIndex: 1
    },
    {
      q: "La RAM è una memoria:",
      options: ["Non volatile", "Volatile", "Di massa", "Ottica"],
      correctIndex: 1
    }
  ],

  scout: [
    {
      q: "Il motto scout ‘Estote parati’ significa:",
      options: ["Siate pronti", "Sempre avanti", "Non mollare mai", "Insieme si vince"],
      correctIndex: 0
    },
    {
      q: "Il fondatore dello scautismo è:",
      options: ["Ernest Shackleton", "Robert Baden-Powell", "David Livingstone", "Tenzing Norgay"],
      correctIndex: 1
    },
    {
      q: "Nodo usato per unire due corde dello stesso diametro:",
      options: ["Nodo parlato", "Nodo piano", "Gassa d'amante", "Nodo savoia"],
      correctIndex: 1
    },
    {
      q: "Strumento base per orientarsi:",
      options: ["Altimetro", "Bussola", "Goniometro", "Livella"],
      correctIndex: 1
    }
  ],

  cibo: [
    {
      q: "La carbonara tradizionale NON prevede:",
      options: ["Guanciale", "Pecorino", "Panna", "Uova"],
      correctIndex: 2
    },
    {
      q: "Ingrediente principale del tiramisù:",
      options: ["Ricotta", "Mascarpone", "Philadelphia", "Panna"],
      correctIndex: 1
    },
    {
      q: "L'erba aromatica del pesto alla genovese:",
      options: ["Prezzemolo", "Basilico", "Origano", "Salvia"],
      correctIndex: 1
    },
    {
      q: "Il formaggio tipico dell'Amatriciana:",
      options: ["Pecorino", "Parmigiano", "Grana", "Caciocavallo"],
      correctIndex: 0
    },
    {
      q: "Una cottura perfetta del risotto richiede:",
      options: ["Lessatura", "Bollitura", "Mantecatura", "Frittura"],
      correctIndex: 2
    }
  ],

  beverage: [
    {
      q: "Ingredienti classici del Negroni:",
      options: ["Gin, Vermouth rosso, Bitter", "Vodka, Triple sec, Lime", "Rum, Menta, Soda", "Tequila, Lime, Sale"],
      correctIndex: 0
    },
    {
      q: "Uno Spritz ‘classico’ include:",
      options: ["Prosecco, Aperol, Soda", "Prosecco, Gin, Tonic", "Birra, Ginger, Lime", "Vino, Soda, Limone"],
      correctIndex: 0
    },
    {
      q: "Il Mojito contiene tradizionalmente:",
      options: ["Tequila e sale", "Rum bianco, menta, lime", "Whisky e angostura", "Vodka e pomodoro"],
      correctIndex: 1
    },
    {
      q: "Una IPA è una birra nota per:",
      options: ["Bassa luppolatura", "Alta luppolatura e amarezza", "Assenza di schiuma", "Aromi di cacao"],
      correctIndex: 1
    },
    {
      q: "Un espresso ‘standard’ si estrae in circa:",
      options: ["5–10 secondi", "25–30 secondi", "60 secondi", "90 secondi"],
      correctIndex: 1
    }
  ],

  cultura: [
    {
      q: "Chi ha dipinto la ‘Gioconda’?",
      options: ["Raffaello", "Leonardo da Vinci", "Michelangelo", "Caravaggio"],
      correctIndex: 1
    },
    {
      q: "Autore della ‘Divina Commedia’:",
      options: ["Dante Alighieri", "Boccaccio", "Petrarca", "Manzoni"],
      correctIndex: 0
    },
    {
      q: "Primo uomo sulla Luna (anno):",
      options: ["1961", "1965", "1969", "1972"],
      correctIndex: 2
    },
    {
      q: "Lingua ufficiale del Brasile:",
      options: ["Spagnolo", "Portoghese", "Francese", "Inglese"],
      correctIndex: 1
    }
  ],

  geografia: [
    {
      q: "Capitale del Canada:",
      options: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
      correctIndex: 3
    },
    {
      q: "Il fiume più lungo d'Italia:",
      options: ["Arno", "Tevere", "Po", "Adige"],
      correctIndex: 2
    },
    {
      q: "La montagna più alta del mondo:",
      options: ["K2", "Everest", "Kangchenjunga", "Denali"],
      correctIndex: 1
    },
    {
      q: "Il continente con più Stati sovrani:",
      options: ["Asia", "Africa", "Europa", "America"],
      correctIndex: 1
    },
    {
      q: "Il deserto del Sahara si trova in:",
      options: ["Sud America", "Africa", "Asia", "Australia"],
      correctIndex: 1
    }
  ],

  storia: [
    {
      q: "L’Impero Romano d’Occidente cadde nel:",
      options: ["476 d.C.", "410 d.C.", "1453 d.C.", "1066 d.C."],
      correctIndex: 0
    },
    {
      q: "Inizio della Rivoluzione Francese:",
      options: ["1776", "1789", "1804", "1815"],
      correctIndex: 1
    },
    {
      q: "Cristoforo Colombo raggiunge l’America:",
      options: ["1453", "1492", "1517", "1607"],
      correctIndex: 1
    },
    {
      q: "Proclamazione del Regno d’Italia:",
      options: ["1848", "1861", "1870", "1918"],
      correctIndex: 1
    }
  ],

  matematica: [
    {
      q: "Derivata di sin(x):",
      options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
      correctIndex: 0
    },
    {
      q: "Area del cerchio di raggio r:",
      options: ["2πr", "πr²", "πr", "2r"],
      correctIndex: 1
    },
    {
      q: "Il primo numero primo è:",
      options: ["1", "2", "3", "5"],
      correctIndex: 1
    },
    {
      q: "log10(100) vale:",
      options: ["1", "2", "10", "100"],
      correctIndex: 1
    },
    {
      q: "La somma degli angoli interni di un triangolo (in gradi):",
      options: ["90", "180", "270", "360"],
      correctIndex: 1
    }
  ],

  tecnologia: [
    {
      q: "Il cloud ‘serverless’ significa che:",
      options: [
        "Non esistono server",
        "I server sono gestiti dal provider e astratti per lo sviluppatore",
        "È gratis",
        "Funziona solo su mobile"
      ],
      correctIndex: 1
    },
    {
      q: "La CPU è:",
      options: ["Memoria di massa", "Unità di elaborazione centrale", "Scheda grafica", "Alimentatore"],
      correctIndex: 1
    },
    {
      q: "Un SSD rispetto a un HDD è in genere:",
      options: ["Più lento", "Più rumoroso", "Più veloce e senza parti mobili", "Più magnetico"],
      correctIndex: 2
    },
    {
      q: "Il Bluetooth è pensato per:",
      options: ["Rete geografica", "Lunga distanza", "Corto raggio", "Sottoacqua"],
      correctIndex: 2
    },
    {
      q: "Un QR code è:",
      options: ["Un file audio", "Un codice bidimensionale", "Una porta di rete", "Un formato immagine compresso"],
      correctIndex: 1
    }
  ],

  // fallback se un tema non avesse domande
  misc: [
    {
      q: "Qual è il colore del cielo in una giornata serena?",
      options: ["Verde", "Blu", "Rosso", "Giallo"],
      correctIndex: 1
    }
  ]
};



// Testo premio casuale (tipo e durata)
export function randomAward(){
  const tipi = ["una consulenza", "un aiuto tecnico", "un supporto allo studio", "una sessione Q&A"];
  const durate = [10, 30, 60, 120];
  const T = tipi[Math.floor(Math.random()*tipi.length)];
  const M = durate[Math.floor(Math.random()*durate.length)];
  return { tipo: T, minuti: M };
}


// Genera un codice coupon pseudo-unico (offline)
export function generateCoupon(){
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "LB-";
  for(let i=0;i<6;i++) out += alphabet[Math.floor(Math.random()*alphabet.length)];
  return out;
}
