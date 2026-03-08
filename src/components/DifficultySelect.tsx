import { motion } from 'framer-motion';
import { CategoryInfo } from '@/data/questions';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectProps {
  category: CategoryInfo;
  onSelect: (difficulty: Difficulty) => void;
  onBack: () => void;
}

const difficulties: { id: Difficulty; label: string; icon: string; description: string }[] = [
  { id: 'easy', label: 'Lehká', icon: '🟢', description: 'Základní otázky pro začátečníky' },
  { id: 'medium', label: 'Střední', icon: '🟡', description: 'Vyžaduje solidní znalosti' },
  { id: 'hard', label: 'Těžká', icon: '🔴', description: 'Pro skutečné experty' },
];

const DifficultySelect = ({ category, onSelect, onBack }: DifficultySelectProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <span className="text-5xl mb-3 block">{category.icon}</span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{category.name}</h2>
        <p className="text-muted-foreground text-lg">Vyber obtížnost</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl w-full justify-center">
        {difficulties.map((d, i) => (
          <motion.button
            key={d.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(d.id)}
            className="bg-card rounded-xl p-6 border-2 border-border hover:border-primary transition-all duration-300 text-center cursor-pointer flex-1 min-w-[160px]"
          >
            <span className="text-4xl mb-3 block">{d.icon}</span>
            <h3 className="text-xl font-bold text-card-foreground mb-1">{d.label}</h3>
            <p className="text-sm text-muted-foreground">{d.description}</p>
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={onBack}
        className="mt-8 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        ← Zpět na kategorie
      </motion.button>
    </div>
  );
};

export default DifficultySelect;
