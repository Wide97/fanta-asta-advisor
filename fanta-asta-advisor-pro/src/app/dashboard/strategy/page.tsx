'use client'
import { useLeague } from '@/stores/league'

export default function Strategy(){
  const { strategy, setStrategy } = useLeague()
  const pct=strategy.budgetPct
  function setPct(k:'P'|'D'|'C'|'A', v:number){ setStrategy({ budgetPct: { ...pct, [k]: Math.max(0,Math.min(100,v)) } }) }
  return (
    <div className="grid gap-4 max-w-2xl">
      <h1 className="text-2xl font-bold">Strategia</h1>
      <div className="card grid gap-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['P','D','C','A'] as const).map(r=>(
            <div key={r}>
              <div className="label">{r}</div>
              <input className="input" type="number" value={pct[r]} onChange={e=>setPct(r, parseFloat(e.target.value||'0'))}/>
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-600">Queste percentuali diventano il **cap** sullo spendibile per ruolo nell’advisor.</div>
      </div>
    </div>
  )
}
