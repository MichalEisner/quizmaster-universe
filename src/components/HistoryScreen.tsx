import { motion } from 'framer-motion';
import { QuizHistoryEntry, getLocalHistory, clearLocalHistory, getDbHistory, clearDbHistory } from '@/lib/quizHistory';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface HistoryScreenProps {
  onBack: () => void;
  onReview: (entry: QuizHistoryEntry) => void;
}

const difficultyLabels: Record<string, { label: string; icon: string }> = {
  easy: { label: 'Lehká', icon: '🟢' },
  medium: { label: 'Střední', icon: '🟡' },
  hard: { label: 'Těžká', icon: '🔴' },
};

const HistoryScreen = ({ onBack, onReview }: HistoryScreenProps) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (user) {
        const data = await getDbHistory();
        setHistory(data);
      } else {
        setHistory(getLocalHistory());
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleClear = async () => {
    if (user) {
      await clearDbHistory(user.id);
    } else {
      clearLocalHistory();
    }
    setHistory([]);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 pt-12">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            ← Zpět
          </button>
          <h1 className="text-2xl font-bold text-foreground">Historie kvízů</h1>
          {history.length > 0 && (
            <button onClick={handleClear} className="text-sm text-destructive hover:text-destructive/80 transition-colors">
              Smazat vše
            </button>
          )}
        </div>

        {!user && (
          <div className="mb-6 p-4 bg-card border border-border rounded-xl text-center">
            <p className="text-muted-foreground text-sm">
              📝 Přihlaš se pro uložení historie mezi zařízeními
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mx-auto" />
          </div>
        ) : history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-5xl mb-4 block">📋</span>
            <p className="text-muted-foreground text-lg">Zatím žádné kvízy</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {history.map((entry, i) => {
              const pct = Math.round((entry.score / entry.total) * 100);
              const diff = difficultyLabels[entry.difficulty] || difficultyLabels.medium;
              const mistakes = entry.answers.filter(a => a.selectedIndex !== a.correctIndex).length;
              return (
                <motion.button
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onReview(entry)}
                  className="w-full bg-card rounded-xl p-4 border border-border hover:border-primary transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{entry.categoryIcon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-card-foreground">{entry.categoryName}</span>
                        <span className="text-xs">{diff.icon} {diff.label}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{formatDate(entry.date)}</span>
                        {mistakes > 0 && (
                          <span className="text-destructive">{mistakes} {mistakes === 1 ? 'chyba' : mistakes < 5 ? 'chyby' : 'chyb'}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold font-mono ${pct >= 70 ? 'text-primary' : pct >= 50 ? 'text-accent' : 'text-destructive'}`}>
                        {pct}%
                      </span>
                      <p className="text-xs text-muted-foreground">{entry.score}/{entry.total}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;
