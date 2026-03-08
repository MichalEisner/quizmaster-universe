import { Difficulty } from '@/components/DifficultySelect';
import { supabase } from '@/integrations/supabase/client';

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

// Local storage helpers (for non-logged-in users)
export function getLocalHistory(): QuizHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalQuiz(entry: Omit<QuizHistoryEntry, 'id' | 'date'>): QuizHistoryEntry {
  const full: QuizHistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  const history = getLocalHistory();
  history.unshift(full);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
  return full;
}

export function clearLocalHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

// Database helpers (for logged-in users)
export async function getDbHistory(): Promise<QuizHistoryEntry[]> {
  const { data, error } = await supabase
    .from('quiz_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    categoryIcon: row.category_icon,
    difficulty: row.difficulty as Difficulty,
    score: row.score,
    total: row.total,
    answers: row.answers as QuizAnswer[],
    date: row.created_at,
  }));
}

export async function saveDbQuiz(
  userId: string,
  entry: Omit<QuizHistoryEntry, 'id' | 'date'>
): Promise<QuizHistoryEntry | null> {
  const { data, error } = await supabase
    .from('quiz_history')
    .insert({
      user_id: userId,
      category_id: entry.categoryId,
      category_name: entry.categoryName,
      category_icon: entry.categoryIcon,
      difficulty: entry.difficulty,
      score: entry.score,
      total: entry.total,
      answers: entry.answers as any,
    })
    .select()
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    categoryId: data.category_id,
    categoryName: data.category_name,
    categoryIcon: data.category_icon,
    difficulty: data.difficulty as Difficulty,
    score: data.score,
    total: data.total,
    answers: data.answers as unknown as QuizAnswer[],
    date: data.created_at,
  };
}

export async function clearDbHistory(userId: string) {
  await supabase.from('quiz_history').delete().eq('user_id', userId);
}
