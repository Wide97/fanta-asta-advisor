'use client'
import { targets } from '@/data/targets'
import Link from 'next/link'
import { useLeague } from '@/stores/league'

export default function Targets(){
  const { league } = useLeague()
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Targets consigliati (fonte Gazzetta)</h1>
      <div className="text-sm text-gray-600">Lista curata di nomi per reparto. Verifica prezzi nel tuo listone importato.</div>
      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left border-b"><th className="py-1 pr-3">Nome</th><th className="py-1 pr-3">R</th><th className="py-1 pr-3">Prezzo listone</th><th className="py-1 pr-3">Nota</th><th className="py-1 pr-3">Fonte</th></tr></thead>
          <tbody>
            {targets.map((t,i)=>{
              const ref = league.list.find(p=>p.name.toLowerCase()===t.name.toLowerCase())
              return (
                <tr key={i} className="border-b">
                  <td className="py-1 pr-3">{t.name}</td>
                  <td className="py-1 pr-3">{t.role}</td>
                  <td className="py-1 pr-3">{ref?.basePrice ?? '—'}</td>
                  <td className="py-1 pr-3">{t.note}</td>
                  <td className="py-1 pr-3"><a className="text-blue-600 underline" href={t.source} target="_blank" rel="noreferrer">Gazzetta</a></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-gray-500">Questa lista è una base: adatta ai prezzi reali della tua lega e al timing dell'asta.</div>
    </div>
  )
}
