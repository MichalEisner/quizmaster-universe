DROP FUNCTION IF EXISTS public.get_leaderboard(text);

CREATE OR REPLACE FUNCTION public.get_leaderboard(filter_category_id text DEFAULT NULL::text)
 RETURNS TABLE(user_id uuid, username text, total_score bigint, quiz_count bigint, avatar_url text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT
    qh.user_id,
    p.username,
    SUM(qh.score)::bigint AS total_score,
    COUNT(*)::bigint AS quiz_count,
    p.avatar_url
  FROM public.quiz_history qh
  JOIN public.profiles p ON p.id = qh.user_id
  WHERE (filter_category_id IS NULL OR qh.category_id = filter_category_id)
  GROUP BY qh.user_id, p.username, p.avatar_url
  ORDER BY total_score DESC
  LIMIT 50;
$$;