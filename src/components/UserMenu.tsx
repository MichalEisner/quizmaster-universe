import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, Settings } from 'lucide-react';

const UserMenu = () => {
  const { user, username, signOut } = useAuth();
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
        <User className="h-4 w-4 text-primary" />
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
