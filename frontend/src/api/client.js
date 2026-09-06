const BASE_URL = import.meta.env.VITE_API_URL;

export function getToken() {
  return localStorage.getItem('token') ?? sessionStorage.getItem('token');
}

export function setToken(token, remember = true) {
  if (remember) {
    localStorage.setItem('token', token);
    sessionStorage.removeItem('token');
  } else {
    sessionStorage.setItem('token', token);
    localStorage.removeItem('token');
  }
}

export function clearToken() {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? 'Ocurrió un error de red.');
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
};
