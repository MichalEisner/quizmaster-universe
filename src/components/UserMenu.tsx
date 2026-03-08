import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const UserMenu = () => {
  const { user, username, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [saving, setSaving] = useState(false);

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

  const handleOpen = () => {
    setNewUsername(username);
    setOpen(true);
  };

  const handleSave = async () => {
    const trimmed = newUsername.trim();
    if (!trimmed) {
      toast.error('Přezdívka nemůže být prázdná');
      return;
    }
    if (trimmed.length > 30) {
      toast.error('Přezdívka může mít maximálně 30 znaků');
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ username: trimmed })
      .eq('id', user.id);
    setSaving(false);

    if (error) {
      if (error.code === '23505') {
        toast.error('Tato přezdívka je již zabraná');
      } else {
        toast.error('Nepodařilo se změnit přezdívku');
      }
    } else {
      toast.success('Přezdívka změněna');
      setOpen(false);
      // Reload username in auth context
      window.location.reload();
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={handleOpen}
          className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm hover:border-primary transition-colors"
        >
          <User className="h-4 w-4 text-primary" />
          <span className="text-foreground font-medium">{username || user.email}</span>
          <Pencil className="h-3 w-3 text-muted-foreground" />
        </button>
        <button
          onClick={signOut}
          className="flex items-center gap-1 px-3 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Změnit přezdívku</DialogTitle>
            <DialogDescription>Zadej novou přezdívku, která se zobrazí v žebříčku.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            className="space-y-4 pt-2"
          >
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Nová přezdívka"
              maxLength={30}
              autoFocus
            />
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold disabled:opacity-50 transition-colors"
            >
              {saving ? 'Ukládám...' : 'Uložit'}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserMenu;
