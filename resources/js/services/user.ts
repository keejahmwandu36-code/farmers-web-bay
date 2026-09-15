let cachedUserId: number | null = null;

export function setUserId(id: number) {
    cachedUserId = id;
    localStorage.setItem('user_id', String(id));
}

export function getUserId(): number {
    if (cachedUserId !== null) return cachedUserId;
    return Number(localStorage.getItem('user_id') ?? 0);
}

export function clearUserId() {
    cachedUserId = null;
    localStorage.removeItem('user_id');
}