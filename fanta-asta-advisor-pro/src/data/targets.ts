export type Target = { name: string; role: 'P'|'D'|'C'|'A'; note: string; source: string }
export const targets: Target[] = [
  // Portieri (fonte Gazzetta listone e guide)
  { name: 'Alex Meret', role:'P', note:'Top price tra i portieri, block Napoli', source:'https://www.gazzetta.it/calcio/fantanews/15-07-2025/listone-fantacalcio-gazzetta-2025-26-quotazioni-fantacampionato.shtml' },
  { name: 'Mile Svilar', role:'P', note:'Titolarità Roma, prezzo top medio', source:'https://www.gazzetta.it/calcio/fantanews/15-07-2025/listone-fantacalcio-gazzetta-2025-26-quotazioni-fantacampionato.shtml' },

  // Difensori
  { name: 'Denzel Dumfries', role:'D', note:'Esterno da bonus', source:'https://images2.gazzettaobjects.it/static_images/infografiche/FREEMIUM/fantacampionato_listone_25-26.pdf' },
  { name: 'Federico Dimarco', role:'D', note:'Cross e piazzati, modificatore', source:'https://images2.gazzettaobjects.it/static_images/infografiche/FREEMIUM/fantacampionato_listone_25-26.pdf' },

  // Centrocampisti
  { name: 'Hakan Calhanoglu', role:'C', note:'Rigorista, alto volume', source:'https://www.gazzetta.it/calcio/fantanews/01-09-2025/consigli-fantacalcio-2025-2026-i-migliori-giocatori-da-comprare-all-asta.shtml' },
  { name: 'Kevin De Bruyne', role:'C', note:'Top assoluto, creatività e bonus', source:'https://www.gazzetta.it/calcio/fantanews/01-09-2025/consigli-fantacalcio-2025-2026-i-migliori-giocatori-da-comprare-all-asta.shtml' },

  // Attaccanti
  { name: 'Lautaro Martinez', role:'A', note:'Floor + ceiling', source:'https://www.gazzetta.it/calcio/fantanews/01-09-2025/consigli-fantacalcio-2025-2026-i-migliori-giocatori-da-comprare-all-asta.shtml' },
  { name: 'Marcus Thuram', role:'A', note:'Copertura Inzaghi, bonus e titolarità', source:'https://www.gazzetta.it/calcio/fantanews/01-09-2025/consigli-fantacalcio-2025-2026-i-migliori-giocatori-da-comprare-all-asta.shtml' },

  // Low cost (Gazzetta)
  { name: 'Mattia Cancellieri', role:'A', note:'Low cost consigliato', source:'https://www.gazzetta.it/calcio/fantanews/consigli-fantacalcio/attaccanti-consigliati/10-08-2025/attaccanti-low-cost-fantacalcio-2025-26-i-giocatori-su-cui-puntare.shtml' },
  { name: 'Semih Kiliçsoy', role:'A', note:'Sorpresa low cost', source:'https://www.gazzetta.it/calcio/fantanews/consigli-fantacalcio/attaccanti-consigliati/10-08-2025/attaccanti-low-cost-fantacalcio-2025-26-i-giocatori-su-cui-puntare.shtml' }
]
