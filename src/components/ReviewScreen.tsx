import { motion } from 'framer-motion';
import { QuizHistoryEntry } from '@/lib/quizHistory';

interface ReviewScreenProps {
  entry: QuizHistoryEntry;
  onBack: () => void;
}

const ReviewScreen = ({ entry, onBack }: ReviewScreenProps) => {
  const mistakes = entry.answers.filter(a => a.selectedIndex !== a.correctIndex);
  const correct = entry.answers.filter(a => a.selectedIndex === a.correctIndex);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 pt-12">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            ← Zpět
          </button>
          <div className="flex items-center gap-2">
            <span>{entry.categoryIcon}</span>
            <span className="font-semibold text-foreground">{entry.categoryName}</span>
          </div>
          <span className="font-mono text-sm text-muted-foreground">{entry.score}/{entry.total}</span>
        </div>

        {mistakes.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-destructive mb-4">❌ Chyby ({mistakes.length})</h2>
            <div className="space-y-4 mb-10">
              {mistakes.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl p-5 border border-destructive/30"
                >
                  <p className="font-bold text-card-foreground mb-3">{a.question}</p>
                  <div className="space-y-2">
                    {a.options.map((opt, oi) => {
                      let cls = 'px-3 py-2 rounded-lg text-sm ';
                      if (oi === a.correctIndex) {
                        cls += 'bg-primary/10 border border-primary text-primary font-medium';
                      } else if (oi === a.selectedIndex) {
                        cls += 'bg-destructive/10 border border-destructive text-destructive line-through';
                      } else {
                        cls += 'text-muted-foreground';
                      }
                      return (
                        <div key={oi} className={cls}>
                          <span className="font-mono mr-2">{String.fromCharCode(65 + oi)}</span>
                          {opt}
                          {oi === a.correctIndex && <span className="ml-2">✓</span>}
                          {oi === a.selectedIndex && oi !== a.correctIndex && <span className="ml-2">✗</span>}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {correct.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-primary mb-4">✅ Správně ({correct.length})</h2>
            <div className="space-y-3">
              {correct.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-card rounded-xl p-4 border border-primary/20"
                >
                  <p className="font-medium text-card-foreground text-sm">{a.question}</p>
                  <p className="text-primary text-sm mt-1">✓ {a.options[a.correctIndex]}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewScreen;
