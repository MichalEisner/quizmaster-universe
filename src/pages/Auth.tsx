import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

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
      if (!username.trim()) {
        toast.error('Zadej přezdívku');
        setSubmitting(false);
        return;
      }
      const { error } = await signUp(email, password, username.trim());
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Registrace úspěšná! Ověř svůj email.');
      }
    }
    setSubmitting(false);
  };

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
