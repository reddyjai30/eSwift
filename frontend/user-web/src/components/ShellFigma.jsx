import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadCart } from '../store/slices/cart.js'

function NavItem({ active, label, onClick }){
  return (
    <button
      onClick={onClick}
      style={{
        position:'relative', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        gap:4, padding:'8px 12px', minWidth:60, borderRadius:12,
        color: active ? 'var(--primary)' : 'var(--text-secondary)'
      }}
      onMouseOver={e=>{ if(!active) e.currentTarget.style.color = 'var(--text-primary)' }}
      onMouseOut={e=>{ if(!active) e.currentTarget.style.color = 'var(--text-secondary)' }}
    >
      <span style={{ fontSize:12, fontWeight:600 }}>{label}</span>
      {active && (
        <span style={{ position:'absolute', bottom:4, left:'50%', width:4, height:4, borderRadius:4, background:'var(--primary)', transform:'translateX(-50%)' }} />
      )}
    </button>
  )}

export default function ShellFigma(){
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const cart = useSelector(s => s.cart.data)
  useEffect(()=>{ dispatch(loadCart()) },[dispatch])
  const count = cart?.items?.reduce((s,i)=>s+i.quantity,0) || 0

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-default)', display:'flex', flexDirection:'column' }}>
      <header style={{ position:'sticky', top:0, zIndex:40, background:'var(--bg-paper)', borderBottom:'1px solid var(--divider)', boxShadow:'var(--e-1)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:56, padding:'0 16px', maxWidth:1080, margin:'0 auto' }}>
          <h1
            onClick={()=>navigate('/restaurants')}
            style={{ fontSize:18, fontWeight:700, cursor:'pointer', userSelect:'none', backgroundImage:'var(--gradient-primary)', WebkitBackgroundClip:'text', color:'transparent' }}
          >eSwift</h1>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={()=>navigate('/orders')} style={{ padding:'6px 12px', borderRadius:10, fontSize:14, color:'var(--text-secondary)', border:'1px solid var(--divider)', background:'transparent' }}>Orders</button>
            <button onClick={()=>navigate('/wallet')} style={{ padding:'6px 12px', borderRadius:10, fontSize:14, color:'var(--text-secondary)', border:'1px solid var(--divider)', background:'transparent' }}>Wallet</button>
            <button onClick={()=>navigate('/cart')} style={{ position:'relative', padding:'6px 12px', borderRadius:10, fontSize:14, color:'var(--text-secondary)', border:'1px solid var(--divider)', background:'transparent' }}>
              Cart
              {count>0 && (
                <span style={{ position:'absolute', top:-4, right:-4, fontSize:10, padding:'2px 6px', borderRadius:999, background:'var(--primary)', color:'#fff' }}>{count}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main style={{ flex:1, paddingBottom:80 }}>
        <div style={{ maxWidth:1080, margin:'0 auto', padding:'12px 16px' }}>
          <Outlet />
        </div>
      </main>

      <nav style={{ position:'fixed', left:0, right:0, bottom:0, zIndex:40, background:'var(--bg-paper)', borderTop:'1px solid var(--divider)', boxShadow:'var(--e-2)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-around', height:64, maxWidth:1080, margin:'0 auto', padding:'0 8px' }}>
          <NavItem active={isActive('/restaurants')} label="Home" onClick={()=>navigate('/restaurants')} />
          <NavItem active={isActive('/orders')} label="Orders" onClick={()=>navigate('/orders')} />
          <NavItem active={isActive('/wallet')} label="Wallet" onClick={()=>navigate('/wallet')} />
          <NavItem active={isActive('/profile')} label="Profile" onClick={()=>navigate('/profile')} />
        </div>
      </nav>
    </div>
  )
}
