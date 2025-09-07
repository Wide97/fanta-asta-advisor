'use client'
import { useLeague } from '@/stores/league'
import { useState } from 'react'

export default function Verify(){
  const { league } = useLeague()
  const [ref, setRef] = useState<any[]>([])
  const counts = ['P','D','C','A'].map(r=>({ role:r, n: league.list.filter(p=>p.role===r).length }))
  const total = league.list.length
  const dups = (()=>{
    const seen = new Set<string>(); const dup:any[]=[]
    for(const p of league.list){
      const k=(p.name+'|'+(p.team||''))
      if(seen.has(k)) dup.push(p); else seen.add(k)
    }
    return dup
  })()
  function onFile(e: React.ChangeEvent<HTMLInputElement>){
    const f=e.target.files?.[0]; if(!f) return;
    const reader = new FileReader()
    reader.onload = ()=>{
      try {
        const text = String(reader.result||'')
        const rows = text.split(/\r?\n/).filter(Boolean)
        const head = rows.shift()?.split(',')||[]
        const idx=(k:string)=>head.indexOf(k)
        const arr:any[]=[]
        for(const line of rows){
          const cols=line.split(',')
          arr.push({name: cols[idx('name')], role: cols[idx('role')], team: cols[idx('team')]})
        }
        setRef(arr)
      } catch { alert('CSV non valido') }
    }
    reader.readAsText(f)
  }
  const notInRef = ref.length? league.list.filter(p=>!ref.find(r=>r.name===p.name && r.team===p.team)) : []
  const notInLocal = ref.length? ref.filter(r=>!league.list.find(p=>p.name===r.name && p.team===r.team)) : []
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Verifica listone</h1>
      <div className="card grid gap-1 text-sm">
        <div>Totale: <b>{total}</b></div>
        <div className="flex gap-4">{counts.map(c=><div key={c.role}> {c.role}: <b>{c.n}</b> </div>)}</div>
        <div>Duplicati name+team: <b>{dups.length}</b></div>
      </div>
      <div className="card grid gap-2">
        <div className="text-sm">Confronta con un CSV di riferimento (stesso schema) per controllare se mancano nomi:</div>
        <input type="file" accept=".csv,text/csv" onChange={onFile} />
        {ref.length>0 && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold mb-1">Presenti nel tuo listone ma assenti nel riferimento</div>
              <div className="text-xs text-gray-600 mb-2">{notInRef.length} righe</div>
              <div className="max-h-72 overflow-auto text-sm border rounded-xl p-2 bg-white">
                <ul className="list-disc pl-5">{notInRef.map((p,i)=><li key={i}>{p.name} ({p.team})</li>)}</ul>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Presenti nel riferimento ma assenti nel tuo listone</div>
              <div className="text-xs text-gray-600 mb-2">{notInLocal.length} righe</div>
              <div className="max-h-72 overflow-auto text-sm border rounded-xl p-2 bg-white">
                <ul className="list-disc pl-5">{notInLocal.map((p,i)=><li key={i}>{p.name} ({p.team})</li>)}</ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
