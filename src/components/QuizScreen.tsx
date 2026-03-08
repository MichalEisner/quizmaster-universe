import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '@/data/questions';
import { QuizAnswer } from '@/lib/quizHistory';

const TIME_PER_QUESTION = 15; // seconds

interface QuizScreenProps {
  questions: Question[];
  categoryName: string;
  categoryIcon: string;
  onFinish: (score: number, total: number, answers: QuizAnswer[]) => void;
  onBack: () => void;
}

const QuizScreen = ({ questions, categoryName, categoryIcon, onFinish, onBack }: QuizScreenProps) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const timePercent = (timeLeft / TIME_PER_QUESTION) * 100;

  // Countdown timer
  useEffect(() => {
    if (showResult) return;
    setTimeLeft(TIME_PER_QUESTION);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, showResult]);

  // Auto-select when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !showResult) {
      handleSelect(-1); // -1 = no answer
    }
  }, [timeLeft]);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(index);
    setShowResult(true);
    const correct = index === question.correctIndex;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, {
      question: question.question,
      options: question.options,
      correctIndex: question.correctIndex,
      selectedIndex: index,
    }]);
  };

  useEffect(() => {
    if (!showResult) return;
    const timer = setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        const finalScore = score;
        onFinish(finalScore, questions.length, answers);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [showResult]);

  const getOptionClass = (index: number) => {
    const base = 'w-full text-left p-4 rounded-lg border-2 transition-all duration-300 font-medium';
    if (!showResult) {
      return `${base} border-border bg-muted/30 hover:border-primary hover:glow-primary cursor-pointer`;
    }
    if (index === question.correctIndex) {
      return `${base} border-primary bg-primary/10 text-primary`;
    }
    if (index === selected && index !== question.correctIndex) {
      return `${base} border-destructive bg-destructive/10 text-destructive`;
    }
    return `${base} border-border bg-muted/30 opacity-50`;
  };

  const timerColor = timeLeft <= 5 ? 'text-destructive' : timeLeft <= 10 ? 'text-yellow-500' : 'text-primary';
  const timerBarColor = timeLeft <= 5 ? 'bg-destructive' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-primary';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            ← Zpět
          </button>
          <div className="flex items-center gap-2">
            <span>{categoryIcon}</span>
            <span className="font-semibold text-foreground">{categoryName}</span>
          </div>
          <span className="font-mono text-sm text-muted-foreground">
            {current + 1}/{questions.length}
          </span>
        </div>

        {/* Timer bar */}
        <div className="w-full h-2 bg-muted rounded-full mb-2 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${timerBarColor}`}
            animate={{ width: `${timePercent}%` }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
        </div>
        <div className="flex justify-end mb-4">
          <span className={`font-mono text-sm font-bold ${timerColor} ${timeLeft <= 5 ? 'animate-pulse' : ''}`}>
            ⏱ {timeLeft}s
          </span>
        </div>

        <div className="w-full h-2 bg-muted rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-8">{question.question}</h2>
            <div className="space-y-3">
              {question.options.map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  onClick={() => handleSelect(i)}
                  className={getOptionClass(i)}
                  disabled={showResult}
                >
                  <span className="text-muted-foreground mr-3 font-mono">{String.fromCharCode(65 + i)}</span>
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-center">
          <span className="text-muted-foreground text-sm">Skóre: </span>
          <span className="font-bold text-primary font-mono">{score}</span>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
