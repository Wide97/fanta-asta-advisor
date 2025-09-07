'use client'
import { useEffect, useState } from 'react'
import { useLeague, Role } from '@/stores/league'
import AdvisorPanel from '@/components/AdvisorPanel'
import Timer from '@/components/Timer'

export default function Auction(){
  const { league, history, assign, undo, youIndex, setYouIndex } = useLeague()
  const you = league.teams[youIndex] || league.teams[0]
  const [playerId, setPlayerId] = useState('')
  const [bid, setBid] = useState(1)

  function doAssign(){
    const p = league.list.find(x=>x.id===playerId || x.name===playerId)
    if(!p) return alert('Seleziona un giocatore valido (nome o ID presente nel listone)')
    try { assign(youIndex, p.id, p.role, bid) } catch(e:any){ alert(e.message||'Errore') }
  }

  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if (e.key==='+') setBid(b=>b+1)
      if (e.key===']') setBid(b=>b+5)
      if (e.key==='}') setBid(b=>b+10)
      if (e.key.toLowerCase()==='a') doAssign()
      if (e.key.toLowerCase()==='u') undo()
    }
    window.addEventListener('keydown', onKey); return ()=>window.removeEventListener('keydown', onKey)
  }, [bid, playerId])

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 grid gap-4">
        <div className="card grid gap-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Console d'asta</h1>
            <div className="flex items-center gap-3"><span className="text-sm text-gray-600">Timer</span><Timer initial={45}/></div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <div className="label">Giocatore nominato (nome o ID)</div>
              <input className="input" placeholder="Es. Lautaro Martinez" value={playerId} onChange={e=>setPlayerId(e.target.value)} />
            </div>
            <div>
              <div className="label">Offerta corrente</div>
              <input className="input" type="number" min={1} value={bid} onChange={e=>setBid(parseInt(e.target.value||'1'))} />
              <div className="flex gap-2 mt-2">
                <button className="btn btn-primary" onClick={()=>setBid(b=>b+1)}>+1 <span className="ml-1 text-xs"><kbd>+</kbd></span></button>
                <button className="btn btn-ghost" onClick={()=>setBid(b=>b+5)}>+5 <span className="ml-1 text-xs"><kbd>]</kbd></span></button>
                <button className="btn btn-ghost" onClick={()=>setBid(b=>b+10)}>+10 <span className="ml-1 text-xs"><kbd>{'}'}</kbd></span></button>
              </div>
            </div>
            <div>
              <div className="label">Seleziona vincitore</div>
              <select className="input" value={youIndex} onChange={e=>setYouIndex(parseInt(e.target.value||'0'))}>
                {league.teams.map((t,idx)=>(<option key={idx} value={idx}>{t.name}</option>))}
              </select>
              <div className="text-xs text-gray-500 mt-2">Assegnerai l'acquisto alla squadra selezionata.</div>
            </div>
          </div>
    
            <div className="md:col-span-2">
              <div className="label">Giocatore nominato (nome o ID)</div>
              <input className="input" placeholder="Es. Lautaro Martinez" value={playerId} onChange={e=>setPlayerId(e.target.value)} />
            </div>
            <div>
              <div className="label">Offerta corrente</div>
              <input className="input" type="number" min={1} value={bid} onChange={e=>setBid(parseInt(e.target.value||'1'))} />
              <div className="flex gap-2 mt-2">
                <button className="btn btn-primary" onClick={()=>setBid(b=>b+1)}>+1 <span className="ml-1 text-xs"><kbd>+</kbd></span></button>
                <button className="btn btn-ghost" onClick={()=>setBid(b=>b+5)}>+5 <span className="ml-1 text-xs"><kbd>]</kbd></span></button>
                <button className="btn btn-ghost" onClick={()=>setBid(b=>b+10)}>+10 <span className="ml-1 text-xs"><kbd>}</kbd></span></button>
              </div>
            </div>
            <div className="flex items-end">
              <button className="btn btn-primary w-full" onClick={doAssign}>Assegna <span className="ml-1 text-xs"><kbd>A</kbd></span></button>
            </div>
          </div>
          <div className="text-sm text-gray-600">Budget tuo: <b>{(you?.budgetTotal||0)-(you?.budgetSpent||0)}</b></div>
          <div className="flex gap-2"><button className="btn btn-ghost" onClick={undo}>Annulla ultimo <span className="ml-1 text-xs"><kbd>U</kbd></span></button></div>
        </div>

        <div className="card">
          <div className="font-semibold mb-2">Backup & Export</div>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-ghost" onClick={()=>{
              const s = localStorage.getItem('fanta-asta-advisor-pro')||'{}';
              const blob = new Blob([s], {type:'application/json'});
              const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
              a.download = 'fanta-asta-state.json'; a.click();
            }}>Export stato (JSON)</button>
            <label className="btn btn-ghost">Import stato (JSON)
              <input type="file" accept="application/json" className="hidden" onChange={async (e)=>{
                const f=e.target.files?.[0]; if(!f) return;
                const text = await f.text(); try {
                  const j = JSON.parse(text);
                  localStorage.setItem('fanta-asta-advisor-pro', JSON.stringify(j));
                  location.reload();
                } catch { alert('File non valido'); }
              }} />
            </label>
            <button className="btn btn-ghost" onClick={()=>{
              // Export roster CSV
              const {league} = JSON.parse(localStorage.getItem('fanta-asta-advisor-pro')||'{"state":{}}').state || {};
              if(!league){ alert('Nessun dato'); return }
              let csv='team,role,player,price\n';
              (league.teams||[]).forEach((t:any)=>{
                ['P','D','C','A'].forEach((r:any)=>{
                  (t.roster?.[r]||[]).forEach((row:any)=>{
                    const p=(league.list||[]).find((x:any)=>x.id===row.playerId)||{name:row.playerId};
                    csv += `${t.name},${r},${p.name},${row.price}\n`
                  })
                })
              })
              const blob = new Blob([csv], {type:'text/csv'});
              const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
              a.download='roster.csv'; a.click();
            }}>Export rose (CSV)</button>
          </div>
        </div>
    
        <div className="card">
          <div className="font-semibold mb-2">Registro</div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="text-left border-b"><th className="py-1 pr-3">#</th><th className="py-1 pr-3">Giocatore</th><th className="py-1 pr-3">Ruolo</th><th className="py-1 pr-3">Prezzo</th><th className="py-1 pr-3">Squadra</th><th className="py-1 pr-3">Ora</th></tr></thead>
              <tbody>{history.map((h,i)=>{
                const t=league.teams[h.teamIndex]; const p=league.list.find(x=>x.id===h.playerId)
                return <tr key={i} className="border-b"><td className="py-1 pr-3">{i+1}</td><td className="py-1 pr-3">{p?.name||h.playerId}</td><td className="py-1 pr-3">{h.role}</td><td className="py-1 pr-3">{h.price}</td><td className="py-1 pr-3">{t?.name}</td><td className="py-1 pr-3">{new Date(h.at).toLocaleTimeString()}</td></tr>
              })}</tbody>
            </table>
          </div>
        </div>
      </div>
      <AdvisorPanel currentBid={bid} playerId={playerId}/>
    </div>
  )
}
