import { Outlet } from 'react-router-dom';

export default function SimpleLayout () {
    return (
      <div className="p-4">
        <header className="bg-gray-800 text-white p-4">Simple Header</header>
        <main className="mt-4">
        <Outlet />
        </main>
      </div>
    );
  };