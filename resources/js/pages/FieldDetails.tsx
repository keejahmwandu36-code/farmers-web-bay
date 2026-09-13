import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer,
} from 'recharts';
import { api } from '../services/api';

interface Reading {
    id: number;
    soil_moisture: number;
    temperature: number;
    humidity: number;
    light: number | null;
    battery_level: number | null;
    recorded_at: string;
    device: {
        id: number;
        device_uid: string;
    } | null;
}

export default function FieldDetails() {
    const { id } = useParams<{ id: string }>();
    const fieldId = Number(id);
    const navigate = useNavigate();

    const [readings, setReadings] = useState<Reading[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!fieldId) return;
        api.fieldReadings(fieldId)
            .then((data) => setReadings(data as Reading[]))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [fieldId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading readings…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded max-w-md">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-3 text-sm text-red-700 hover:text-red-900 underline"
                    >
                        ← Back to dashboard
                    </button>
                </div>
            </div>
        );
    }

    const latest = readings[0];

    // Recharts needs chronological data (oldest → newest)
    const chartData = [...readings].reverse().map((r) => ({
        time: new Date(r.recorded_at).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        }),
        moisture: Number(r.soil_moisture),
        temperature: Number(r.temperature),
        humidity: Number(r.humidity),
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <span>←</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                    <span className="text-sm text-gray-500">Field #{fieldId}</span>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6">
                {/* Latest reading summary */}
                {latest ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Soil Moisture</p>
                            <p className="text-3xl font-bold text-blue-600 mt-1">
                                {Number(latest.soil_moisture).toFixed(1)}%
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Temperature</p>
                            <p className="text-3xl font-bold text-orange-600 mt-1">
                                {Number(latest.temperature).toFixed(1)}°C
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Humidity</p>
                            <p className="text-3xl font-bold text-cyan-600 mt-1">
                                {Number(latest.humidity).toFixed(0)}%
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center mb-6">
                        <p className="text-gray-500">No readings yet for this field.</p>
                    </div>
                )}

                {/* Chart */}
                {chartData.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            History ({chartData.length} readings)
                        </h2>
                        <div style={{ width: '100%', height: 320 }}>
                            <ResponsiveContainer>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                    <XAxis dataKey="time" fontSize={11} tickMargin={8} />
                                    <YAxis fontSize={11} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="moisture"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        name="Moisture %"
                                        dot={{ r: 3 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="temperature"
                                        stroke="#ea580c"
                                        strokeWidth={2}
                                        name="Temp °C"
                                        dot={{ r: 3 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="humidity"
                                        stroke="#0891b2"
                                        strokeWidth={2}
                                        name="Humidity %"
                                        dot={{ r: 3 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Readings table */}
                {readings.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800">All Readings</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                                        <th className="px-4 py-3">Time</th>
                                        <th className="px-4 py-3">Device</th>
                                        <th className="px-4 py-3 text-right">Moisture</th>
                                        <th className="px-4 py-3 text-right">Temp</th>
                                        <th className="px-4 py-3 text-right">Humidity</th>
                                        <th className="px-4 py-3 text-right">Battery</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {readings.map((r) => (
                                        <tr key={r.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                                {new Date(r.recorded_at).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                                                {r.device?.device_uid ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-blue-600">
                                                {Number(r.soil_moisture).toFixed(1)}%
                                            </td>
                                            <td className="px-4 py-3 text-right text-orange-600">
                                                {Number(r.temperature).toFixed(1)}°C
                                            </td>
                                            <td className="px-4 py-3 text-right text-cyan-600">
                                                {Number(r.humidity).toFixed(0)}%
                                            </td>
                                            <td className="px-4 py-3 text-right text-gray-600">
                                                {r.battery_level !== null ? `${r.battery_level}%` : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}