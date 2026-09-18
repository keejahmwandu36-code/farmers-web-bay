import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setToken } from '../services/api';
import { getUserId, clearUserId } from '../services/user';

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

interface WeatherData {
    rainfall_mm: number;
    avg_temp_c: number | null;
    max_temp_c: number | null;
    min_temp_c: number | null;
    avg_humidity_pct: number | null;
    avg_solar_mj_m2: number | null;
    period: { days: number };
}

interface RainForecast {
    timezone: string;
    next_rain_start: string | null;
    next_rain_day: number | null;
    next_rain_hours: number | null;
    total_mm: number;
    daily: { date: string; rainfall_mm: number; probability_pct: number }[];
}

export default function Dashboard() {
    const [farms, setFarms] = useState<Farm[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [rain, setRain] = useState<RainForecast | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Main load + Echo subscription
    useEffect(() => {
        loadDashboard();

        const id = getUserId();
        const Echo = (window as any).Echo;

        if (id > 0 && Echo) {
            const channel = Echo.private(`user.${id}`);

            channel.listen('.reading.created', (payload: any) => {
                console.log('Live reading received:', payload);
                loadDashboard();
            });

            return () => {
                Echo.leave(`user.${id}`);
            };
        }
    }, []);

    // Fetch weather + rain once farms are loaded
    useEffect(() => {
        if (farms.length === 0) return;

        const farmId = farms[0].id;
        const token = localStorage.getItem('token');

        fetch(`/api/farms/${farmId}/weather`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => d && setWeather(d.data))
            .catch(() => {});

        fetch(`/api/farms/${farmId}/rain-forecast`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => d && setRain(d.data))
            .catch(() => {});
    }, [farms]);

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
        clearUserId();
        navigate('/login');
    }

    function formatTime(iso: string): string {
        return new Date(iso).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    function formatDate(iso: string): string {
        return new Date(iso).toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    }

    function rainHeadline(): { text: string; tone: 'dry' | 'soon' | 'now' } {
        if (!rain || !rain.next_rain_start || rain.next_rain_day === null) {
            return { text: 'No rain forecast in the next 7 days', tone: 'dry' };
        }

        const d = rain.next_rain_day;
        const hours = rain.next_rain_hours ?? 0;

        if (d === 0 && hours <= 2) {
            return { text: 'Rain expected within the next hour or two', tone: 'now' };
        }
        if (d === 0) {
            return {
                text: `Rain expected today around ${formatTime(rain.next_rain_start)}`,
                tone: 'soon',
            };
        }
        if (d === 1) {
            return {
                text: `Rain expected tomorrow around ${formatTime(rain.next_rain_start)}`,
                tone: 'soon',
            };
        }
        return {
            text: `Rain expected in ${d} days (around ${formatTime(rain.next_rain_start)} on ${formatDate(rain.next_rain_start)})`,
            tone: 'soon',
        };
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

                {/* 1 — Alerts banner */}
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
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${
                                            a.severity === 'high'
                                                ? 'bg-red-500'
                                                : a.severity === 'medium'
                                                ? 'bg-orange-500'
                                                : 'bg-green-500'
                                        }`}
                                    />
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

                {/* 2 — NASA POWER: Regional Weather */}
                {weather && (
                    <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-baseline justify-between mb-3">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Regional Weather
                            </h2>
                            <span className="text-xs text-gray-400">
                                Last {weather.period.days} days · NASA POWER
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Rainfall</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">
                                    {weather.rainfall_mm} <span className="text-base">mm</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Avg temp</p>
                                <p className="text-2xl font-bold text-orange-600 mt-1">
                                    {weather.avg_temp_c ?? '—'}<span className="text-base">°C</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Humidity</p>
                                <p className="text-2xl font-bold text-cyan-600 mt-1">
                                    {weather.avg_humidity_pct ?? '—'}<span className="text-base">%</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Solar</p>
                                <p className="text-2xl font-bold text-amber-600 mt-1">
                                    {weather.avg_solar_mj_m2 ?? '—'}
                                </p>
                                <p className="text-xs text-gray-400">MJ/m²</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3 — Open-Meteo: Rain Forecast */}
                {rain && (() => {
                    const headline = rainHeadline();

                    const toneClass = {
                        dry:  'bg-amber-50 border-amber-500',
                        soon: 'bg-blue-50 border-blue-500',
                        now:  'bg-cyan-50 border-cyan-600',
                    }[headline.tone];

                    const toneIcon = {
                        dry:  'text-amber-700',
                        soon: 'text-blue-700',
                        now:  'text-cyan-700',
                    }[headline.tone];

                    return (
                        <div className={`mb-6 rounded-xl shadow-sm border-l-4 ${toneClass} p-5`}>
                            <div className="flex items-baseline justify-between mb-3">
                                <h2 className={`text-lg font-semibold ${toneIcon}`}>
                                    Rain Forecast
                                </h2>
                                <span className="text-xs text-gray-500">
                                    7-day outlook · Open-Meteo
                                </span>
                            </div>

                            <p className={`text-xl font-semibold ${toneIcon} mb-4`}>
                                {headline.text}
                            </p>

                            <div className="grid grid-cols-7 gap-2">
                                {rain.daily.map((d) => {
                                    const pct = Math.min(100, d.probability_pct);
                                    return (
                                        <div key={d.date} className="text-center">
                                            <p className="text-xs text-gray-500">
                                                {new Date(d.date).toLocaleDateString('en-GB', {
                                                    weekday: 'short',
                                                })}
                                            </p>
                                            <div className="mt-2 h-16 bg-gray-100 rounded relative overflow-hidden">
                                                <div
                                                    className={`absolute bottom-0 left-0 right-0 ${
                                                        pct >= 60
                                                            ? 'bg-blue-500'
                                                            : pct >= 30
                                                            ? 'bg-blue-300'
                                                            : 'bg-gray-300'
                                                    }`}
                                                    style={{ height: `${pct}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-700 mt-1 font-medium">
                                                {d.rainfall_mm}mm
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                {pct}%
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            <p className="mt-4 text-sm text-gray-600">
                                Total expected in the next 7 days:{' '}
                                <span className="font-semibold text-gray-800">
                                    {rain.total_mm} mm
                                </span>
                            </p>
                        </div>
                    );
                })()}

                {/* 4 — Farms */}
                {farms.map((farm) => (
                    <div key={farm.id} className="mb-8">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">{farm.name}</h2>
                            <p className="text-sm text-gray-500">{farm.location}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {farm.fields.map((field) => {
                                const r = field.latest_reading;
                                const device = field.devices[0];
                                const isLow = r && Number(r.soil_moisture) < Number(field.minimum_moisture);

                                return (
                                    <Link
                                        key={field.id}
                                        to={`/fields/${field.id}`}
                                        className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-green-300 transition-all cursor-pointer"
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
                                                    <span>{Number(r.temperature).toFixed(1)}°C</span>
                                                    <span>{Number(r.humidity).toFixed(0)}%</span>
                                                </div>

                                                {device?.battery_level !== null && device?.battery_level !== undefined && (
                                                    <p className="mt-3 text-xs text-gray-500">
                                                        Battery {device.battery_level}%
                                                    </p>
                                                )}

                                                {isLow && (
                                                    <div className="mt-3 text-xs text-red-600 font-medium">
                                                        Below minimum moisture
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-sm text-gray-400 py-8 text-center">
                                                No readings yet
                                            </p>
                                        )}

                                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-green-600 font-medium text-center">
                                            View history →
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {farms.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500">No farms yet.</p>
                    </div>
                )}
            </main>
        </div>
    );
}