export default function StatusChip({ status }){
  const map = {
    delivered: { bg:'rgba(34,197,94,.15)', border:'rgba(34,197,94,.3)', color:'#22C55E', label:'DELIVERED' },
    paid:      { bg:'rgba(245,158,11,.15)', border:'rgba(245,158,11,.3)', color:'#F59E0B', label:'PAID' },
    refunded:  { bg:'rgba(239,68,68,.15)', border:'rgba(239,68,68,.3)', color:'#EF4444', label:'REFUNDED' },
    expired:   { bg:'rgba(156,163,175,.15)', border:'rgba(156,163,175,.3)', color:'#9CA3AF', label:'EXPIRED' },
    cancelled: { bg:'rgba(156,163,175,.15)', border:'rgba(156,163,175,.3)', color:'#9CA3AF', label:'CANCELLED' },
    failed:    { bg:'rgba(239,68,68,.15)', border:'rgba(239,68,68,.3)', color:'#EF4444', label:'FAILED' },
  }
  const cfg = map[status] || { bg:'rgba(156,163,175,.15)', border:'rgba(156,163,175,.3)', color:'var(--text-secondary)', label: String(status||'').toUpperCase() }
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'4px 10px', fontSize:12, fontWeight:600,
      background: cfg.bg, color: cfg.color,
      border:`1px solid ${cfg.border}`, borderRadius:999
    }}>{cfg.label}</span>
  )
}

