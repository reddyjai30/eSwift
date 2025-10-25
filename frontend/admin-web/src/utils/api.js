const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'

function authHeader() {
  const token = localStorage.getItem('eswift_admin_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, { method = 'GET', headers = {}, body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeader(), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const api = {
  get: (p) => request(p),
  post: (p, b) => request(p, { method: 'POST', body: b }),
  patch: (p, b) => request(p, { method: 'PATCH', body: b }),
  del: (p) => request(p, { method: 'DELETE' }),
}

export async function uploadMultipart(path, file, query = '') {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE_URL}${path}${query}`, {
    method: 'POST',
    headers: { ...authHeader() },
    body: form,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Upload failed')
  return data
}

export async function patchMultipart(path, file, query = '') {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE_URL}${path}${query}`, {
    method: 'PATCH',
    headers: { ...authHeader() },
    body: form,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Upload failed')
  return data
}

