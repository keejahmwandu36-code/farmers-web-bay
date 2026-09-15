import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    heroStats,
    features,
    soilGuide,
    cropTips,
    faqs,
} from '../data/farmingTips';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero with background image */}
            <section className="relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/maize-field.jpg')" }}
                    aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/70 to-emerald-900/80" />

                <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
                    <div className="max-w-3xl text-white">
                        <span className="inline-block text-xs font-medium bg-white/20 text-white px-3 py-1 rounded-full mb-4 backdrop-blur">
                            Smart Farming · Made Simple
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Know what's happening in your field — without walking it every day.
                        </h1>
                        <p className="mt-5 text-lg text-green-50">
                            Soil moisture, temperature, and humidity readings stream from your field
                            to your phone in real time. Get alerts when moisture drops below what your
                            crop needs. Works on poor connections and low-cost hardware.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/register"
                                className="bg-green-500 hover:bg-green-400 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-lg"
                            >
                                Create a free account
                            </Link>
                            <Link
                                to="/login"
                                className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg border border-white/30 backdrop-blur transition-colors"
                            >
                                I already have one
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hero stats */}
            <section className="border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {heroStats.map((s) => (
                        <div key={s.label}>
                            <p className="text-2xl font-bold text-green-700">{s.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Two-column intro with image */}
            <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Built for smallholder farmers
                    </h2>
                    <p className="mt-4 text-gray-600">
                        Most farm technology is designed for large agribusiness with reliable
                        internet, expensive hardware, and dedicated IT teams. This platform is the
                        opposite: it's built for a farmer with one field, a basic Android phone,
                        and a connection that comes and goes.
                    </p>
                    <p className="mt-4 text-gray-600">
                        Sensors report readings as often as every 15 minutes, the platform
                        stores them securely, and your dashboard shows what's happening at a
                        glance. When a threshold is breached, you know within seconds.
                    </p>

                    <ul className="mt-6 space-y-3">
                        {[
                            'No app store download needed — works in the browser',
                            'Readings stream live without refreshing the page',
                            'Alerts work even when the field device goes offline',
                            'One account, many fields, one clear dashboard',
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                <span className="text-gray-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative">
                    <img
                        src="/images/hero-farm.jpg"
                        alt="Farmers working in a field"
                        className="rounded-2xl shadow-xl w-full h-auto object-cover"
                        loading="lazy"
                    />
                    <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 hidden md:block">
                        <p className="text-xs text-gray-500">Live reading</p>
                        <p className="text-2xl font-bold text-green-600">52.4%</p>
                        <p className="text-xs text-gray-500">soil moisture</p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-gray-50 border-y border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Everything you need to watch your fields
                        </h2>
                        <p className="mt-3 text-gray-600">
                            Built from the ground up for smallholder farmers, not enterprise agribusiness.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-green-300 transition-all"
                            >
                                <h3 className="font-semibold text-gray-800">{f.title}</h3>
                                <p className="text-sm text-gray-600 mt-2">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Device / sensor strip with image */}
            <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="order-2 md:order-1">
                    <img
                        src="/images/sensor.jpg"
                        alt="Sensor and hardware used in the field"
                        className="rounded-2xl shadow-xl w-full h-auto object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="order-1 md:order-2">
                    <span className="text-xs font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        Hardware
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 mt-4">
                        A small device in the field does the work
                    </h2>
                    <p className="mt-4 text-gray-600">
                        An ESP32 sensor node measures soil moisture, air temperature, and
                        humidity. It sends readings to the platform over Wi-Fi or mobile data.
                        If the network is down, it stores readings locally and syncs when the
                        connection returns — so nothing is lost.
                    </p>
                    <ul className="mt-6 space-y-3">
                        {[
                            'Solar-friendly — runs on low power',
                            'Battery level reported with every reading',
                            'Buffers up to hundreds of readings offline',
                            'Secure per-device authentication',
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                <span className="text-gray-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Soil moisture guide */}
            <section className="bg-gray-50 border-y border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <div className="max-w-2xl mb-10">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Reading soil moisture — a quick guide
                        </h2>
                        <p className="mt-3 text-gray-600">
                            Moisture percentages are most useful when you know what each range means.
                            Here's a rough guide for common field crops:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {soilGuide.map((g) => {
                            const tone = {
                                danger: 'border-red-400 bg-red-50',
                                warning: 'border-orange-400 bg-orange-50',
                                success: 'border-green-500 bg-green-50',
                                info: 'border-blue-400 bg-blue-50',
                            }[g.tone as 'danger' | 'warning' | 'success' | 'info'];

                            return (
                                <div key={g.range} className={`border-l-4 rounded-r-lg p-5 ${tone}`}>
                                    <div className="flex items-baseline justify-between">
                                        <p className="font-semibold text-gray-800">{g.label}</p>
                                        <p className="text-sm text-gray-600">{g.range}</p>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-2">{g.advice}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Crop tips */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="max-w-2xl mb-10">
                    <h2 className="text-3xl font-bold text-gray-900">Crop-specific guidance</h2>
                    <p className="mt-3 text-gray-600">
                        The system lets you set a minimum moisture threshold per field. Here are
                        sensible starting values for common crops.
                    </p>
                </div>

                <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Crop</th>
                                <th className="px-4 py-3">Water needs</th>
                                <th className="px-4 py-3 text-right">Min moisture</th>
                                <th className="px-4 py-3">Watch out for</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cropTips.map((c) => (
                                <tr key={c.crop} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-800">{c.crop}</td>
                                    <td className="px-4 py-3 text-gray-600">{c.needs}</td>
                                    <td className="px-4 py-3 text-right font-medium text-green-700">
                                        {c.minMoisture}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{c.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* How it works — with photo background */}
            <section className="relative">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/farmer-phone.jpg')" }}
                    aria-hidden="true"
                />
                <div className="absolute inset-0 bg-green-900/85" />

                <div className="relative max-w-6xl mx-auto px-4 py-16 text-white">
                    <h2 className="text-3xl font-bold mb-10 text-center">How it works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { n: 1, t: 'Sensor reads soil', d: 'A small device in the field measures moisture, temperature, and humidity.' },
                            { n: 2, t: 'Data reaches the cloud', d: "Readings travel securely to the platform over the mobile network — or wait if it's down." },
                            { n: 3, t: 'You see it live', d: 'Open the dashboard on your phone. Numbers update in real time.' },
                            { n: 4, t: 'Alerts when needed', d: 'If moisture drops below your threshold, you get notified immediately.' },
                        ].map((step) => (
                            <div key={step.n} className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/20">
                                <div className="text-3xl font-bold text-green-200">{step.n}</div>
                                <p className="font-semibold mt-3">{step.t}</p>
                                <p className="text-sm text-green-100 mt-2">{step.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="max-w-4xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                    Common questions
                </h2>
                <div className="space-y-4">
                    {faqs.map((f, i) => (
                        <details key={i} className="group border border-gray-200 rounded-xl bg-white">
                            <summary className="cursor-pointer p-5 font-medium text-gray-800 flex items-center justify-between list-none">
                                <span>{f.question}</span>
                                <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                            </summary>
                            <p className="px-5 pb-5 text-sm text-gray-600">{f.answer}</p>
                        </details>
                    ))}
                </div>
            </section>

            {/* Final CTA with image */}
            <section className="relative">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/maize-field.jpg')" }}
                    aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 to-emerald-900/90" />

                <div className="relative max-w-3xl mx-auto px-4 py-16 text-center text-white">
                    <h2 className="text-3xl font-bold">
                        Ready to see your fields clearly?
                    </h2>
                    <p className="mt-3 text-green-50">
                        Sign up in less than a minute. No card, no cost, no hardware required to try.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3 justify-center">
                        <Link
                            to="/register"
                            className="bg-green-500 hover:bg-green-400 text-white font-medium px-6 py-3 rounded-lg shadow-lg"
                        >
                            Create free account
                        </Link>
                        <Link
                            to="/login"
                            className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg border border-white/30 backdrop-blur"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}