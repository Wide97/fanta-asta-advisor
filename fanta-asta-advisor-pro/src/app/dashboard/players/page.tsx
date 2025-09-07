'use client'
import { useState } from 'react'
import { useLeague, Player } from '@/stores/league'

export default function Players(){
  const { league, importPlayers } = useLeague()
  const [rows, setRows] = useState<Player[]>(league.list)

  function parseCSV(text:string):Player[]{
    const lines=text.split(/\r?\n/).filter(Boolean); if(!lines.length) return []
    const head=lines[0].split(',').map(s=>s.trim()); const idx=(k:string)=>head.indexOf(k)
    const out:Player[]=[]
    for(let i=1;i<lines.length;i++){
      const cols=lines[i].split(',')
      const role=(cols[idx('role')]||'C').trim().toUpperCase()
      out.push({
        id:String(i), name:(cols[idx('name')]||'').trim(), role:(['P','D','C','A'].includes(role)? role : 'C') as any,
        team:(cols[idx('team')]||'').trim(), basePrice: parseInt(cols[idx('base_price')]||'1'),
        isPenaltyTaker: ((cols[idx('is_penalty_taker')]||'').trim().toLowerCase()==='true'),
        setPieces: (cols[idx('set_pieces')]||'').split('|').filter(Boolean) as any,
        injuryStatus: ((cols[idx('injury_status')]||'fit') as any), rotationRisk: parseInt(cols[idx('rotation_risk')]||'0') as any,
        qualityScore: parseInt(cols[idx('quality_score')]||'60')
      })
    }
    return out
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>){
    const f=e.target.files?.[0]; if(!f) return; const text=await f.text(); setRows(parseCSV(text))
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Import Players</h1>
      <div className="card grid gap-2">
        <div className="label">CSV con header: name,role,team,is_penalty_taker,set_pieces,injury_status,rotation_risk,base_price,quality_score</div>
        <input type="file" accept=".csv,text/csv" className="input" onChange={onFile}/>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={()=>importPlayers(rows)}>Importa {rows.length} giocatori</button>
          <a className="btn btn-ghost" href="/sample_players.csv" download>Scarica esempio</a>
        </div>
      </div>
      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left border-b"><th className="py-1 pr-3">Nome</th><th className="py-1 pr-3">R</th><th className="py-1 pr-3">Team</th><th className="py-1 pr-3">Base</th><th className="py-1 pr-3">Rig.</th><th className="py-1 pr-3">Risk</th><th className="py-1 pr-3">Q</th></tr></thead>
          <tbody>{rows.map((p,i)=>(<tr className="border-b" key={i}><td className="py-1 pr-3">{p.name}</td><td className="py-1 pr-3">{p.role}</td><td className="py-1 pr-3">{p.team}</td><td className="py-1 pr-3">{p.basePrice}</td><td className="py-1 pr-3">{p.isPenaltyTaker?'✓':''}</td><td className="py-1 pr-3">{p.rotationRisk}</td><td className="py-1 pr-3">{p.qualityScore}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  )
}
