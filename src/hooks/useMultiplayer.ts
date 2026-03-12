import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface MultiplayerRoom {
  id: string;
  code: string;
  host_id: string;
  category_id: string | null;
  category_name: string | null;
  category_icon: string | null;
  difficulty: string;
  custom_topic: string | null;
  status: string;
  questions: any[];
  current_question_index: number;
  question_started_at: string | null;
  max_players: number;
  is_matchmaking: boolean;
  created_at: string;
}

export interface MultiplayerPlayer {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  score: number;
  current_answer: number | null;
  answers: any[];
  joined_at: string;
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function useMultiplayer() {
  const { user, username, avatarUrl } = useAuth();
  const [room, setRoom] = useState<MultiplayerRoom | null>(null);
  const [players, setPlayers] = useState<MultiplayerPlayer[]>([]);
  const [loading, setLoading] = useState(false);

  // Subscribe to room and players changes
  useEffect(() => {
    if (!room?.id) return;

    const channel = supabase
      .channel(`mp-${room.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'multiplayer_rooms',
        filter: `id=eq.${room.id}`,
      }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setRoom(prev => prev ? { ...prev, ...payload.new } as MultiplayerRoom : null);
        } else if (payload.eventType === 'DELETE') {
          setRoom(null);
          setPlayers([]);
          toast.info('Místnost byla zrušena');
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'multiplayer_players',
        filter: `room_id=eq.${room.id}`,
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPlayers(prev => [...prev, payload.new as MultiplayerPlayer]);
        } else if (payload.eventType === 'UPDATE') {
          setPlayers(prev => prev.map(p => p.id === (payload.new as any).id ? payload.new as MultiplayerPlayer : p));
        } else if (payload.eventType === 'DELETE') {
          setPlayers(prev => prev.filter(p => p.id !== (payload.old as any).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [room?.id]);

  const createRoom = useCallback(async (matchmaking = false) => {
    if (!user) return null;
    setLoading(true);
    try {
      const code = generateRoomCode();
      const { data: roomData, error: roomError } = await (supabase
        .from('multiplayer_rooms') as any)
        .insert({ code, host_id: user.id, is_matchmaking: matchmaking })
        .select()
        .single();
      if (roomError) throw roomError;

      await (supabase.from('multiplayer_players') as any)
        .insert({ room_id: roomData.id, user_id: user.id, username: username || 'Hráč', avatar_url: avatarUrl || null });

      const { data: playersData } = await (supabase.from('multiplayer_players') as any)
        .select('*')
        .eq('room_id', roomData.id);

      setRoom(roomData as MultiplayerRoom);
      setPlayers((playersData || []) as MultiplayerPlayer[]);
      return roomData;
    } catch (e) {
      toast.error('Nepodařilo se vytvořit místnost');
      console.error(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, username, avatarUrl]);

  const joinRoom = useCallback(async (code: string) => {
    if (!user) return null;
    setLoading(true);
    try {
      const { data: roomData, error: roomError } = await (supabase
        .from('multiplayer_rooms') as any)
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('status', 'waiting')
        .single();
      if (roomError || !roomData) {
        toast.error('Místnost nenalezena nebo už hra začala');
        return null;
      }

      const { data: existingPlayers } = await (supabase.from('multiplayer_players') as any)
        .select('*')
        .eq('room_id', roomData.id);

      if ((existingPlayers?.length || 0) >= roomData.max_players) {
        toast.error('Místnost je plná');
        return null;
      }

      if (!existingPlayers?.find((p: any) => p.user_id === user.id)) {
        const { error } = await (supabase.from('multiplayer_players') as any)
          .insert({ room_id: roomData.id, user_id: user.id, username: username || 'Hráč', avatar_url: avatarUrl || null });
        if (error) throw error;
      }

      const { data: allPlayers } = await (supabase.from('multiplayer_players') as any)
        .select('*')
        .eq('room_id', roomData.id);

      setRoom(roomData as MultiplayerRoom);
      setPlayers((allPlayers || []) as MultiplayerPlayer[]);
      return roomData;
    } catch (e) {
      toast.error('Nepodařilo se připojit');
      console.error(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, username, avatarUrl]);

  const findMatch = useCallback(async () => {
    if (!user) return null;
    setLoading(true);
    try {
      const { data: rooms } = await (supabase.from('multiplayer_rooms') as any)
        .select('*')
        .eq('status', 'waiting')
        .eq('is_matchmaking', true)
        .order('created_at', { ascending: true })
        .limit(10);

      for (const r of rooms || []) {
        const { data: ps } = await (supabase.from('multiplayer_players') as any)
          .select('*')
          .eq('room_id', r.id);
        if ((ps?.length || 0) < r.max_players && !ps?.find((p: any) => p.user_id === user.id)) {
          const { error } = await (supabase.from('multiplayer_players') as any)
            .insert({ room_id: r.id, user_id: user.id, username: username || 'Hráč', avatar_url: avatarUrl || null });
          if (!error) {
            const { data: allPlayers } = await (supabase.from('multiplayer_players') as any)
              .select('*')
              .eq('room_id', r.id);
            setRoom(r as MultiplayerRoom);
            setPlayers((allPlayers || []) as MultiplayerPlayer[]);
            return r;
          }
        }
      }
      // No room found, create one
      const result = await createRoom(true);
      return result;
    } catch (e) {
      toast.error('Nepodařilo se najít hru');
      console.error(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, username, avatarUrl, createRoom]);

  const updateRoom = useCallback(async (updates: Record<string, any>) => {
    if (!room) return;
    await (supabase.from('multiplayer_rooms') as any).update(updates).eq('id', room.id);
  }, [room]);

  const submitAnswer = useCallback(async (questionIndex: number, answerIndex: number, correct: boolean) => {
    if (!room || !user) return;
    const me = players.find(p => p.user_id === user.id);
    if (!me) return;

    const newAnswers = [...(me.answers as any[] || []), { questionIndex, answerIndex, correct }];
    const newScore = correct ? me.score + 1 : me.score;
    await (supabase.from('multiplayer_players') as any)
      .update({ current_answer: answerIndex, answers: newAnswers, score: newScore })
      .eq('id', me.id);
  }, [room, user, players]);

  const advanceQuestion = useCallback(async () => {
    if (!room) return;
    const nextIndex = room.current_question_index + 1;
    if (nextIndex >= (room.questions as any[]).length) {
      await updateRoom({ status: 'finished' });
    } else {
      await updateRoom({
        current_question_index: nextIndex,
        question_started_at: new Date().toISOString(),
      });
    }
  }, [room, updateRoom]);

  const resetCurrentAnswer = useCallback(async () => {
    if (!user) return;
    const me = players.find(p => p.user_id === user.id);
    if (!me) return;
    await (supabase.from('multiplayer_players') as any)
      .update({ current_answer: null })
      .eq('id', me.id);
  }, [user, players]);

  const leaveRoom = useCallback(async () => {
    if (!room || !user) return;
    if (room.host_id === user.id) {
      await (supabase.from('multiplayer_rooms') as any).delete().eq('id', room.id);
    } else {
      await (supabase.from('multiplayer_players') as any).delete().eq('room_id', room.id).eq('user_id', user.id);
    }
    setRoom(null);
    setPlayers([]);
  }, [room, user]);

  const isHost = user?.id === room?.host_id;

  return {
    room, players, loading, isHost,
    createRoom, joinRoom, findMatch, updateRoom,
    submitAnswer, advanceQuestion, resetCurrentAnswer, leaveRoom,
  };
}
