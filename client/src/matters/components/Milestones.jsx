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
    <div className="light-card flex flex-col gap-4 px-5 py-4">
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {stages.map(([icon,label,key],index)=>{
          const completed = metrics[key]?.completed
          return (
            <div key={icon} className="flex min-w-[140px] items-center gap-3 whitespace-nowrap">
              <div
                className={`grid h-10 w-10 place-items-center rounded-xl border transition ${completed ? 'border-accent text-accent' : 'border-border text-textMuted bg-surfaceSoft'}`}
                style={completed ? { backgroundColor: 'var(--color-accent-soft)' } : undefined}
              >
                <img src={`/icons/${icon}.svg`} className="w-5 opacity-80"/>
              </div>
              <div className="text-xs text-textPrimary">
                <div>{label}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-textMuted">{metrics[key]?.value ?? 0}%</div>
              </div>
              {index<stages.length-1 && (
                <div className="hidden h-px w-10 rounded-full bg-border/70 sm:block" aria-hidden="true"></div>
              )}
            </div>
          )})}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-border/60">
          <div className="h-full rounded-full bg-accent transition-all" style={{width:`${progress}%`}}
            aria-label={`Milestones ${progress} percent complete`}
          />
        </div>
        <div className="text-sm font-semibold text-textPrimary sm:min-w-[56px] sm:text-right">{progress}%</div>
      </div>
    </div>
  )
}
