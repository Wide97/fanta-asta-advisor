export const advisorConfig = {
  thresholds: { buy: 62, raise: 52 },
  weights: { vorp: 0.45, scarcity: 0.35, setPiece: 0.1, risk: 0.25 },
  market: { baseMultiplier: { P:1.0, D:1.06, C:1.12, A:1.22 }, phaseBoost: { early:0.97, mid:1.0, late:1.12 } },
  capFraction: { P:0.15, D:0.25, C:0.45, A:0.7 }
}
export type Phase='early'|'mid'|'late'
