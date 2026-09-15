import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getToken } from './services/api';

// laravel-echo needs Pusher globally
(window as any).Pusher = Pusher;
Pusher.logToConsole = true;

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST ?? '127.0.0.1',
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/api/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: 'application/json',
        },
    },
});

// Expose for debugging + use from any component
(window as any).Echo = echo;

console.log('🔌 Echo instance created. Key:', import.meta.env.VITE_REVERB_APP_KEY);
console.log('🔌 wsHost:', import.meta.env.VITE_REVERB_HOST, 'wsPort:', import.meta.env.VITE_REVERB_PORT);
console.log('🔌 Echo connector:', (echo as any).connector);
console.log('🔌 Echo pusher:', (echo as any).connector?.pusher);
console.log('🔌 Pusher state:', (echo as any).connector?.pusher?.connection?.state);

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);