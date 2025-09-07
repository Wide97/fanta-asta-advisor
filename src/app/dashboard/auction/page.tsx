'use client'
import { useEffect, useState } from 'react'
import AdvisorPanel from '@/components/AdvisorPanel'
import Timer from '@/components/Timer'
import { useLeague } from '@/stores/league'

export default function Auction() {
  // uso "as any" per poter chiamare setYouIndex anche se non tipizzato nella store
  const store = useLeague() as any
  const { league, history, assign, undo, youIndex } = store
  const you = league.teams[youIndex] || league.teams[0]
  const [playerId, setPlayerId] = useState('')
  const [bid, setBid] = useState(1)

  // ----------------- helpers per fuzzy match -----------------
  const norm = (s: string) =>
    (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

  const pickBest = (cands: any[]) =>
    [...cands].sort(
      (a, b) =>
        (b.qualityScore || 0) - (a.qualityScore || 0) ||
        (b.basePrice || 0) - (a.basePrice || 0) ||
        a.name.localeCompare(b.name)
    )[0]

  function resolvePlayer(input: string, list: any[]) {
    const n = norm(input)
    if (!n) return null
    // 1) id esatto
    const byId = list.find(p => norm(p.id) === n)
    if (byId) return byId
    // 2) nome esatto
    const exact = list.find(p => norm(p.name) === n)
    if (exact) return exact
    // 3) inizia con …
    let c = list.filter(p => norm(p.name).startsWith(n))
    if (c.length === 1) return c[0]
    if (c.length > 1) return pickBest(c)
    // 4) contiene …
    c = list.filter(p => norm(p.name).includes(n))
    if (c.length >= 1) return pickBest(c)
    return null
  }
  // -----------------------------------------------------------

  function doAssign() {
    const p = resolvePlayer(playerId, league.list)
    if (!p) {
      alert('Giocatore non trovato nel listone: scegli dal menu o scrivi il nome completo.')
      return
    }
    try {
      assign(youIndex, p.id, p.role, bid)
    } catch (e: any) {
      alert(e?.message || 'Errore')
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '+') setBid(b => b + 1)
      if (e.key === ']') setBid(b => b + 5)
      if (e.key === '}') setBid(b => b + 10)
      if (e.key.toLowerCase() === 'a') doAssign()
      if (e.key.toLowerCase() === 'u') undo()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo]) // teniamo semplice: shortcut per +5/+10/undo/assign

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* COLONNA SINISTRA */}
      <div className="md:col-span-2 grid gap-4">
        {/* Console */}
        <div className="card grid gap-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Console d'asta</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Timer</span>
              <Timer initial={45} />
            </div>
          </div>

          {/* Riga input nominato / offerta / vincitore */}
          <div className="grid md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <div className="label">Giocatore nominato (nome o ID)</div>
              <input
                className="input"
                placeholder="Es. Lautaro Martinez"
                value={playerId}
                onChange={e => setPlayerId(e.target.value)}
                list="players"                             // <- suggerimenti
                onKeyDown={e => { if (e.key === 'Enter') doAssign() }} // invio = assegna
              />
              <datalist id="players">
                {league.list.map((p: any) => (
                  <option key={p.id} value={p.name} />
                ))}
              </datalist>
            </div>

            <div>
              <div className="label">Offerta corrente</div>
              <input
                className="input"
                type="number"
                min={1}
                value={bid}
                onChange={e => setBid(parseInt(e.target.value || '1', 10))}
              />
              <div className="flex gap-2 mt-2">
                <button className="btn btn-primary" onClick={() => setBid(b => b + 1)}>
                  +1 <span className="ml-1 text-xs"><kbd>+</kbd></span>
                </button>
                <button className="btn btn-ghost" onClick={() => setBid(b => b + 5)}>
                  +5 <span className="ml-1 text-xs"><kbd>]</kbd></span>
                </button>
                <button className="btn btn-ghost" onClick={() => setBid(b => b + 10)}>
                  +10 <span className="ml-1 text-xs"><kbd>{'}'}</kbd></span>
                </button>
              </div>
            </div>

            <div>
              <div className="label">Seleziona vincitore</div>
              <select
                className="input"
                value={youIndex}
                onChange={e => store.setYouIndex?.(parseInt(e.target.value || '0', 10))}
              >
                {league.teams.map((t: any, idx: number) => (
                  <option key={idx} value={idx}>{t.name}</option>
                ))}
              </select>
              <div className="text-xs text-gray-500 mt-2">
                L'assegnazione andrà alla squadra selezionata.
              </div>
            </div>
          </div>

          <div className="flex items-end">
            <button className="btn btn-primary" onClick={doAssign}>
              Assegna <span className="ml-1 text-xs"><kbd>A</kbd></span>
            </button>
            <button className="btn btn-ghost ml-2" onClick={undo}>
              Annulla ultimo <span className="ml-1 text-xs"><kbd>U</kbd></span>
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Budget tuo: <b>{(you?.budgetTotal || 0) - (you?.budgetSpent || 0)}</b>
          </div>
        </div>

        {/* Backup & Export */}
        <div className="card">
          <div className="font-semibold mb-2">Backup & Export</div>
          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-ghost"
              onClick={() => {
                const s = localStorage.getItem('fanta-asta-advisor-pro') || '{}'
                const blob = new Blob([s], { type: 'application/json' })
                const a = document.createElement('a')
                a.href = URL.createObjectURL(blob)
                a.download = 'fanta-asta-state.json'
                a.click()
              }}
            >
              Export stato (JSON)
            </button>

            <label className="btn btn-ghost">
              Import stato (JSON)
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  try {
                    const text = await f.text()
                    JSON.parse(text) // validazione veloce
                    localStorage.setItem('fanta-asta-advisor-pro', text)
                    location.reload()
                  } catch {
                    alert('File non valido')
                  }
                }}
              />
            </label>

            <button
              className="btn btn-ghost"
              onClick={() => {
                const st = JSON.parse(localStorage.getItem('fanta-asta-advisor-pro') || '{"state":{}}')
                const lg = st.state?.league
                if (!lg) return alert('Nessun dato')
                let csv = 'team,role,player,price\n'
                ;(lg.teams || []).forEach((t: any) => {
                  ;['P', 'D', 'C', 'A'].forEach((r: string) => {
                    ;(t.roster?.[r] || []).forEach((row: any) => {
                      const p = (lg.list || []).find((x: any) => x.id === row.playerId) || { name: row.playerId }
                      csv += `${t.name},${r},${p.name},${row.price}\n`
                    })
                  })
                })
                const blob = new Blob([csv], { type: 'text/csv' })
                const a = document.createElement('a')
                a.href = URL.createObjectURL(blob)
                a.download = 'roster.csv'
                a.click()
              }}
            >
              Export rose (CSV)
            </button>
          </div>
        </div>

        {/* Registro */}
        <div className="card">
          <div className="font-semibold mb-2">Registro</div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-1 pr-3">#</th>
                  <th className="py-1 pr-3">Giocatore</th>
                  <th className="py-1 pr-3">Ruolo</th>
                  <th className="py-1 pr-3">Prezzo</th>
                  <th className="py-1 pr-3">Squadra</th>
                  <th className="py-1 pr-3">Ora</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h: any, i: number) => {
                  const t = league.teams[h.teamIndex]
                  const p = league.list.find((x: any) => x.id === h.playerId)
                  return (
                    <tr key={i} className="border-b">
                      <td className="py-1 pr-3">{i + 1}</td>
                      <td className="py-1 pr-3">{p?.name || h.playerId}</td>
                      <td className="py-1 pr-3">{h.role}</td>
                      <td className="py-1 pr-3">{h.price}</td>
                      <td className="py-1 pr-3">{t?.name}</td>
                      <td className="py-1 pr-3">{new Date(h.at).toLocaleTimeString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* COLONNA DESTRA: Advisor */}
      <AdvisorPanel currentBid={bid} playerId={playerId} />
    </div>
  )
}

