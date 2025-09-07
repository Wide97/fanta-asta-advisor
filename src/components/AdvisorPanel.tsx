'use client'
import { useMemo } from 'react'
import { useLeague } from '@/stores/league'
import { advisorSuggest } from '@/features/advisor/engine'
import Donut from './Donut'
import { WEB_TIPS } from '@/data/consigli.web'

type Props = { currentBid: number; playerId: string }

export default function AdvisorPanel({ currentBid, playerId }: Props) {
  const { league, strategy, youIndex } = useLeague()
  const you = league.teams[youIndex] || league.teams[0]
  const player = league.list.find((p) => p.id === playerId || p.name === playerId)

  const youBudgetLeft = (you?.budgetTotal || 0) - (you?.budgetSpent || 0)
  const youSlotsLeft = {
    P: league.caps.P - (you?.roster.P.length || 0),
    D: league.caps.D - (you?.roster.D.length || 0),
    C: league.caps.C - (you?.roster.C.length || 0),
    A: league.caps.A - (you?.roster.A.length || 0),
  }
  const remainingDemand = {
    P: league.teams.reduce((a, t) => a + Math.max(0, league.caps.P - t.roster.P.length), 0),
    D: league.teams.reduce((a, t) => a + Math.max(0, league.caps.D - t.roster.D.length), 0),
    C: league.teams.reduce((a, t) => a + Math.max(0, league.caps.C - t.roster.C.length), 0),
    A: league.teams.reduce((a, t) => a + Math.max(0, league.caps.A - t.roster.A.length), 0),
  }
  const qualityThreshold = 60
  const remainingSupplyQuality = {
    P: league.list.filter((p) => p.role === 'P' && (p.qualityScore || 0) >= qualityThreshold).length,
    D: league.list.filter((p) => p.role === 'D' && (p.qualityScore || 0) >= qualityThreshold).length,
    C: league.list.filter((p) => p.role === 'C' && (p.qualityScore || 0) >= qualityThreshold).length,
    A: league.list.filter((p) => p.role === 'A' && (p.qualityScore || 0) >= qualityThreshold).length,
  }

  const suggest = useMemo(() => {
    if (!player) return null
    const playerVORP = (player.qualityScore || 60) - 60
    const playerRisk = (player.rotationRisk || 0) / 2
    const setPiece =
      (player.isPenaltyTaker ? 0.6 : 0) + ((player.setPieces?.length || 0) > 0 ? 0.3 : 0)
    const stratCap = {
      P: (strategy.budgetPct.P || 5) / 100,
      D: (strategy.budgetPct.D || 15) / 100,
      C: (strategy.budgetPct.C || 25) / 100,
      A: (strategy.budgetPct.A || 55) / 100,
    }
    return advisorSuggest({
      currentBid,
      youBudgetLeft,
      youSlotsLeft,
      remainingSupplyQuality,
      remainingDemand,
      player,
      playerVORP,
      playerRisk,
      playerSetPieceBonus: Math.min(1, setPiece),
      strategyCapPct: stratCap,
      basePrice: player.basePrice || 1,
      phase: 'mid',
    })
  }, [player, currentBid, youBudgetLeft, youSlotsLeft.P, youSlotsLeft.D, youSlotsLeft.C, youSlotsLeft.A, strategy])

  // --- CONSIGLI WEB: match robusto su nome digitato/giocatore selezionato ---
  const tip = useMemo(() => {
    const norm = (s: string) =>
      s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    const typed = norm(player?.name || playerId || '')
    if (!typed) return null

    // 1) match esatto
    let t = WEB_TIPS.find((x) => norm(x.name) === typed)
    if (t) return t

    // 2) match parziale (inizio parola), stesso ruolo se disponibile
    const role = (player?.role as 'P' | 'D' | 'C' | 'A') || undefined
    const pool = role ? WEB_TIPS.filter((x) => x.role === role) : WEB_TIPS
    t = pool.find((x) => norm(x.name).startsWith(typed)) || pool.find((x) => norm(x.name).includes(typed))
    return t || null
  }, [player, playerId])

  // Alternative suggerite dello stesso ruolo (se esiste un tip)
  const altTips = useMemo(() => {
    if (!tip) return []
    const role = tip.role
    return WEB_TIPS.filter((x) => x.role === role && x.name !== tip.name).slice(0, 2)
  }, [tip])

  const segments = [
    { label: 'P', value: strategy.budgetPct.P || 5 },
    { label: 'D', value: strategy.budgetPct.D || 15 },
    { label: 'C', value: strategy.budgetPct.C || 25 },
    { label: 'A', value: strategy.budgetPct.A || 55 },
  ]

  return (
    <aside className="card sticky-panel space-y-3">
      <div className="flex items-center gap-3">
        <Donut segments={segments} />
        <div>
          <div className="text-sm text-gray-600">Consiglio attuale</div>
          <div className="text-xl font-semibold">{suggest?.decision || '—'}</div>
          <div className="text-sm">
            Score <b>{suggest?.score || 0}</b> • Max bid <b>{suggest?.maxBid || 0}</b>
          </div>
        </div>
      </div>

      <ul className="list-disc pl-5 text-sm">
        {(suggest?.reasons || []).map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>

      {/* CONSIGLIO DALLA STAMPA */}
      {tip && (
        <div className="rounded-xl border p-3 bg-amber-50">
          <div className="text-sm font-semibold mb-1">Consiglio dalla stampa</div>
          <div className="text-sm">
            <b>{tip.name}</b> — {tip.note}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {tip.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-amber-100 border px-2 py-0.5 rounded text-[11px]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Fonti:{' '}
            {tip.sources.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="underline mr-2"
              >
                {s.publisher}
              </a>
            ))}
          </div>

          {altTips.length > 0 && (
            <div className="mt-2 text-xs">
              Alternative ruolo:{' '}
              {altTips.map((a, i) => (
                <span key={a.name} className="mr-2">
                  {i ? '· ' : ''}
                  {a.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500">
        Budget residuo: <b>{youBudgetLeft}</b> • Slots P/D/C/A:{' '}
        <b>{youSlotsLeft.P}</b>/<b>{youSlotsLeft.D}</b>/<b>{youSlotsLeft.C}</b>/
        <b>{youSlotsLeft.A}</b>
      </div>
    </aside>
  )
}

