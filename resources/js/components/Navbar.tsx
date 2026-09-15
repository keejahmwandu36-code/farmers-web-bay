import { Link } from 'react-router-dom';
import { getToken } from '../services/api';

export default function Navbar() {
    const isLoggedIn = !!getToken();

    return (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-2xl">🌾</span>
                    <span className="font-bold text-gray-800">Farmers Web-Bay</span>
                </Link>

                <nav className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <Link
                            to="/dashboard"
                            className="text-sm bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm text-gray-700 hover:text-gray-900 font-medium px-3 py-2"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}