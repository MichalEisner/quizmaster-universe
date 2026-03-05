import { useState } from 'react';
import CategorySelect from '@/components/CategorySelect';
import QuizScreen from '@/components/QuizScreen';
import ResultScreen from '@/components/ResultScreen';
import { CategoryInfo, generateQuiz, Question } from '@/data/questions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Screen = 'categories' | 'quiz' | 'results' | 'loading';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('categories');
  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState({ score: 0, total: 0 });

  const startQuiz = async (cat: CategoryInfo) => {
    setCategory(cat);
    setScreen('loading');

    try {
      const { data, error } = await supabase.functions.invoke('generate-questions', {
        body: { category: cat.id, count: 10 },
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
      setQuestions(generateQuiz(cat.id, 10));
      setScreen('quiz');
    }
  };

  const finishQuiz = (score: number, total: number) => {
    setResult({ score, total });
    setScreen('results');
  };

  const restart = async () => {
    if (category) await startQuiz(category);
  };

  return (
    <>
      {screen === 'categories' && <CategorySelect onSelect={startQuiz} />}
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
        />
      )}
    </>
  );
};

export default Index;
