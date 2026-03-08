import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, Settings } from 'lucide-react';

const UserMenu = () => {
  const { user, username, avatarUrl, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <button
        onClick={() => navigate('/auth')}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground hover:border-primary transition-colors"
      >
        <LogIn className="h-4 w-4" />
        Přihlásit se
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="h-6 w-6 rounded-full object-cover" />
        ) : (
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {(username || user.email || '?')[0].toUpperCase()}
          </div>
        )}
        <span className="text-foreground font-medium">{username || user.email}</span>
      </div>
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center gap-1 px-3 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors"
        title="Nastavení profilu"
      >
        <Settings className="h-4 w-4" />
      </button>
      <button
        onClick={signOut}
        className="flex items-center gap-1 px-3 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
};

export default UserMenu;
