import { useMemo } from 'react';
import { useEvents } from '@/api/tanstack/events';
import { useUserProfile } from '@/api/tanstack/user';
import { useUserFavorites } from '@/api/tanstack/favorites';
import { useAppSelector } from '@/lib/store';
import { Event as ApiEvent } from '@/api/types';

export function useHomeData() {
  const { data: events, isLoading: eventsLoading, error: eventsError } = useEvents();
  const { data: user, isLoading: userLoading, error: userError } = useUserProfile();
  const { data: favorites, favoriteIds, isLoading: favoritesLoading, error: favoritesError } = useUserFavorites(user?.userId);

  const scrollEnabled = useAppSelector(state => state.ui.scrollEnabled);

  const cards = useMemo(() => {
    if (!events) return [];
    
    return (events as ApiEvent[]).map((event: ApiEvent) => ({
      id: event.eventId,
      title: event.name,
      time: new Date(event.startTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      location: event.location,
      pts: event.points,
      description: event.description,
    }));
  }, [events]);

  const flaggedCards = useMemo(() => {
    return cards.filter((c) => favoriteIds.has(c.id));
  }, [cards, favoriteIds]);

  const isLoading = useMemo(() => {
    return eventsLoading || userLoading || favoritesLoading;
  }, [eventsLoading, userLoading, favoritesLoading]);

  const error = useMemo(() => {
    return eventsError || userError || favoritesError;
  }, [eventsError, userError, favoritesError]);

  const hasUserRole = useMemo(() => {
    return (user?.roles ?? []).some(r => r.toUpperCase() === 'USER');
  }, [user?.roles]);

  return {
    cards,
    flaggedCards,
    user,
    favorites,
    favoriteIds,
    
    isLoading,
    eventsLoading,
    userLoading,
    favoritesLoading,
    
    error,
    eventsError,
    userError,
    favoritesError,
    
    hasUserRole,
    scrollEnabled,
    
    totalEvents: cards.length,
    totalFavorites: flaggedCards.length,
  };
}
