import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Loader2 } from 'lucide-react';
import { QuizHistoryEntry } from '@/lib/quizHistory';
import { supabase } from '@/integrations/supabase/client';

interface ReviewScreenProps {
  entry: QuizHistoryEntry;
  onBack: () => void;
}

const ReviewScreen = ({ entry, onBack }: ReviewScreenProps) => {
  const mistakes = entry.answers.filter(a => a.selectedIndex !== a.correctIndex);
  const correct = entry.answers.filter(a => a.selectedIndex === a.correctIndex);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const fetchExplanation = async (key: string, question: string, options: string[], correctIndex: number) => {
    if (explanations[key]) {
      // Toggle off
      setExplanations(prev => { const n = { ...prev }; delete n[key]; return n; });
      return;
    }
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      const { data, error } = await supabase.functions.invoke('explain-answer', {
        body: { question, options, correctIndex },
      });
      if (error) throw error;
      setExplanations(prev => ({ ...prev, [key]: data.explanation }));
    } catch {
      setExplanations(prev => ({ ...prev, [key]: 'Nepodařilo se načíst vysvětlení.' }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const ExplainButton = ({ qKey, question, options, correctIndex }: { qKey: string; question: string; options: string[]; correctIndex: number }) => (
    <div className="mt-3">
      <button
        onClick={() => fetchExplanation(qKey, question, options, correctIndex)}
        disabled={loading[qKey]}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-foreground bg-accent/50 hover:bg-accent px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading[qKey] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
        {explanations[qKey] ? 'Skrýt vysvětlení' : 'Vysvětlení'}
      </button>
      <AnimatePresence>
        {explanations[qKey] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 leading-relaxed">
              💡 {explanations[qKey]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

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
                  <ExplainButton qKey={`m-${i}`} question={a.question} options={a.options} correctIndex={a.correctIndex} />
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
                  <ExplainButton qKey={`c-${i}`} question={a.question} options={a.options} correctIndex={a.correctIndex} />
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
