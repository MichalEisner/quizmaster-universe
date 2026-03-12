import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMultiplayer } from '@/hooks/useMultiplayer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { categories, CategoryInfo } from '@/data/questions';
import { Difficulty } from '@/components/DifficultySelect';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type MPScreen = 'menu' | 'lobby' | 'game' | 'results';
const TIME_PER_QUESTION = 15;

interface Props {
  onBack: () => void;
}

const MultiplayerFlow = ({ onBack }: Props) => {
  const [screen, setScreen] = useState<MPScreen>('menu');
  const [joinCode, setJoinCode] = useState('');
  const { user } = useAuth();
  const mp = useMultiplayer();

  // Lobby state (host)
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [customTopic, setCustomTopic] = useState('');
  const [generating, setGenerating] = useState(false);

  // Game state
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevQuestionIndex = useRef(-1);

  // Menu handlers
  const handleCreate = async () => {
    const room = await mp.createRoom(false);
    if (room) setScreen('lobby');
  };

  const handleJoin = async () => {
    if (joinCode.length < 4) return;
    const room = await mp.joinRoom(joinCode);
    if (room) setScreen('lobby');
  };

  const handleFindMatch = async () => {
    const room = await mp.findMatch();
    if (room) setScreen('lobby');
  };

  const handleLeave = async () => {
    await mp.leaveRoom();
    setScreen('menu');
  };

  // Start game (host)
  const startGame = async () => {
    if (!mp.isHost || !selectedCategory) return;
    setGenerating(true);
    try {
      const isCustom = selectedCategory.id === 'custom';
      const { data, error } = await supabase.functions.invoke('generate-questions', {
        body: {
          category: isCustom ? 'custom' : selectedCategory.id,
          count: 10,
          difficulty: selectedDifficulty,
          ...(isCustom ? { customTopic } : {}),
        },
      });
      if (error) throw error;
      if (!data?.questions?.length) throw new Error('No questions');

      await mp.updateRoom({
        category_id: selectedCategory.id,
        category_name: selectedCategory.name,
        category_icon: selectedCategory.icon,
        difficulty: selectedDifficulty,
        custom_topic: isCustom ? customTopic : null,
        questions: data.questions,
        current_question_index: 0,
        question_started_at: new Date().toISOString(),
        status: 'playing',
      });
    } catch (e) {
      console.error(e);
      toast.error('Nepodařilo se vygenerovat otázky');
    } finally {
      setGenerating(false);
    }
  };

  // Watch room status changes
  useEffect(() => {
    if (mp.room?.status === 'playing' && screen === 'lobby') setScreen('game');
    if (mp.room?.status === 'finished' && screen === 'game') setScreen('results');
  }, [mp.room?.status]);

  // Watch if room was deleted (host left)
  useEffect(() => {
    if (!mp.room && screen !== 'menu') setScreen('menu');
  }, [mp.room]);

  // Question change → reset state & timer
  useEffect(() => {
    if (!mp.room || mp.room.current_question_index === prevQuestionIndex.current || screen !== 'game') return;
    prevQuestionIndex.current = mp.room.current_question_index;
    setAnswered(false);
    setSelectedAnswer(null);
    setTimeLeft(TIME_PER_QUESTION);
    mp.resetCurrentAnswer();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mp.room?.current_question_index, screen]);

  // Auto-submit on timeout
  useEffect(() => {
    if (timeLeft === 0 && !answered && screen === 'game') handleAnswer(-1);
  }, [timeLeft, answered, screen]);

  const handleAnswer = async (index: number) => {
    if (answered || !currentQuestion) return;
    setAnswered(true);
    setSelectedAnswer(index);
    if (timerRef.current) clearInterval(timerRef.current);
    const correct = index === currentQuestion.correctIndex;
    await mp.submitAnswer(mp.room!.current_question_index, index, correct);
  };

  // Host auto-advance when all answered
  useEffect(() => {
    if (!mp.isHost || screen !== 'game' || !mp.room) return;
    const allAnswered = mp.players.length > 0 && mp.players.every(p => p.current_answer !== null);
    if (allAnswered) {
      const timer = setTimeout(() => mp.advanceQuestion(), 2000);
      return () => clearTimeout(timer);
    }
  }, [mp.players, mp.isHost, screen]);

  // Host auto-advance on timeout
  useEffect(() => {
    if (!mp.isHost || screen !== 'game' || timeLeft > 0) return;
    const timer = setTimeout(() => mp.advanceQuestion(), 3000);
    return () => clearTimeout(timer);
  }, [timeLeft, mp.isHost, screen]);

  const currentQuestion = mp.room?.questions?.[mp.room?.current_question_index ?? -1] as any;

  // Auth guard
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
        <p className="text-muted-foreground text-lg">Pro multiplayer se musíš přihlásit</p>
        <Button onClick={onBack}>Zpět</Button>
      </div>
    );
  }

  // === MENU ===
  if (screen === 'menu') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-6">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">← Zpět</button>
          <h1 className="text-3xl font-bold text-foreground text-center">⚔️ Multiplayer</h1>
          <p className="text-muted-foreground text-center">Soutěž s kamarády v reálném čase!</p>

          <Button onClick={handleCreate} className="w-full h-14 text-lg" disabled={mp.loading}>
            🏠 Vytvořit místnost
          </Button>

          <div className="flex gap-2">
            <Input
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Kód místnosti"
              maxLength={6}
              className="text-center text-lg tracking-widest font-mono"
            />
            <Button onClick={handleJoin} disabled={mp.loading || joinCode.length < 4}>
              Připojit
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">nebo</span></div>
          </div>

          <Button onClick={handleFindMatch} variant="outline" className="w-full h-14 text-lg" disabled={mp.loading}>
            🎲 Najít náhodnou hru
          </Button>
        </motion.div>
      </div>
    );
  }

  // === LOBBY ===
  if (screen === 'lobby' && mp.room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg space-y-6">
          <div className="flex justify-between items-center">
            <button onClick={handleLeave} className="text-muted-foreground hover:text-foreground transition-colors">← Odejít</button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Kód místnosti</p>
              <p className="text-3xl font-mono font-bold tracking-widest text-primary">{mp.room.code}</p>
            </div>
            <div className="w-12" />
          </div>

          <div className="bg-muted/30 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-foreground">Hráči ({mp.players.length}/{mp.room.max_players})</h3>
            {mp.players.map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {p.avatar_url && <AvatarImage src={p.avatar_url} />}
                  <AvatarFallback className="text-xs">{(p.username || '?')[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-foreground font-medium">{p.username}</span>
                {p.user_id === mp.room!.host_id && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Host</span>
                )}
              </div>
            ))}
            {mp.players.length < 2 && (
              <p className="text-sm text-muted-foreground animate-pulse">Čekání na dalšího hráče...</p>
            )}
          </div>

          {mp.isHost && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Vyber kategorii</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedCategory?.id === cat.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted/30 hover:border-primary/50'
                    }`}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    <span className="text-sm font-medium text-foreground">{cat.name}</span>
                  </button>
                ))}
                <button
                  onClick={() => setSelectedCategory({ id: 'custom', name: 'Vlastní', icon: '✨', description: '' })}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedCategory?.id === 'custom'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-muted/30 hover:border-primary/50'
                  }`}
                >
                  <span className="mr-2">✨</span>
                  <span className="text-sm font-medium text-foreground">Vlastní téma</span>
                </button>
              </div>

              {selectedCategory?.id === 'custom' && (
                <Input
                  value={customTopic}
                  onChange={e => setCustomTopic(e.target.value)}
                  placeholder="Zadej vlastní téma..."
                  maxLength={100}
                />
              )}

              <h3 className="font-semibold text-foreground">Obtížnost</h3>
              <div className="flex gap-2">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`flex-1 p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                      selectedDifficulty === d
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {d === 'easy' ? '🟢 Lehká' : d === 'medium' ? '🟡 Střední' : '🔴 Těžká'}
                  </button>
                ))}
              </div>

              <Button
                onClick={startGame}
                disabled={
                  !selectedCategory ||
                  mp.players.length < 2 ||
                  generating ||
                  (selectedCategory.id === 'custom' && customTopic.trim().length < 3)
                }
                className="w-full h-12 text-lg"
              >
                {generating ? '⏳ Generuji otázky...' : '🚀 Zahájit hru'}
              </Button>
            </div>
          )}

          {!mp.isHost && (
            <div className="text-center text-muted-foreground">
              <p>Čekání na hostitele, až zahájí hru...</p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // === GAME ===
  if (screen === 'game' && mp.room && currentQuestion) {
    const questions = mp.room.questions as any[];
    const progress = ((mp.room.current_question_index + 1) / questions.length) * 100;
    const timePercent = (timeLeft / TIME_PER_QUESTION) * 100;
    const timerColor = timeLeft <= 5 ? 'text-destructive' : timeLeft <= 10 ? 'text-yellow-500' : 'text-primary';
    const timerBarColor = timeLeft <= 5 ? 'bg-destructive' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-primary';

    const getOptionClass = (index: number) => {
      const base = 'w-full text-left p-4 rounded-lg border-2 transition-all duration-300 font-medium';
      if (!answered) return `${base} border-border bg-muted/30 hover:border-primary cursor-pointer`;
      if (index === currentQuestion.correctIndex) return `${base} border-primary bg-primary/10 text-primary`;
      if (index === selectedAnswer && index !== currentQuestion.correctIndex) return `${base} border-destructive bg-destructive/10 text-destructive`;
      return `${base} border-border bg-muted/30 opacity-50`;
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span>{mp.room.category_icon}</span>
              <span className="font-semibold text-foreground text-sm">{mp.room.category_name}</span>
            </div>
            <span className="font-mono text-sm text-muted-foreground">
              {mp.room.current_question_index + 1}/{questions.length}
            </span>
          </div>

          {/* Player score chips */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {mp.players.map(p => (
              <div
                key={p.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 ${
                  p.current_answer !== null
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <span>{(p.username || '?').slice(0, 6)}</span>
                <span className="font-mono font-bold">{p.score}</span>
                {p.current_answer !== null && <span>✓</span>}
              </div>
            ))}
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

          {/* Progress bar */}
          <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mp.room.current_question_index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">{currentQuestion.question}</h2>
              <div className="space-y-3">
                {currentQuestion.options.map((option: string, i: number) => (
                  <motion.button
                    key={i}
                    whileHover={!answered ? { scale: 1.02 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(i)}
                    className={getOptionClass(i)}
                    disabled={answered}
                  >
                    <span className="text-muted-foreground mr-3 font-mono">{String.fromCharCode(65 + i)}</span>
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // === RESULTS ===
  if (screen === 'results' && mp.room) {
    const sorted = [...mp.players].sort((a, b) => b.score - a.score);
    const questions = mp.room.questions as any[];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-6"
        >
          <h1 className="text-3xl font-bold text-foreground text-center">🏆 Výsledky</h1>
          <p className="text-center text-muted-foreground">
            {mp.room.category_icon} {mp.room.category_name} • {questions.length} otázek
          </p>

          <div className="space-y-3">
            {sorted.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                  i === 0 ? 'border-yellow-500 bg-yellow-500/10' : 'border-border bg-muted/30'
                }`}
              >
                <span className="text-2xl font-bold w-8">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                </span>
                <Avatar className="h-10 w-10">
                  {p.avatar_url && <AvatarImage src={p.avatar_url} />}
                  <AvatarFallback>{(p.username || '?')[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{p.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary font-mono">{p.score}/{questions.length}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <Button onClick={handleLeave} variant="outline" className="w-full h-12 text-lg">
            🏠 Zpět domů
          </Button>
        </motion.div>
      </div>
    );
  }

  // Fallback loading
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      <p className="text-muted-foreground">Načítání...</p>
    </div>
  );
};

export default MultiplayerFlow;
