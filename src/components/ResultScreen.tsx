import { motion } from 'framer-motion';

interface ResultScreenProps {
  score: number;
  total: number;
  categoryName: string;
  categoryIcon: string;
  onRestart: () => void;
  onHome: () => void;
  onReview?: () => void;
}

const ResultScreen = ({ score, total, categoryName, categoryIcon, onRestart, onHome, onReview }: ResultScreenProps) => {
  const percentage = Math.round((score / total) * 100);
  
  const getMessage = () => {
    if (percentage >= 90) return { text: 'Vynikající! 🏆', color: 'text-primary' };
    if (percentage >= 70) return { text: 'Skvělá práce! 🎉', color: 'text-primary' };
    if (percentage >= 50) return { text: 'Dobře! 👍', color: 'text-accent' };
    return { text: 'Zkus to znovu! 💪', color: 'text-destructive' };
  };

  const message = getMessage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-center max-w-md"
      >
        <span className="text-6xl mb-4 block">{categoryIcon}</span>
        <h2 className="text-2xl font-bold text-foreground mb-2">{categoryName}</h2>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="my-8"
        >
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - percentage / 100) }}
                transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold font-mono text-foreground">{percentage}%</span>
            </div>
          </div>
        </motion.div>

        <p className={`text-xl font-bold ${message.color} mb-2`}>{message.text}</p>
        <p className="text-muted-foreground mb-8">
          {score} z {total} správně
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            Hrát znovu
          </motion.button>
          {onReview && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReview}
              className="px-6 py-3 bg-muted text-foreground rounded-lg font-semibold"
            >
              📋 Zobrazit odpovědi
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="px-6 py-3 bg-muted text-foreground rounded-lg font-semibold"
          >
            Kategorie
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultScreen;
