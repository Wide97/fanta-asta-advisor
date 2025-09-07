import type { Player, Role } from '@/stores/league'
import { advisorConfig, type Phase } from './config'
import { clamp, norm } from '@/lib/math'

export type AdvisorInput={ currentBid:number; youBudgetLeft:number; youSlotsLeft:Record<Role,number>; remainingSupplyQuality:Record<Role,number>; remainingDemand:Record<Role,number>; player:Player; playerVORP:number; playerRisk:number; playerSetPieceBonus:number; strategyCapPct:Record<Role,number>; basePrice:number; phase:Phase }
export type AdvisorOutput={ decision:'BUY'|'RAISE'|'PASS'; score:number; maxBid:number; reasons:string[] }

export function computeScarcity(role: Role, demand:number, supplyQ:number){ return supplyQ<=0? 1 : clamp(demand/supplyQ,0,2) }
export function fairPrice(role: Role, basePrice:number, scarcity:number, phase:Phase){ const m=advisorConfig.market; return basePrice*m.baseMultiplier[role]*(1+0.15*scarcity)*m.phaseBoost[phase] }

export function advisorSuggest(i: AdvisorInput): AdvisorOutput{
  const minReserved = i.youSlotsLeft.P + i.youSlotsLeft.D + i.youSlotsLeft.C + i.youSlotsLeft.A
  const spendable = Math.max(0, i.youBudgetLeft - minReserved)
  if (i.youSlotsLeft[i.player.role] <= 0) return { decision:'PASS', score:0, maxBid:0, reasons:['Slot di ruolo già completo'] }

  const scarcity = computeScarcity(i.player.role, i.remainingDemand[i.player.role], i.remainingSupplyQuality[i.player.role])
  const vNorm = norm(i.playerVORP, -12, 12)
  const sNorm = norm(scarcity, 0, 2)
  const ev01 = clamp(advisorConfig.weights.vorp*vNorm + advisorConfig.weights.scarcity*sNorm + advisorConfig.weights.setPiece*i.playerSetPieceBonus - advisorConfig.weights.risk*i.playerRisk, 0, 1)
  const ev = Math.round(ev01*100)
  const fair = fairPrice(i.player.role, i.basePrice||1, scarcity, i.phase)
  const premium = (ev/100) * (10 + 24*sNorm)
  const capFrac = i.strategyCapPct[i.player.role] ?? 0.3
  const maxBid = Math.max(0, Math.min(fair + premium, spendable * capFrac))
  let decision:'BUY'|'RAISE'|'PASS'='PASS'
  if (i.currentBid <= maxBid && ev >= advisorConfig.thresholds.buy) decision='BUY'
  else if (i.currentBid+1 <= maxBid && ev >= advisorConfig.thresholds.raise) decision='RAISE'
  const reasons:string[]=[]
  if (i.playerSetPieceBonus>0) reasons.push('Piazzati/rigori favorevoli')
  if (scarcity>1) reasons.push('Scarsità ruolo alta')
  if (i.playerRisk>0.6) reasons.push('Rischio elevato')
  if(!reasons.length) reasons.push('Prezzo coerente col valore')
  return { decision, score: ev, maxBid: Math.floor(maxBid), reasons: reasons.slice(0,3) }
}
