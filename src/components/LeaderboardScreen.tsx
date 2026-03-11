import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { categories } from '@/data/questions';
import { useAuth } from '@/hooks/useAuth';

interface LeaderboardScreenProps {
  onBack: () => void;
}

interface LeaderboardEntry {
  user_id: string;
  username: string;
  total_score: number;
  quiz_count: number;
  avatar_url: string | null;
}

const tabs = [
  { id: null, label: 'Celkově', icon: '🏆' },
  ...categories.map(c => ({ id: c.id, label: c.name, icon: c.icon })),
  { id: 'custom', label: 'Vlastní téma', icon: '✨' },
];

const LeaderboardScreen = ({ onBack }: LeaderboardScreenProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_leaderboard', {
        filter_category_id: activeTab,
      });
      if (!error && data) {
        setEntries(data as LeaderboardEntry[]);
      }
      setLoading(false);
    };
    load();
  }, [activeTab]);

  const getMedal = (i: number) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `${i + 1}.`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 pt-12">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            ← Zpět
          </button>
          <h1 className="text-2xl font-bold text-foreground">🏆 Žebříček</h1>
          <div className="w-12" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id ?? 'all'}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mx-auto" />
          </div>
        ) : entries.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <span className="text-5xl mb-4 block">📊</span>
            <p className="text-muted-foreground text-lg">Zatím žádné výsledky</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, i) => {
              const isMe = user?.id === entry.user_id;
              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-4 bg-card rounded-xl p-4 border ${
                    isMe ? 'border-primary shadow-md' : 'border-border'
                  }`}
                >
                  <span className="text-2xl w-10 text-center font-bold">{getMedal(i)}</span>
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={entry.avatar_url || undefined} alt={entry.username || 'Anonym'} />
                    <AvatarFallback className="bg-muted text-muted-foreground font-bold">
                      {(entry.username || 'A').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${isMe ? 'text-primary' : 'text-card-foreground'}`}>
                      {entry.username || 'Anonym'}
                      {isMe && <span className="text-xs ml-2 text-muted-foreground">(ty)</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {entry.quiz_count} {entry.quiz_count === 1 ? 'kvíz' : entry.quiz_count < 5 ? 'kvízy' : 'kvízů'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-primary">{entry.total_score}</span>
                    <p className="text-xs text-muted-foreground">bodů</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardScreen;
