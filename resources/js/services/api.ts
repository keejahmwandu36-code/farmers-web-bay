const API_BASE = '/api';

let token: string | null = localStorage.getItem('token');

export function setToken(t: string | null) {
    token = t;
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
}

export function getToken() {
    return token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (res.status === 401) {
        setToken(null);
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        throw new Error('Unauthenticated');
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const firstError = data.errors
            ? Object.values(data.errors).flat()[0]
            : null;
        throw new Error(firstError || data.message || `Request failed: ${res.status}`);
    }

    return data as T;
}

export const api = {
    login: (email: string, password: string) =>
        request<{ user: any; token: string }>('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    register: (name: string, email: string, password: string) =>
        request<{ user: any; token: string }>('/register', {
            method: 'POST',
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation: password,
            }),
        }),

    logout: () => request<{ message: string }>('/logout', { method: 'POST' }),

    me: () => request<any>('/me'),

    dashboard: () => request<any>('/dashboard'),

    fieldReadings: (fieldId: number) =>
        request<any[]>(`/fields/${fieldId}/readings`),
};