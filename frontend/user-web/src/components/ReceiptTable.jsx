export default function ReceiptTable({ order }){
  const fmt = (n) => `₹ ${Number(n ?? 0).toFixed(2)}`
  return (
    <div style={{ background:'var(--bg-paper)', borderRadius:12, boxShadow:'var(--e-1)', border:'1px solid var(--divider)' }}>
      <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--divider)', fontWeight:700 }}>Receipt</div>
      <div style={{ padding:16 }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:0 }}>
            <thead>
              <tr style={{ color:'var(--text-secondary)', fontSize:12 }}>
                <th style={{ textAlign:'left', padding:'8px 0', borderBottom:'1px solid var(--divider)' }}>Item</th>
                <th style={{ textAlign:'right', padding:'8px 0', borderBottom:'1px solid var(--divider)' }}>Qty</th>
                <th style={{ textAlign:'right', padding:'8px 0', borderBottom:'1px solid var(--divider)' }}>Price</th>
                <th style={{ textAlign:'right', padding:'8px 0', borderBottom:'1px solid var(--divider)' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.items||[]).map((it,i)=> (
                <tr key={i}>
                  <td style={{ padding:'10px 0', borderBottom:'1px dashed var(--divider)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      {it.imageUrl ? (<img src={it.imageUrl} alt="" style={{ width:28, height:28, objectFit:'cover', borderRadius:6 }} />) : (<div style={{ width:28, height:28, borderRadius:6, background:'var(--surface)' }} />)}
                      <span>{it.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'10px 0', textAlign:'right', borderBottom:'1px dashed var(--divider)' }}>{it.quantity}</td>
                  <td style={{ padding:'10px 0', textAlign:'right', borderBottom:'1px dashed var(--divider)' }} className="tabular-nums">{fmt(it.price)}</td>
                  <td style={{ padding:'10px 0', textAlign:'right', borderBottom:'1px dashed var(--divider)' }} className="tabular-nums">{fmt((it.price||0)*(it.quantity||0))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ textAlign:'right', paddingTop:12 }}><span style={{ color:'var(--text-secondary)' }}>Subtotal</span></td>
                <td style={{ textAlign:'right', paddingTop:12 }} className="tabular-nums">{fmt(order.subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign:'right', paddingTop:8 }}><span style={{ color:'var(--text-secondary)' }}>GST ({order.gstPercent}%)</span></td>
                <td style={{ textAlign:'right', paddingTop:8 }} className="tabular-nums">{fmt(order.gstAmount)}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign:'right', paddingTop:10 }}><span style={{ fontWeight:700 }}>Total</span></td>
                <td style={{ textAlign:'right', paddingTop:10 }} className="tabular-nums"><span style={{ fontWeight:700 }}>{fmt(order.total)}</span></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

