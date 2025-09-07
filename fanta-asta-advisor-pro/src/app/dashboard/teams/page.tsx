'use client'
import { useLeague } from '@/stores/league'
export default function Teams(){
  const { league } = useLeague()
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Squadre</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {league.teams.map((t,idx)=>{
          const left = t.budgetTotal - t.budgetSpent
          const caps = league.caps
          const count = { P:t.roster.P.length, D:t.roster.D.length, C:t.roster.C.length, A:t.roster.A.length }
          return (
            <div key={idx} className="card grid gap-2">
              <div className="flex items-center justify-between"><div className="font-semibold">{t.name}</div><div className="text-sm">Budget: <b>{left}</b> / {t.budgetTotal}</div></div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded bg-emerald-50">P<br/><b>{count.P}/{caps.P}</b></div>
                <div className="p-2 rounded bg-blue-50">D<br/><b>{count.D}/{caps.D}</b></div>
                <div className="p-2 rounded bg-amber-50">C<br/><b>{count.C}/{caps.C}</b></div>
                <div className="p-2 rounded bg-rose-50">A<br/><b>{count.A}/{caps.A}</b></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
