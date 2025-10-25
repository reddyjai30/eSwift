import { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api.js'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

export default function Restaurants(){
  const [rows, setRows] = useState(null)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  useEffect(()=>{ (async()=>{ try{ const r = await api.get('/api/restaurants'); setRows(r.data) } catch(e){ enqueueSnackbar(e.message,{variant:'error'}) } })() },[])

  const filtered = useMemo(()=>{
    if (!rows) return null
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(r => (r.name||'').toLowerCase().includes(q) || (r.address||'').toLowerCase().includes(q))
  },[rows, query])

  return (
    <div>
      <h2 style={{ fontWeight:700, fontSize:20, marginBottom:12 }}>Nearby Restaurants</h2>
      {/* Search bar */}
      <div style={{ position:'sticky', top:0, zIndex:30, background:'var(--bg-default)', paddingBottom:8, marginBottom:8, borderBottom:'1px solid var(--divider)' }}>
        <div style={{ display:'flex', gap:8 }}>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder="Search restaurants or address"
            style={{ flex:1, padding:'12px 14px', borderRadius:12, border:'1px solid var(--divider)', background:'var(--bg-paper)', boxShadow:'var(--e-1)', color:'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* List */}
      {!filtered ? (
        Array.from({length:6}).map((_,i)=> (
          <div key={i} style={{ height:86, background:'var(--bg-paper)', border:'1px solid var(--divider)', borderRadius:12, marginBottom:12 }} />
        ))
      ) : filtered.length===0 ? (
        <div style={{ color:'var(--text-secondary)' }}>No restaurants found.</div>
      ) : (
        <div style={{ display:'grid', gap:12 }}>
          {filtered.map(r => (
            <button key={r._id} onClick={()=>navigate(`/restaurants/${r._id}/menu`)}
              style={{ textAlign:'left', background:'var(--bg-paper)', border:'1px solid var(--divider)', borderRadius:12, padding:12, display:'flex', alignItems:'center', gap:12, boxShadow:'var(--e-1)' }}>
              {r.logoUrl ? (
                <img src={r.logoUrl} alt='' style={{ width:56, height:56, objectFit:'cover', borderRadius:12 }} />
              ) : (
                <div style={{ width:56, height:56, borderRadius:12, background:'var(--surface)' }} />
              )}
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600 }}>{r.name}</div>
                <div style={{ fontSize:13, color:'var(--text-secondary)' }}>{r.address}</div>
              </div>
              <div style={{ fontSize:12, color:'var(--text-secondary)' }}>View Menu →</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
