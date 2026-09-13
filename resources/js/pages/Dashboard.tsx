import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../services/api';

interface Reading {
    soil_moisture: number;
    temperature: number;
    humidity: number;
    battery_level: number | null;
    recorded_at: string;
}

interface Device {
    id: number;
    device_uid: string;
    status: string;
    battery_level: number | null;
}

interface Alert {
    id: number;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    created_at: string;
}

interface Field {
    id: number;
    name: string;
    crop: string;
    minimum_moisture: number;
    devices: Device[];
    alerts: Alert[];
    latest_reading: Reading | null;
}

interface Farm {
    id: number;
    name: string;
    location: string;
    fields: Field[];
}

export default function Dashboard() {
    const [farms, setFarms] = useState<Farm[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            setError('');
            const data = await api.dashboard();
            setFarms(data.farms);
            setAlerts(data.recent_alerts);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        try {
            await api.logout();
        } catch {}
        setToken(null);
        navigate('/login');
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading dashboard…</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🌾</span>
                        <h1 className="text-xl font-bold text-gray-800">Farmers Web-Bay</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100"
                    >
                        Log out
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                        {error}
                    </div>
                )}

                {/* Recent alerts banner */}
                {alerts.length > 0 && (
                    <div className="mb-6 space-y-2">
                        {alerts.slice(0, 3).map((a) => (
                            <div
                                key={a.id}
                                className={`p-4 rounded-lg border-l-4 ${
                                    a.severity === 'high'
                                        ? 'bg-red-50 border-red-500'
                                        : a.severity === 'medium'
                                        ? 'bg-orange-50 border-orange-500'
                                        : 'bg-green-50 border-green-500'
                                }`}
                            >
                                <div className="flex items-start gap-2">
                                    <span className="text-lg">
                                        {a.severity === 'high' ? '🚨' : '⚠️'}
                                    </span>
                                    <div>
                                        <p className="font-medium text-sm text-gray-800 capitalize">
                                            {a.type.replace(/_/g, ' ')}
                                        </p>
                                        <p className="text-sm text-gray-600">{a.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Farms */}
                {farms.map((farm) => (
                    <div key={farm.id} className="mb-8">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">{farm.name}</h2>
                            <p className="text-sm text-gray-500">📍 {farm.location}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {farm.fields.map((field) => {
                                const r = field.latest_reading;
                                const device = field.devices[0];
                                const isLow = r && Number(r.soil_moisture) < Number(field.minimum_moisture);

                                return (
                                    <div
                                        key={field.id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{field.name}</h3>
                                                <p className="text-xs text-gray-500">
                                                    {field.crop} · min {field.minimum_moisture}%
                                                </p>
                                            </div>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    device?.status === 'online'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}
                                            >
                                                {device?.status ?? 'no device'}
                                            </span>
                                        </div>

                                        {r ? (
                                            <>
                                                <div className="mb-3">
                                                    <div
                                                        className={`text-4xl font-bold ${
                                                            isLow ? 'text-red-600' : 'text-green-600'
                                                        }`}
                                                    >
                                                        {Number(r.soil_moisture).toFixed(1)}%
                                                    </div>
                                                    <p className="text-xs text-gray-500">soil moisture</p>
                                                </div>

                                                <div className="flex gap-4 text-sm text-gray-700">
                                                    <span>🌡 {Number(r.temperature).toFixed(1)}°C</span>
                                                    <span>💧 {Number(r.humidity).toFixed(0)}%</span>
                                                </div>

                                                {device?.battery_level !== null && device?.battery_level !== undefined && (
                                                    <p className="mt-3 text-xs text-gray-500">
                                                        🔋 {device.battery_level}%
                                                    </p>
                                                )}

                                                {isLow && (
                                                    <div className="mt-3 text-xs text-red-600 font-medium">
                                                        ⚠ Below minimum moisture
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-sm text-gray-400 py-8 text-center">
                                                No readings yet
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {farms.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-3">🌱</div>
                        <p className="text-gray-500">No farms yet.</p>
                    </div>
                )}
            </main>
        </div>
    );
}