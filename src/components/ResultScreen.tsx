import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, Link, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

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
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);
  
  const getMessage = () => {
    if (percentage >= 90) return { text: 'Vynikající! 🏆', color: 'text-primary' };
    if (percentage >= 70) return { text: 'Skvělá práce! 🎉', color: 'text-primary' };
    if (percentage >= 50) return { text: 'Dobře! 👍', color: 'text-accent' };
    return { text: 'Zkus to znovu! 💪', color: 'text-destructive' };
  };

  const message = getMessage();

  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#12151e',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    } catch {
      return null;
    }
  };

  const handleShareImage = async () => {
    setSharing(true);
    try {
      const blob = await generateImage();
      if (!blob) throw new Error('Failed');

      if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'quiz.png', { type: 'image/png' })] })) {
        await navigator.share({
          title: `Kvíz: ${categoryName}`,
          text: `${categoryIcon} ${categoryName} — ${score}/${total} (${percentage}%)`,
          files: [new File([blob], 'quiz-result.png', { type: 'image/png' })],
        });
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quiz-${categoryName}-${percentage}pct.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Obrázek stažen');
      }
    } catch {
      toast.error('Sdílení se nezdařilo');
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = () => {
    const params = new URLSearchParams({
      cat: categoryName,
      icon: categoryIcon,
      s: String(score),
      t: String(total),
    });
    const url = `${window.location.origin}?result=${btoa(params.toString())}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Odkaz zkopírován');
    }).catch(() => {
      toast.error('Nepodařilo se zkopírovat');
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-center max-w-md w-full"
      >
        {/* Shareable card */}
        <div ref={cardRef} className="bg-card rounded-2xl p-8 border border-border mb-6">
          <span className="text-6xl mb-4 block">{categoryIcon}</span>
          <h2 className="text-2xl font-bold text-foreground mb-2">{categoryName}</h2>
          
          <div className="my-6">
            <div className="relative w-36 h-36 mx-auto">
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
          </div>

          <p className={`text-xl font-bold ${message.color} mb-2`}>{message.text}</p>
          <p className="text-muted-foreground">{score} z {total} správně</p>
        </div>

        {/* Share buttons */}
        <div className="flex justify-center gap-2 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShareImage}
            disabled={sharing}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm disabled:opacity-50"
          >
            {sharing ? <div className="h-4 w-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin" /> : <Download className="h-4 w-4" />}
            Uložit obrázek
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium text-sm"
          >
            <Link className="h-4 w-4" />
            Kopírovat odkaz
          </motion.button>
        </div>

        {/* Action buttons */}
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
