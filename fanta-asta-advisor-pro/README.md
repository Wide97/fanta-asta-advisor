# Fanta Asta Advisor – PRO
UI più curata (gradient, card glass), **pannello advisor sticky**, **timer**, **buste chiuse**, **donut** strategia.

## Setup
```bash
npm i
npm run dev
# http://localhost:3000
```

## Flusso
1. Wizard → config lega
2. Players → importa CSV (`public/sample_players.csv` come guida)
3. Strategy → percentuali budget (cap spendibile per ruolo)
4. Auction → console con **timer**, consigli **BUY/RAISE/PASS**, **max bid**
5. Sealed → prepara le **buste chiuse**
6. Teams → panoramica budget/roster

## iPhone / PWA
- Manifest + SW inclusi: su Safari → Condividi → Aggiungi a Home.
- Offline: dopo primo caricamento.

## Note
- Advisor configurabile in `src/features/advisor/config.ts`
- Lo stato è salvato in localStorage (Zustand persist).
- Per multi-utente/Realtime, integra Supabase (non obbligatorio per la demo).
