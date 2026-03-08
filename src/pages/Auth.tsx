import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Zadej email');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Odkaz pro obnovení hesla byl odeslán na tvůj email');
      setIsForgot(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Přihlášení úspěšné');
        navigate('/');
      }
    } else {
      const trimmedUsername = username.trim();
      if (!trimmedUsername) {
        toast.error('Zadej přezdívku');
        setSubmitting(false);
        return;
      }
      // Check if username is taken
      const { data: taken } = await supabase.rpc('is_username_taken', { _username: trimmedUsername });
      if (taken) {
        toast.error('Tato přezdívka je již zabraná');
        setSubmitting(false);
        return;
      }
      const { error } = await signUp(email, password, trimmedUsername);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Registrace úspěšná! Ověř svůj email.');
      }
    }
    setSubmitting(false);
  };

  if (isForgot) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            QuizMaster
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Zadej svůj email pro obnovení hesla
          </p>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="tvuj@email.cz"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold disabled:opacity-50"
            >
              {submitting ? '...' : 'Odeslat odkaz'}
            </motion.button>
          </form>
          <div className="text-center mt-6">
            <button
              onClick={() => setIsForgot(false)}
              className="text-sm text-primary hover:underline font-medium"
            >
              ← Zpět na přihlášení
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          QuizMaster
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          {isLogin ? 'Přihlaš se ke svému účtu' : 'Vytvoř si nový účet'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Přezdívka</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="Tvoje přezdívka"
                required
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="tvuj@email.cz"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Heslo</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgot(true)}
                className="text-sm text-primary hover:underline"
              >
                Zapomenuté heslo?
              </button>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold disabled:opacity-50"
          >
            {submitting ? '...' : isLogin ? 'Přihlásit se' : 'Registrovat se'}
          </motion.button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">nebo</span>
          </div>
        </div>

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              const result = await lovable.auth.signInWithOAuth('google', {
                redirect_uri: window.location.origin,
              });
              if (result?.error) toast.error(String(result.error));
              setSubmitting(false);
            }}
            className="w-full py-3 bg-card border border-border rounded-lg font-semibold text-foreground flex items-center justify-center gap-2 hover:bg-muted transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Přihlásit přes Google
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              const result = await lovable.auth.signInWithOAuth('apple', {
                redirect_uri: window.location.origin,
              });
              if (result?.error) toast.error(String(result.error));
              setSubmitting(false);
            }}
            className="w-full py-3 bg-card border border-border rounded-lg font-semibold text-foreground flex items-center justify-center gap-2 hover:bg-muted transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            Přihlásit přes Apple
          </motion.button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? 'Nemáš účet? ' : 'Už máš účet? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-medium"
          >
            {isLogin ? 'Registruj se' : 'Přihlaš se'}
          </button>
        </p>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Pokračovat bez přihlášení
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
