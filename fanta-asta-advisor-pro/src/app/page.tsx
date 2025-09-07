import Link from 'next/link'
export default function Page(){
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Benvenuto 👋</h1>
      <p>Questa è la versione <b>Pro</b> con console avanzata, timer, buste chiuse e pannello advisor sticky.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Primi passi</h3>
          <ol className="list-decimal pl-6 text-sm space-y-1">
            <li>Apri il <Link className="text-blue-600 underline" href="/wizard">Wizard</Link> e imposta lega.</li>
            <li>Importa il <Link className="text-blue-600 underline" href="/dashboard/players">listone</Link>.</li>
            <li>Definisci la <Link className="text-blue-600 underline" href="/dashboard/strategy">strategia</Link>.</li>
          </ol>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Vai all’asta</h3>
          <p className="text-sm">Apri la <Link className="text-blue-600 underline" href="/dashboard/auction">Console</Link> o prepara le <Link className="text-blue-600 underline" href="/dashboard/sealed">Buste Chiuse</Link>.</p>
        </div>
      </div>
    </div>
  )
}
