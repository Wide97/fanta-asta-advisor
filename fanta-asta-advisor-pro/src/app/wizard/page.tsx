'use client'
import { useState } from 'react'
import { useLeague } from '@/stores/league'
import Link from 'next/link'

export default function Wizard(){
  const { league, reset, setLeague } = useLeague()
  const [teams, setTeams] = useState(league.teams.length||10)
  const [budget, setBudget] = useState(league.teams[0]?.budgetTotal||500)
  const [sealed, setSealed] = useState(!!league.rules.sealedBids)
  return (
    <div className="grid gap-4 max-w-2xl">
      <h1 className="text-2xl font-bold">Wizard – Setup Lega</h1>
      <div className="card grid gap-3">
        <label className="label">Numero squadre</label>
        <input className="input" type="number" min={2} max={20} value={teams} onChange={e=>setTeams(parseInt(e.target.value||'10'))} />
        <label className="label">Budget per squadra</label>
        <input className="input" type="number" min={100} step={10} value={budget} onChange={e=>setBudget(parseInt(e.target.value||'500'))} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={sealed} onChange={e=>setSealed(e.target.checked)}/> Abilita buste chiuse</label>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={()=>{ reset(teams,budget); setLeague({ rules:{...league.rules, sealedBids: sealed} }) }}>Applica</button>
          <Link href="/dashboard/players" className="btn btn-ghost">Avanti → Import</Link>
        </div>
      </div>
    </div>
  )
}
