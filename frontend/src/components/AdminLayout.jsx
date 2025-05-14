// components/AdminLayout.jsx
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Outlet />
        </main>
    );
}
