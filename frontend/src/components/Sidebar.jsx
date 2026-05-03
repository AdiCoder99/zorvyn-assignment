import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
  ];

  if (user?.role === 'admin' || user?.role === 'analyst') {
    navItems.push({ name: 'Users', path: '/users', icon: Users });
  }

  return (
    <aside className="w-64 bg-[var(--color-bg-surface)] border-r border-[var(--color-border-main)] flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-[var(--color-border-main)]">
        <span className="text-lg font-bold text-[var(--color-text-main)] tracking-tight">Zorvyn</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-[var(--color-text-main)]'
                    : 'text-[var(--color-text-muted)] hover:bg-gray-50 hover:text-[var(--color-text-main)]'
                }`
              }
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[var(--color-border-main)]">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-[var(--color-text-muted)] hover:bg-gray-50 hover:text-[var(--color-text-main)] transition-colors text-left"
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
