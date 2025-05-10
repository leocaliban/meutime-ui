import { FaFutbol, FaTrophy, FaUsers } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-secondary p-4">
      <h1 className="text-2xl font-bold mb-8 text-accent">Meu Time</h1>
      <nav className="flex flex-col gap-4 text-lightgray">
        <NavLink to="/" className={({ isActive }) => isActive ? 'text-accent hover:text-contrast flex items-center gap-2' : 'text-textMuted hover:text-contrast flex items-center gap-2'}>
          <FaFutbol /> Partidas
        </NavLink>
        <NavLink to="/clubes" className={({ isActive }) => isActive ? 'text-accent hover:text-contrast flex items-center gap-2' : 'text-textMuted hover:text-contrast flex items-center gap-2'}>
          <FaUsers /> Clubes
        </NavLink>
        <NavLink to="/campeonatos" className={({ isActive }) => isActive ? 'text-accent hover:text-contrast flex items-center gap-2' : 'text-textMuted hover:text-contrast flex items-center gap-2'}>
          <FaTrophy /> Campeonatos
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;