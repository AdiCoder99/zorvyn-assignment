import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-main)] flex items-center justify-between px-8">
      <div></div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-[var(--color-text-main)] leading-none">{user?.name}</span>
          <span className="text-xs text-[var(--color-text-muted)] mt-1 uppercase tracking-wider font-medium">{user?.role}</span>
        </div>
        <UserCircle className="w-8 h-8 text-[var(--color-text-muted)]" strokeWidth={1.5} />
      </div>
    </header>
  );
};

export default Header;
