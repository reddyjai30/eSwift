import StatusChip from './StatusChip.jsx'

export default function OrderCardFigma({ order, onClick }){
  const imgs = (order.items||[]).slice(0,3)
  const extra = Math.max(0, (order.items?.length||0) - imgs.length)
  return (
    <button onClick={onClick} style={{
      width:'100%', textAlign:'left', background:'var(--bg-paper)', borderRadius:12,
      padding:16, boxShadow:'var(--e-1)', border:`1px solid var(--divider)`,
      transition:'box-shadow var(--motion-fast) ease'
    }} className="hover:shadow-e-3">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ width:8, height:8, borderRadius:8, background: order.status==='delivered' ? '#22C55E' : order.status==='paid' ? '#F59E0B' : order.status==='refunded' ? '#EF4444' : '#9CA3AF' }} />
          <div>
            <div style={{ fontWeight:700 }}>₹ {Number(order.total||0).toFixed(2)}</div>
            <div style={{ fontSize:12, color:'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleString()}</div>
            <div style={{ display:'flex', gap:6, marginTop:6 }}>
              {imgs.map((it,i)=> (
                <img key={i} src={it.imageUrl||''} alt="" style={{ width:24, height:24, objectFit:'cover', borderRadius:6, border:'1px solid var(--divider)' }} onError={(e)=>{ e.currentTarget.style.visibility='hidden' }} />
              ))}
              {extra>0 && <span style={{ fontSize:12, color:'var(--text-secondary)' }}>+{extra}</span>}
            </div>
          </div>
        </div>
        <StatusChip status={order.status} />
      </div>
    </button>
  )
}

