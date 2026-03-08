import { motion } from 'framer-motion';
import { categories, CategoryInfo } from '@/data/questions';

interface CategorySelectProps {
  onSelect: (category: CategoryInfo) => void;
  onHistory: () => void;
}

const categoryColors: Record<string, string> = {
  law: 'border-category-law hover:shadow-[0_0_25px_hsl(210_80%_55%/0.4)]',
  it: 'border-category-it hover:shadow-[0_0_25px_hsl(160_80%_50%/0.4)]',
  games: 'border-category-games hover:shadow-[0_0_25px_hsl(270_60%_58%/0.4)]',
  movies: 'border-category-movies hover:shadow-[0_0_25px_hsl(0_75%_55%/0.4)]',
  books: 'border-category-books hover:shadow-[0_0_25px_hsl(45_95%_60%/0.4)]',
};

const CategorySelect = ({ onSelect, onHistory }: CategorySelectProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          QuizMaster
        </h1>
        <p className="text-muted-foreground text-lg">Vyber si kategorii a otestuj své znalosti</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(cat)}
            className={`bg-card rounded-xl p-6 border-2 ${categoryColors[cat.id]} transition-all duration-300 text-left group cursor-pointer`}
          >
            <span className="text-4xl mb-3 block">{cat.icon}</span>
            <h3 className="text-xl font-bold text-card-foreground mb-1">{cat.name}</h3>
            <p className="text-sm text-muted-foreground">{cat.description}</p>
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onHistory}
        className="mt-10 px-6 py-3 bg-muted text-foreground rounded-lg font-semibold flex items-center gap-2 cursor-pointer hover:bg-muted/80 transition-colors"
      >
        📋 Historie kvízů
      </motion.button>
    </div>
  );
};

export default CategorySelect;
