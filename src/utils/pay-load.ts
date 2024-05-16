import querystring from 'querystring';

const createPayload = (method: string, token: string | null, data: any) => {
    const headers: Record<string, string> = {
        'Content-Type': token ? 'application/json' : 'application/x-www-form-urlencoded'
    };
    if (token) {
        headers['Authorization'] = token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`;
    }
    const payload: { method: string; headers: Record<string, string>; body?: string } = {
        method,
        headers
    };
    if (data) {
        payload.body = token ? JSON.stringify(data) : querystring.stringify(data);
    }
    return payload;
};

export default createPayload;
