import { Question } from '@/data/questions';
import { Difficulty } from '@/components/DifficultySelect';

export interface QuizAnswer {
  question: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number;
}

export interface QuizHistoryEntry {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  difficulty: Difficulty;
  score: number;
  total: number;
  answers: QuizAnswer[];
  date: string;
}

const STORAGE_KEY = 'quiz-history';

export function getHistory(): QuizHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveQuiz(entry: Omit<QuizHistoryEntry, 'id' | 'date'>): QuizHistoryEntry {
  const full: QuizHistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  const history = getHistory();
  history.unshift(full);
  // Keep last 50 entries
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
  return full;
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
