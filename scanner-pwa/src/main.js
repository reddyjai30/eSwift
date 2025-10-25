import jsQR from 'jsqr'

let API_BASE = import.meta.env.VITE_API_BASE || ''
const isHttps = location.protocol === 'https:'
if (API_BASE && isHttps && API_BASE.startsWith('http://')) {
  API_BASE = '' // use vite proxy on same-origin HTTPS to avoid mixed content
}

const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const btnScan = document.getElementById('btn-scan')
const btnActivate = document.getElementById('btn-activate')
const btnPhoto = document.getElementById('btn-photo')
const inputFile = document.getElementById('file')
const inputToken = document.getElementById('token')
const statusEl = document.getElementById('status')
const resultEl = document.getElementById('result')

let stream
let scanning = false
let rafId
let detector = null

function setStatus(msg){ statusEl.textContent = msg || '' }
function show(el){ el.classList.remove('hidden') }
function hide(el){ el.classList.add('hidden') }

async function startCamera(){
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    setStatus('Camera not available in this browser. Use photo mode or open via HTTPS in Safari/Chrome.')
    return
  }
  try {
    // Prefer higher resolution for more reliable decoding
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }, audio: false
    })
    video.setAttribute('playsinline', 'true') // iOS Safari
    video.setAttribute('autoplay', 'true')
    video.muted = true; video.setAttribute('muted', '') // allow autoplay on iOS
    video.srcObject = stream
    await video.play().catch(()=>{})
    show(video); setStatus('Camera started');
    // Prefer native BarcodeDetector if available
    if ('BarcodeDetector' in window) {
      try { detector = new window.BarcodeDetector({ formats: ['qr_code'] }) } catch { detector = null }
    }
    scanning = true
    tick()
  } catch (e) {
    setStatus('Camera error: ' + e.message)
  }
}

function stopCamera(){
  scanning = false
  cancelAnimationFrame(rafId)
  if (stream) stream.getTracks().forEach(t => t.stop())
  hide(video)
}

async function tick(){
  if (!scanning) return
  try {
    if (video.readyState >= 2 && (video.videoWidth > 0 && video.videoHeight > 0)){
      if (detector) {
        const results = await detector.detect(video)
        const qr = results && results.find(r => r.rawValue)
        if (qr?.rawValue){
          setStatus('QR detected (native), activating…')
          stopCamera(); await activate(qr.rawValue); return
        }
      }
      // Fallback to jsQR with center crop for better detection
      const vw = video.videoWidth, vh = video.videoHeight
      const side = Math.min(vw, vh)
      const sx = (vw - side) / 2, sy = (vh - side) / 2
      const target = 512
      canvas.width = target; canvas.height = target
      ctx.drawImage(video, sx, sy, side, side, 0, 0, target, target)
      const imageData = ctx.getImageData(0, 0, target, target)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code?.data){
        setStatus('QR detected, activating…')
        stopCamera(); await activate(code.data); return
      }
    }
  } catch (e) {
    // keep scanning; show a lightweight hint for debugging
    // setStatus('Scanning…')
  }
  rafId = requestAnimationFrame(tick)
}

async function activate(token){
  try {
    const r = await fetch(`${API_BASE}/api/orders/qr/activate`, {
      method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ token })
    })
    const j = await r.json()
    if (!r.ok) throw new Error(j.message || 'Activate failed')
    renderResult(j.data)
    setStatus('Order activated successfully')
  } catch(e){
    setStatus(e.message)
  }
}

function renderResult(data){
  resultEl.innerHTML = ''
  const title = document.createElement('div')
  title.innerHTML = `<span class="badge success">DELIVERED</span>`
  const id = document.createElement('div')
  id.textContent = `Order ID: ${data.orderId}`
  const st = document.createElement('div')
  st.textContent = `Status: ${data.status}`
  const dl = document.createElement('button')
  dl.className = 'btn'
  dl.textContent = 'Download Invoice'
  if (data.invoiceToken){
    dl.onclick = () => { window.open(`${API_BASE}/api/orders/invoice-public/${data.invoiceToken}`, '_blank') }
  } else {
    dl.onclick = () => { window.open(`${API_BASE}/api/orders/${data.orderId}/invoice.pdf`, '_blank') }
  }
  resultEl.append(title, id, st, dl)
}

btnScan.addEventListener('click', () => { scanning ? stopCamera() : startCamera() })
btnActivate.addEventListener('click', async () => {
  const t = inputToken.value.trim(); if (!t) return setStatus('Enter token')
  await activate(t)
})

btnPhoto.addEventListener('click', () => inputFile.click())
inputFile.addEventListener('change', async (e) => {
  const file = e.target.files?.[0]; if (!file) return
  setStatus('Decoding photo…')
  const img = new Image()
  img.onload = async () => {
    canvas.width = img.width; canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)
    if (code?.data){ await activate(code.data) }
    else setStatus('No QR found in the selected image')
    URL.revokeObjectURL(img.src)
  }
  img.src = URL.createObjectURL(file)
})

// Register service worker (best-effort)
if (import.meta.env.PROD && 'serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js').catch(()=>{})
}
