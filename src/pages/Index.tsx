import { useState } from 'react';
import CategorySelect from '@/components/CategorySelect';
import DifficultySelect, { Difficulty } from '@/components/DifficultySelect';
import QuizScreen from '@/components/QuizScreen';
import ResultScreen from '@/components/ResultScreen';
import HistoryScreen from '@/components/HistoryScreen';
import ReviewScreen from '@/components/ReviewScreen';
import { CategoryInfo, generateQuiz, Question } from '@/data/questions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { saveQuiz, QuizAnswer, QuizHistoryEntry } from '@/lib/quizHistory';

type Screen = 'categories' | 'difficulty' | 'quiz' | 'results' | 'loading' | 'history' | 'review';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('categories');
  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState({ score: 0, total: 0 });
  const [reviewEntry, setReviewEntry] = useState<QuizHistoryEntry | null>(null);
  const [lastAnswers, setLastAnswers] = useState<QuizAnswer[]>([]);

  const selectCategory = (cat: CategoryInfo) => {
    setCategory(cat);
    setScreen('difficulty');
  };

  const startQuiz = async (diff: Difficulty) => {
    setDifficulty(diff);
    setScreen('loading');

    try {
      const { data, error } = await supabase.functions.invoke('generate-questions', {
        body: { category: category!.id, count: 10, difficulty: diff },
      });

      if (error) throw error;

      if (data?.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
        setScreen('quiz');
      } else {
        throw new Error('Invalid response');
      }
    } catch (e) {
      console.error('AI generation failed, using fallback:', e);
      toast.error('AI generování selhalo, používám záložní otázky');
      setQuestions(generateQuiz(category!.id, 10));
      setScreen('quiz');
    }
  };

  const finishQuiz = (score: number, total: number, answers: QuizAnswer[]) => {
    setResult({ score, total });
    setLastAnswers(answers);

    if (category) {
      const saved = saveQuiz({
        categoryId: category.id,
        categoryName: category.name,
        categoryIcon: category.icon,
        difficulty,
        score,
        total,
        answers,
      });
      setReviewEntry(saved);
    }

    setScreen('results');
  };

  const restart = async () => {
    if (category) await startQuiz(difficulty);
  };

  return (
    <>
      {screen === 'categories' && (
        <CategorySelect onSelect={selectCategory} onHistory={() => setScreen('history')} />
      )}
      {screen === 'difficulty' && category && (
        <DifficultySelect
          category={category}
          onSelect={startQuiz}
          onBack={() => setScreen('categories')}
        />
      )}
      {screen === 'loading' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-lg">AI generuje otázky...</p>
        </div>
      )}
      {screen === 'quiz' && category && (
        <QuizScreen
          questions={questions}
          categoryName={category.name}
          categoryIcon={category.icon}
          onFinish={finishQuiz}
          onBack={() => setScreen('categories')}
        />
      )}
      {screen === 'results' && category && (
        <ResultScreen
          score={result.score}
          total={result.total}
          categoryName={category.name}
          categoryIcon={category.icon}
          onRestart={restart}
          onHome={() => setScreen('categories')}
          onReview={reviewEntry ? () => { setScreen('review'); } : undefined}
        />
      )}
      {screen === 'history' && (
        <HistoryScreen
          onBack={() => setScreen('categories')}
          onReview={(entry) => { setReviewEntry(entry); setScreen('review'); }}
        />
      )}
      {screen === 'review' && reviewEntry && (
        <ReviewScreen
          entry={reviewEntry}
          onBack={() => setScreen('history')}
        />
      )}
    </>
  );
};

export default Index;
