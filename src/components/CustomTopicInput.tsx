import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

interface CustomTopicInputProps {
  onSubmit: (topic: string) => void;
  onBack: () => void;
}

const CustomTopicInput = ({ onSubmit, onBack }: CustomTopicInputProps) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (trimmed.length < 3) return;
    onSubmit(trimmed);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          ← Zpět
        </button>

        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">✨</span>
          <h2 className="text-3xl font-bold text-foreground mb-2">Vlastní téma</h2>
          <p className="text-muted-foreground">
            Napiš téma a AI ti vygeneruje kvíz na míru
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Např. Astronomie, Dinosauři, Chemie..."
            maxLength={100}
            className="text-lg py-6 text-center"
            autoFocus
          />
          <motion.button
            type="submit"
            disabled={topic.trim().length < 3}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors hover:bg-primary/90"
          >
            Generovat kvíz 🚀
          </motion.button>
          <p className="text-xs text-muted-foreground text-center">
            Minimálně 3 znaky. Zadej jakékoli téma – historie, sport, věda…
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default CustomTopicInput;
