// Config centralizzata
export const CONFIG = {
  PDF_NAME: "Tesi Di Liberti.pdf",                     // PDF tesi
    UPLOAD_LINK: "https://drive.google.com/drive/folders/1NWpm1EhBsw4P7qQxCAZiKlNBi9RuDfMN?usp=sharing",
    PHOTOS_API: "https://script.google.com/macros/s/AKfycbxZJfiSS2ghKGbKVZPMQZs7uRul36NOddrH7Q5vqs3bV8eDPzsW7Bs-q0Ou1as3RqGl9w/exec",
    PHOTOS_LIMIT: 40,
  
  COUPON_PDF: "assets/coupon/coupon.pdf",              // PDF del coupon (metti il tuo file)
  GALLERY: ["photos/foto1.jpg","photos/foto2.jpg","photos/foto3.jpg"],
  CHATGPT_GALLERY: ["photos/chatgpt1.jpg","photos/chatgpt2.jpg","photos/chatgpt3.jpg"]
};

// Più spicchi (12)
export const SEGMENTS = [
  { label: "Cheers.exe",   msg: "Compilazione completata! Esecuzione brindisi avviata. 🥂" },
  { label: "No Bug",       msg: "Nessun bug oggi: solo feature non documentate. 😎" },
  { label: "printf",       msg: 'printf("Grazie per esserci!");' },
  { label: "99.9% Uptime", msg: "Affidabilità da datacenter, ma con cuore umano. ❤️" },
  { label: "Hot Reload",   msg: "Refill automatico del bicchiere abilitato." },
  { label: "Merge",        msg: "PR #2025: Laurea merged su main. ✔️" },
  { label: "Unit Test",    msg: "Test superati: amicizia, pazienza, supporto. ✅" },
  { label: "Garbage Free", msg: "GC completata: solo ricordi belli in memoria. ✨" },
  { label: "Low Latency",  msg: "Tempo di risposta: immediato (al brindisi). ⚡" },
  { label: "Refactor",     msg: "Codice e vita più puliti. 🧹" },
  { label: "Cache Hit",    msg: "Ri-ricordi caldi già in memoria. 🔁" },
  { label: "Ship It",      msg: "Spedito in produzione con amore. 🚀" },
];

// Domande a risposta multipla (4 opzioni ciascuna)
export const QUIZ = [
  {
    q: "Quali sono gli ingredienti classici del Negroni?",
    options: ["Gin, Vermouth rosso, Bitter", "Vodka, Triple sec, Lime", "Rum, Menta, Soda", "Tequila, Lime, Sale"],
    correctIndex: 0
  },
  {
    q: "Cosa stampa questa istruzione? printf(\"Grazie!\");",
    options: ["Compila ma non stampa", "Stampa: Grazie!", "Errore di sintassi", "Ritorna 0"],
    correctIndex: 1
  },
  {
    q: "Complessità temporale di una ricerca binaria su array ordinato:",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctIndex: 1
  },
  {
    q: "In un Git workflow, cosa significa 'merge to main'?",
    options: ["Cancellare il branch main", "Unire le modifiche approvate in main", "Creare una tag", "Resettare l'HEAD"],
    correctIndex: 1
  },
  {
    q: "Quale porta è tipicamente usata da HTTPS?",
    options: ["21", "25", "80", "443"],
    correctIndex: 3
  }
];

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
