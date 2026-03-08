import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock } from 'lucide-react';

const Profile = () => {
  const { user, username } = useAuth();
  const navigate = useNavigate();

  const [newUsername, setNewUsername] = useState(username);
  const [savingUsername, setSavingUsername] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newUsername.trim();
    if (!trimmed) {
      toast.error('Přezdívka nemůže být prázdná');
      return;
    }
    if (trimmed.length > 30) {
      toast.error('Přezdívka může mít maximálně 30 znaků');
      return;
    }
    if (trimmed === username) {
      toast.info('Přezdívka je stejná');
      return;
    }

    setSavingUsername(true);
    const { data: taken } = await supabase.rpc('is_username_taken', { _username: trimmed });
    if (taken) {
      toast.error('Tato přezdívka je již zabraná');
      setSavingUsername(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ username: trimmed })
      .eq('id', user.id);
    setSavingUsername(false);

    if (error) {
      if (error.code === '23505') {
        toast.error('Tato přezdívka je již zabraná');
      } else {
        toast.error('Nepodařilo se změnit přezdívku');
      }
    } else {
      toast.success('Přezdívka změněna');
      window.location.reload();
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Heslo musí mít alespoň 6 znaků');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Hesla se neshodují');
      return;
    }

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Heslo bylo změněno');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Nastavení profilu</h1>
        </div>

        <div className="text-sm text-muted-foreground">
          Email: <span className="text-foreground">{user.email}</span>
        </div>

        {/* Username change */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <User className="h-5 w-5 text-primary" />
            Změnit přezdívku
          </div>
          <form onSubmit={handleUsernameChange} className="space-y-4">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Nová přezdívka"
              maxLength={30}
            />
            <button
              type="submit"
              disabled={savingUsername}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold disabled:opacity-50 transition-colors"
            >
              {savingUsername ? 'Ukládám...' : 'Uložit přezdívku'}
            </button>
          </form>
        </div>

        {/* Password change */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Lock className="h-5 w-5 text-primary" />
            Změnit heslo
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Nové heslo"
              minLength={6}
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Potvrdit nové heslo"
              minLength={6}
              required
            />
            <button
              type="submit"
              disabled={savingPassword}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold disabled:opacity-50 transition-colors"
            >
              {savingPassword ? 'Měním heslo...' : 'Změnit heslo'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
