import ReceiptTable from '../components/ReceiptTable.jsx'
import StatusChip from '../components/StatusChip.jsx'

export default function OrderDetails(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ (async()=>{
    try { const o = await api.get(`/api/orders/${id}`); setOrder(o.data) }
    finally { setLoading(false) }
  })() },[id])

  if (loading) return (
    <div>
      <h2 style={{ fontWeight:700, fontSize:22, marginBottom:12 }}>Order Details</h2>
      <div style={{ height:120, background:'var(--bg-paper)', borderRadius:12, border:'1px solid var(--divider)', marginBottom:12 }} />
      <div style={{ height:240, background:'var(--bg-paper)', borderRadius:12, border:'1px solid var(--divider)' }} />
    </div>
  )
  if (!order) return null

  const pm = order.provider==='wallet' ? 'Wallet' : 'Razorpay'

  return (
    <div>
      <h2 style={{ fontWeight:700, fontSize:22, marginBottom:12 }}>Order Details</h2>
      <div style={{ background:'var(--bg-paper)', borderRadius:12, boxShadow:'var(--e-1)', border:'1px solid var(--divider)', marginBottom:16 }}>
        <div style={{ padding:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <StatusChip status={order.status} />
            <span style={{ color:'var(--text-secondary)', fontSize:14 }}>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <span style={{ fontSize:12, padding:'6px 10px', borderRadius:999, border:'1px solid var(--divider)', color:'var(--text-secondary)' }}>{pm.toUpperCase()}</span>
        </div>
      </div>

      <ReceiptTable order={order} />

      <div style={{ display:'flex', gap:8, marginTop:16 }}>
        {(order.status==='paid' || order.status==='expired') && (
          <button onClick={()=> navigate(`/orders/${order._id}/qr`)} style={{
            padding:'12px 16px', borderRadius:10, border:'none', background:'var(--gradient-primary)', color:'#fff', fontWeight:700, boxShadow:'var(--e-2)'
          }}>View QR Code</button>
        )}
        {order.status==='delivered' && (
          <button onClick={()=> window.open(`/api/orders/${order._id}/invoice.pdf`, '_blank')} style={{
            padding:'10px 14px', borderRadius:10, border:'1px solid var(--divider)', background:'transparent', color:'var(--text-primary)', fontWeight:600
          }}>Download Invoice</button>
        )}
      </div>
    </div>
  )
}
