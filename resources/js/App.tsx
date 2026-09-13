import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { getToken } from './services/api';

function RequireAuth({ children }: { children: React.ReactNode }) {
    return getToken() ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/"          element={<Navigate to="/dashboard" replace />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        </Routes>
    );
}