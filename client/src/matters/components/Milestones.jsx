import { useMemo } from 'react'
import { useApi } from '../lib/ctx'

const stages=[
  ['excavation','Excavation','rto'],
  ['foundation','Foundation','rpo'],
  ['structure','Structure','uptime'],
  ['interiors','Interiors','mttr'],
  ['finishing','Finishing','incidents'],
]

export default function Milestones(){
  const { kpis, incidents } = useApi() || {}
  const metrics = useMemo(()=>{
    const mttr = kpis?.avg_mttr_min ?? 0
    const mttrScore = Math.max(0, Math.round(100 - Math.min(mttr, 90)))
    const incidentScore = Math.max(0, 100 - (incidents?.length || 0) * 12)
    return {
      rto: { value: Math.round(kpis?.rto_ok_pct ?? 0), completed: (kpis?.rto_ok_pct ?? 0) >= 95 },
      rpo: { value: Math.round(kpis?.rpo_ok_pct ?? 0), completed: (kpis?.rpo_ok_pct ?? 0) >= 95 },
      uptime: { value: Math.round(kpis?.uptime_pct ?? 0), completed: (kpis?.uptime_pct ?? 0) >= 99 },
      mttr: { value: mttrScore, completed: mttr <= 45 },
      incidents: { value: incidentScore, completed: (incidents?.length || 0) <= 2 },
    }
  },[kpis, incidents])
  const completedCount = stages.filter(([,,key])=>metrics[key]?.completed).length
  const progress = stages.length ? Math.round((completedCount / stages.length) * 100) : 0
  return (
    <div className="rounded-2xl border border-border bg-surface/80 p-5 shadow-card transition-colors duration-300">
      <div className="flex flex-wrap items-center gap-4">
        {stages.map(([icon, label, key], index) => {
          const completed = metrics[key]?.completed
          const value = metrics[key]?.value ?? 0
          return (
            <div key={icon} className="flex min-w-[160px] items-center gap-3">
              <div
                className={`relative grid h-12 w-12 place-items-center rounded-2xl border transition-all duration-300 ${
                  completed
                    ? "border-transparent bg-gradient-to-br from-accent via-emerald-400 to-emerald-500 text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.65)]"
                    : "border-border bg-surfaceSoft text-textMuted"
                }`}
              >
                <img src={`/icons/${icon}.svg`} className={`w-5 ${completed ? "opacity-100" : "opacity-70"}`} />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-textPrimary">{label}</div>
                <div className="text-[11px] uppercase tracking-wide text-textMuted">{value}%</div>
              </div>
              {index < stages.length - 1 && (
                <div className="hidden h-px flex-1 rounded-full bg-gradient-to-r from-border/60 via-border/30 to-transparent lg:block" aria-hidden="true"></div>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-border/40 via-border/30 to-border/10">
          <div
            className="absolute inset-y-0 left-0 w-0 rounded-full bg-gradient-to-r from-accent via-emerald-400 to-teal-400 shadow-[0_0_18px_rgba(20,184,166,0.45)] transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
            aria-label={`Milestones ${progress}% complete`}
          />
          <div
            className="absolute -right-1 top-1/2 hidden -translate-y-1/2 translate-x-full rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent md:flex"
          >
            {progress}%
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-textMuted md:min-w-[96px] md:justify-end">
          <span className="font-semibold text-textPrimary">{progress}%</span>
          complete
        </div>
      </div>
    </div>
  )
}
