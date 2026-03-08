
CREATE OR REPLACE FUNCTION public.get_leaderboard(filter_category_id text DEFAULT NULL)
RETURNS TABLE(user_id uuid, username text, total_score bigint, quiz_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    qh.user_id,
    p.username,
    SUM(qh.score)::bigint AS total_score,
    COUNT(*)::bigint AS quiz_count
  FROM public.quiz_history qh
  JOIN public.profiles p ON p.id = qh.user_id
  WHERE (filter_category_id IS NULL OR qh.category_id = filter_category_id)
  GROUP BY qh.user_id, p.username
  ORDER BY total_score DESC
  LIMIT 50;
$$;
