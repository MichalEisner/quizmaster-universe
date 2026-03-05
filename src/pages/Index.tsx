import { useState, useCallback } from 'react';
import CategorySelect from '@/components/CategorySelect';
import QuizScreen from '@/components/QuizScreen';
import ResultScreen from '@/components/ResultScreen';
import { CategoryInfo, generateQuiz, Question } from '@/data/questions';

type Screen = 'categories' | 'quiz' | 'results';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('categories');
  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState({ score: 0, total: 0 });

  const startQuiz = (cat: CategoryInfo) => {
    setCategory(cat);
    setQuestions(generateQuiz(cat.id, 10));
    setScreen('quiz');
  };

  const finishQuiz = (score: number, total: number) => {
    setResult({ score, total });
    setScreen('results');
  };

  const restart = () => {
    if (category) startQuiz(category);
  };

  return (
    <>
      {screen === 'categories' && <CategorySelect onSelect={startQuiz} />}
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
