'use client'
import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'

export default function Timer({ initial=45 }: { initial?: number }){
  const [sec, setSec] = useState(initial)
  const [running, setRunning] = useState(false)
  const raf = useRef<number|undefined>(undefined)
  const last = useRef<number>(0)

  useEffect(()=>{ return ()=>{ if(raf.current) cancelAnimationFrame(raf.current) } },[])

  function tick(ts:number){
    if (!running) return
    if (!last.current) last.current = ts
    const dt = (ts - last.current)/1000
    if (dt >= 1){
      last.current = ts
      setSec(s => {
        const n = s - 1
        if (n <= 0){ beep(); setRunning(false); return 0 }
        return n
      })
    }
    raf.current = requestAnimationFrame(tick)
  }
  function start(){ if (!running){ setRunning(true); last.current=0; raf.current = requestAnimationFrame(tick) } }
  function pause(){ setRunning(false); if(raf.current) cancelAnimationFrame(raf.current) }
  function reset(){ pause(); setSec(initial) }

  function beep(){
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const o = ctx.createOscillator(); const g = ctx.createGain()
      o.frequency.value = 880; o.type='sine'; o.connect(g); g.connect(ctx.destination)
      o.start(); g.gain.setValueAtTime(0.2, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.3); o.stop(ctx.currentTime+0.35)
    } catch {}
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-2xl font-bold tabular-nums w-16 text-center">{String(Math.max(0,sec)).padStart(2,'0')}</div>
      <button className="btn btn-primary" onClick={start} title="Start"><Play size={16}/></button>
      <button className="btn btn-ghost" onClick={pause} title="Pause"><Pause size={16}/></button>
      <button className="btn btn-ghost" onClick={reset} title="Reset"><RotateCcw size={16}/></button>
    </div>
  )
}
