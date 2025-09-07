1) Primo avvio

Apri l’URL Vercel (es. https://…vercel.app).

In alto trovi il menu: wizard, players, strategy, auction, buste, teams.

2) Wizard – setup della lega

Vai su /wizard:

Numero squadre (10 o 12 tipico) e budget per squadra (default 500).

(Opzionale) Buste chiuse on/off.

Clicca Applica.

3) Players – importa il listone

Vai su /dashboard/players:

Carica un CSV con intestazione:

name,role,team,is_penalty_taker,set_pieces,injury_status,rotation_risk,base_price,quality_score


Esempio (lo trovi anche nel progetto, public/sample_players.csv):

Mike Maignan,P,MIL,false,FK|CK,fit,0,10,85
Lautaro Martinez,A,INT,false,FK,fit,0,45,94


Campi chiave:

role: P|D|C|A

is_penalty_taker: true/false

set_pieces: separati da | (es. FK|CK|PK)

rotation_risk: 0,1,2 (2 = alto)

quality_score: 0–100 (usato dall’advisor come “VORP grezzo”)

base_price: prezzo base

Premi Importa N giocatori.

4) Strategy – imposta il piano di spesa

Vai su /dashboard/strategy:

Imposta percentuali budget per ruolo (P/D/C/A).

Nota: qui le percentuali sono usate come cap frazione dello spendibile per ruolo nell’advisor (non devono per forza sommare 100).

5) Auction – la console d’asta

Vai su /dashboard/auction:

Giocatore nominato: scrivi nome o ID come nel CSV.

Offerta corrente: metti il valore attuale; usa i bottoni +1 / +5 / +10 o le scorciatoie da tastiera:

+ → +1

] → +5

} → +10

A → Assegna

U → Undo

Timer: start/pause/reset (con beep allo 0).

Assegna: registra l’acquisto (budget e storico si aggiornano).

Advisor (pannello a destra):

Decisione: BUY / RAISE / PASS

Score (0–100) e Max bid consigliato

Motivi (rigori/piazzati, scarsità ruolo, rischio, …)

La stima tiene conto di: scarsità ruolo, VORP (da quality_score), rischio (rotation_risk), bonus rigori/piazzati, e del cap per ruolo della tua strategia.

Nota: per impostazione attuale l’assegnazione va alla tua squadra (di default “Squadra 1”). Se vuoi scegliere al volo il vincitore tra tutte le squadre, dimmelo e ti aggiungo un selettore “Vincitore” accanto al bottone Assegna.
Workaround avanzato: puoi cambiare “la tua squadra” modificando youIndex nel localStorage (dev-tools):

const s = JSON.parse(localStorage.getItem('fanta-asta-advisor-pro')||'{}');
s.state.youIndex = 2; // 0=Squadra1, 1=Squadra2, ...
localStorage.setItem('fanta-asta-advisor-pro', JSON.stringify(s));
location.reload();

6) Buste chiuse (opzionale)

Vai su /dashboard/sealed:

Inserisci nome/ID giocatore e Offerta.

Ti mostra una offerta suggerita e un reminder a usare cifre non tonde.

Le buste sono solo una lista preparatoria; l’assegnazione effettiva la fai poi in Auction.

7) Teams – panoramica rose e budget

Vai su /dashboard/teams:

Card per squadra con budget residuo e contatori P/D/C/A.

iPhone / Offline

Apri l’URL in Safari → Condividi → Aggiungi a Home. Da lì parte a schermo intero.

Lo stato è salvato in localStorage (dispositivo locale). Evita la Navigazione Privata.

Funziona offline dopo il primo caricamento (PWA + cache).

Dati utili per l’advisor

Metti quality_score realistici (0–100): l’advisor li usa per il VORP.

Marca i rigoristi (is_penalty_taker=true) e chi batte piazzati (set_pieces).

Imposta rotation_risk: 0 basso, 2 alto.

FAQ veloci

Non vedo suggerimenti? Probabile che il nome/ID non corrisponda al CSV oppure il listone non è stato importato.

Blocchi su cap/budget? L’app blocca se superi il cap ruolo o non hai budget residuo.

Voglio sincronizzare più device? Questa versione è locale. Si può integrare Supabase Realtime per multicliente.
