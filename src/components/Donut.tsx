import React from 'react'
type Props={ segments: { label:string; value:number }[] }
export default function Donut({ segments }:Props){
  const total = segments.reduce((a,s)=>a+s.value,0) || 1
  let acc=0
  return (
    <svg viewBox="0 0 42 42" className="w-28 h-28">
      <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#e5e7eb" strokeWidth="6" />
      {segments.map((s,i)=>{
        const val = s.value/total*100
        const dash = `${val} ${100-val}`
        const rot = 360*acc/100
        acc += val
        const color = ['#0ea5e9','#22c55e','#f59e0b','#ef4444'][i % 4]
        return <circle key={i} cx="21" cy="21" r="15.9155" fill="transparent" stroke={color} strokeWidth="6" strokeDasharray={dash} strokeDashoffset="25" transform={`rotate(${rot} 21 21)`} />
      })}
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="8" fill="#111827">Budget</text>
    </svg>
  )
}
