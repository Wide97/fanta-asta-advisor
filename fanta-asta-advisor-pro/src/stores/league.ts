import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role='P'|'D'|'C'|'A'
export type Player={ id:string; name:string; role:Role; team?:string; basePrice?:number; isPenaltyTaker?:boolean; setPieces?:('CK'|'FK'|'PK')[]; injuryStatus?:'fit'|'doubt'|'injured'; rotationRisk?:0|1|2; qualityScore?:number }
export type Strategy={ budgetPct:Record<Role,number>; risk:'low'|'mid'|'high'; prefer:{penaltyTakers:boolean; starters:boolean; upside:boolean}; formation:'3-4-3'|'4-3-3'|'3-5-2'; modDifesa:boolean }
export type TeamState={ name:string; budgetTotal:number; budgetSpent:number; roster:Record<Role,{playerId:string;price:number}[]> }
export type League={ name:string; teams:TeamState[]; rules:{minBid:number;bidStep:number;sealedBids?:boolean}; caps:Record<Role,number>; list:Player[] }
export type HistoryItem={ playerId:string; role:Role; price:number; teamIndex:number; at:number }
export type SealedBid={ playerId:string; teamIndex:number; offer:number }

const defaultLeague=():League=>({
  name:'Lega', teams:Array.from({length:10}).map((_,i)=>({name:`Squadra ${i+1}`,budgetTotal:500,budgetSpent:0,roster:{P:[],D:[],C:[],A:[]}})),
  rules:{minBid:1,bidStep:1,sealedBids:false}, caps:{P:3,D:8,C:8,A:6}, list:[]
})
const defaultStrat:Strategy={ budgetPct:{P:6,D:14,C:26,A:54}, risk:'mid', prefer:{penaltyTakers:true,starters:true,upside:true}, formation:'3-4-3', modDifesa:false }

type State={ league:League; strategy:Strategy; history:HistoryItem[]; sealed:SealedBid[]; youIndex:number;
  setLeague:(p:Partial<League>)=>void; setStrategy:(p:Partial<Strategy>)=>void; setYouIndex:(i:number)=>void;
  reset:(n?:number,b?:number)=>void; importPlayers:(rows:Player[])=>void; assign:(teamIndex:number,playerId:string,role:Role,price:number)=>void; undo:()=>void;
  addSealed:(b:SealedBid)=>void; clearSealed:()=>void
}

export const useLeague=create<State>()(persist((set,get)=>({
  league: defaultLeague(), strategy: defaultStrat, history:[], sealed:[], youIndex:0,
  setLeague:(p)=>set(s=>({league:{...s.league, ...p}})),
  setStrategy:(p)=>set(s=>({strategy:{...s.strategy, ...p}})),
  setYouIndex:(i)=>set({youIndex:i}),
  reset:(n=10,b=500)=>set({league:{...defaultLeague(), teams:Array.from({length:n}).map((_,i)=>({name:`Squadra ${i+1}`,budgetTotal:b,budgetSpent:0,roster:{P:[],D:[],C:[],A:[]}}))}, history:[], sealed:[]}),
  importPlayers:(rows)=>set(s=>({league:{...s.league, list:rows}})),
  assign:(teamIndex, playerId, role, price)=>{
    const s=get(); const L=structuredClone(s.league); const T=L.teams[teamIndex]; if(!T) return;
    if (T.budgetTotal - T.budgetSpent < price) throw new Error('Budget insufficiente')
    if (T.roster[role].length >= L.caps[role]) throw new Error('Cap ruolo pieno')
    T.roster[role].push({playerId, price}); T.budgetSpent += price;
    set({ league:L, history:[...s.history, {playerId,role,price,teamIndex,at:Date.now()}] })
  },
  undo:()=>{
    const s=get(); const last=s.history.at(-1); if(!last) return;
    const L=structuredClone(s.league); const T=L.teams[last.teamIndex]; const arr=T.roster[last.role];
    const idx=arr.findIndex(p=>p.playerId===last.playerId && p.price===last.price);
    if(idx>=0){ arr.splice(idx,1); T.budgetSpent -= last.price }
    set({ league:L, history:s.history.slice(0,-1) })
  },
  addSealed:(b)=>set(s=>({ sealed:[...s.sealed, b] })),
  clearSealed:()=>set({ sealed:[] })
}), { name:'fanta-asta-advisor-pro' }))
