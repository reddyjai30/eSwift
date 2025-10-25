let BASE_URL = import.meta.env.VITE_USER_API_BASE_URL || 'http://localhost:5002'
if (location.protocol === 'https:' && BASE_URL.startsWith('http://')) {
  // Use same-origin proxy (/api) to avoid mixed content when app runs on HTTPS
  BASE_URL = ''
}

function authHeader(){
  const t = localStorage.getItem('eswift_user_token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

async function request(path, { method='GET', headers={}, body }={}){
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type':'application/json', ...authHeader(), ...headers },
    body: body ? JSON.stringify(body) : undefined
  })
  let data=null
  try { data = await res.json() } catch {}
  if (!res.ok){ const err = new Error((data && data.message) || 'Request failed'); err.responseJson=data; throw err }
  return data
}

export const api = {
  get: (p) => request(p),
  post: (p,b) => request(p,{ method:'POST', body:b }),
  patch: (p,b) => request(p,{ method:'PATCH', body:b }),
  del: (p) => request(p,{ method:'DELETE' })
}
