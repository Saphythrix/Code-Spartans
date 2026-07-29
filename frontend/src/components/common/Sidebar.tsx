import React from 'react';
import { NavLink } from 'react-router-dom';
import { PlaySquare, LayoutDashboard, BarChart3, Radio, Sparkles, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const links = [
    { name: 'Dashboard & Player', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Multimodal Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Creator Studio', path: '/creator', icon: Radio },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-gray-800 flex flex-col justify-between p-4 h-screen sticky top-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 border-b border-gray-800/80 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-purple flex items-center justify-center shadow-lg shadow-primary-600/30">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              EmotionSync <span className="text-xs px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-400 font-mono">AI</span>
            </h1>
            <p className="text-[11px] text-gray-400">Multimodal Entertainment</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-600/15 text-primary-400 border border-primary-500/30 shadow-md shadow-primary-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-gray-800/80 pt-4">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface/50 border border-gray-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-primary-400 text-xs font-bold">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.full_name || 'Alex Rivera'}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
