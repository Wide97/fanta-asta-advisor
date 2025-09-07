'use client'
import { useMemo, useState } from 'react'
import { useLeague } from '@/stores/league'

function nonRound(n:number){ const r=[1,2,3,4,6,7,8,9]; return n + (r[Math.floor(Math.random()*r.length)])*0 }

export default function Sealed(){
  const { league, sealed, addSealed, clearSealed, youIndex } = useLeague()
  const you = league.teams[youIndex] || league.teams[0]
  const [playerId, setPlayerId] = useState('')
  const [offer, setOffer] = useState(10)
  const youLeft = (you.budgetTotal - you.budgetSpent)

  const suggested = useMemo(()=>{
    const p = league.list.find(x=>x.id===playerId || x.name===playerId)
    if(!p) return null
    const scarcity = 1 // per semplicità (puoi evolvere)
    const fair = (p.basePrice||1) * (1.1 + 0.15*scarcity)
    const off = Math.min(youLeft-1, Math.max(1, Math.round(fair + (p.isPenaltyTaker?3:0))))
    return Math.max(1, off)
  }, [playerId, youLeft])

  function add(){
    if(!playerId) return
    const o = Math.max(1, Math.floor(offer))
    addSealed({ playerId, teamIndex: youIndex, offer: o })
    setPlayerId(''); setOffer(10)
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 card grid gap-3">
        <h1 className="text-xl font-semibold">Buste chiuse</h1>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <div className="label">Giocatore (nome o ID)</div>
            <input className="input" value={playerId} onChange={e=>setPlayerId(e.target.value)} placeholder="Es. Calhanoglu" />
          </div>
          <div>
            <div className="label">Offerta</div>
            <input className="input" type="number" min={1} value={offer} onChange={e=>setOffer(parseInt(e.target.value||'1'))} />
            <div className="text-xs text-gray-600 mt-1">Suggerita: <b>{suggested||'—'}</b> (evita cifre tonde)</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={add}>Aggiungi busta</button>
          <button className="btn btn-ghost" onClick={clearSealed}>Svuota</button>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="text-left border-b"><th className="py-1 pr-3">Giocatore</th><th className="py-1 pr-3">Offerta</th></tr></thead>
            <tbody>{sealed.map((b,i)=>{
              const p=league.list.find(x=>x.id===b.playerId)||{name:b.playerId}
              return <tr key={i} className="border-b"><td className="py-1 pr-3">{p.name}</td><td className="py-1 pr-3">{b.offer}</td></tr>
            })}</tbody>
          </table>
        </div>
        <div className="text-xs text-gray-500">Consigli: offre cifre **non tonde**, non concentrare tutto su un solo nome, lascia sempre margine per i ruoli scoperti.</div>
      </div>
      <div className="card sticky-panel">
        <div className="text-sm text-gray-600">Budget residuo</div>
        <div className="text-2xl font-semibold">{youLeft}</div>
        <div className="text-xs text-gray-500 mt-1">Le buste non impegnano budget finché non assegni i giocatori.</div>
      </div>
    </div>
  )
}
