import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FieldDetails from './pages/FieldDetails';
import { getToken } from './services/api';

function RequireAuth({ children }: { children: React.ReactNode }) {
    return getToken() ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <Routes>
            {/* Public landing page — anyone can view */}
            <Route path="/" element={<Landing />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/dashboard"
                element={<RequireAuth><Dashboard /></RequireAuth>}
            />
            <Route
                path="/fields/:id"
                element={<RequireAuth><FieldDetails /></RequireAuth>}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}