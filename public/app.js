const tokenText = document.getElementById('tokenText');
let token = null;

// helpers
function setToken(t) {
  token = t;
  tokenText.textContent = t ? t.slice(0, 30) + '...' : 'ninguno';
}

// Register
document.getElementById('btn-register').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (data.token) setToken(data.token);
  alert(data.message || 'Registrado');
});

// Login
document.getElementById('btn-login').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
    setToken(data.token);
    alert('Logueado');
  } else alert(data.message || 'Error login');
});

// Upload form
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!token) return alert('Necesitas iniciar sesión');
  const form = e.target;
  const formData = new FormData(form);
  const res = await fetch('/api/songs', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token },
    body: formData
  });
  const data = await res.json();
  if (res.ok) {
    alert('Canción subida');
    loadSongs();
    form.reset();
  } else {
    alert(data.message || 'Error subiendo');
  }
});

// Load songs
async function loadSongs() {
  const res = await fetch('/api/songs');
  const songs = await res.json();
  const tbody = document.querySelector('#songsTable tbody');
  tbody.innerHTML = '';
  songs.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.title}</td>
      <td>${s.artist}</td>
      <td>${s.uploader ? s.uploader.name : 'Anon'}</td>
      <td><audio controls src="/uploads/${s.filename}"></audio></td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('btn-refresh').addEventListener('click', loadSongs);
window.addEventListener('load', loadSongs);
