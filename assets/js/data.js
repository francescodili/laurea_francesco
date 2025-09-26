// Config centralizzata
export const CONFIG = {
  PDF_NAME: "Tesi Di Liberti.pdf",                     // PDF tesi
  UPLOAD_LINK: "https://LINK_CARTELLA_CONDIVISA",      // cartella per caricare foto
  COUPON_PDF: "assets/coupon/coupon.pdf",              // PDF del coupon (metti il tuo file)
  GALLERY: ["photos/foto1.jpg","photos/foto2.jpg","photos/foto3.jpg"],
  CHATGPT_GALLERY: ["photos/chatgpt1.jpg","photos/chatgpt2.jpg","photos/chatgpt3.jpg"]
};

// Segmenti ruota (testo visuale)
export const SEGMENTS = [
  { label: "Cheers.exe",   msg: "Compilazione completata! Esecuzione brindisi avviata. 🥂" },
  { label: "No Bug",       msg: "Nessun bug oggi: solo feature non documentate. 😎" },
  { label: "printf",       msg: 'printf("Grazie per esserci!");' },
  { label: "99.9% Uptime", msg: "Affidabilità da datacenter, ma con cuore umano. ❤️" },
  { label: "Hot Reload",   msg: "Refill automatico del bicchiere abilitato." },
  { label: "Merge",        msg: "PR #2025: Laurea merged su main con approvazione di tutti. ✔️" },
  { label: "Unit Test",    msg: "Test superati: amicizia, pazienza, supporto. ✅" },
  { label: "Garbage Free", msg: "GC completata: solo ricordi belli in memoria. ✨" },
];

// Domande quiz (accetta più risposte corrette per robustezza)
export const QUIZ = [
  {
    q: "Qual è il cocktail scelto per il brindisi?",
    a: ["negroni"]
  },
  {
    q: "Scrivi il risultato: 2^3 + 1",
    a: ["9","09"]
  },
  {
    q: "Linguaggio stampato in: printf(\"ciao\");",
    a: ["c","linguaggio c","c language"]
  }
];

// Genera un codice coupon pseudo-unico (offline)
export function generateCoupon(){
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "LB-";
  for(let i=0;i<6;i++) out += alphabet[Math.floor(Math.random()*alphabet.length)];
  return out;
}
