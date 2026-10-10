async function api(path, method = 'GET', body) {
  if (!TOKEN) {
    const r = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@nexus.ai',
        password: 'admin123'
      })
    });

    const loginData = await r.json();

    if (!r.ok) {
      throw new Error(loginData.error || 'Login failed');
    }

    TOKEN = loginData.token;

    if (!TOKEN) {
      throw new Error('Login response did not contain a token');
    }
  }

  const r = await fetch(`${API_BASE_URL}/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + TOKEN
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const j = await r.json();

  if (!r.ok) {
    throw new Error(j.error || 'Request failed');
  }

  return j;
}