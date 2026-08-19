import React from 'react';
import { View, StyleSheet, FlatList, Pressable, RefreshControl } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/fonts';
import { mw, h, w } from '../../utils/RNSize';
import AppText from '../../components/AppText';
import { Api, Event } from '../../api/api';

const SkeletonCard: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.skeletonLine} />
    <View style={styles.skeletonLineShort} />
    <View style={styles.skeletonLineShort} />
  </View>
);

const EventCard: React.FC<{ event: Event; onFavourite: (eventId: number) => void }> = ({ event, onFavourite }) => (
  <View style={styles.card}>
    {event.event_profile_img && (
      <View style={styles.eventImageContainer}>
        <View style={styles.eventImage}>
          {/* Image would go here */}
        </View>
      </View>
    )}
    <View style={styles.cardHeader}>
      <AppText style={styles.cardTitle}>{event.event_name}</AppText>
      <Pressable onPress={() => onFavourite(event.event_id)}>
        <AppText style={event.isFavorite ? [styles.favButton, styles.favButtonActive] : styles.favButton}>
          {event.isFavorite ? '♥' : '♡'}
        </AppText>
      </Pressable>
    </View>
    <View style={styles.cardDetails}>
      <AppText style={styles.detailText}>📅 {event.readable_from_date}{event.readable_to_date ? ` - ${event.readable_to_date}` : ''}</AppText>
      <AppText style={styles.detailText}>📍 {event.city}, {event.country}</AppText>
      {event.danceStyles && event.danceStyles.length > 0 && (
        <AppText style={styles.detailText}>
          {event.danceStyles.map((ds) => ds.ds_name).join(', ')}
        </AppText>
      )}
    </View>
  </View>
);

const EventsScreen: React.FC = () => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchEvents = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);
    try {
      const response = await Api.getEvents();
      if (response.success && response.data.events) {
        setEvents(response.data.events);
      }
    } catch {
      setError('Failed to load events');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const handleFavourite = (eventId: number) => {
    setEvents((prev) =>
      prev.map((e) => (e.event_id === eventId ? { ...e, isFavorite: e.isFavorite ? 0 : 1 } : e))
    );
  };

  const onRefresh = () => {
    fetchEvents(true);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <FlatList
          data={Array.from({ length: 5 })}
          keyExtractor={(_, i) => `skeleton-${i}`}
          renderItem={() => <SkeletonCard />}
          contentContainerStyle={styles.listContent}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <AppText style={styles.errorText}>{error}</AppText>
        </View>
      )}
      <FlatList
        data={events}
        keyExtractor={(item) => String(item.event_date_id)}
        renderItem={({ item }) => <EventCard event={item} onFavourite={handleFavourite} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AppText style={styles.emptyText}>No events available</AppText>
          </View>
        }
      />
    </View>
  );
};

export default EventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: mw(16),
    gap: h(12),
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: mw(16),
    padding: mw(16),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: h(1) },
    shadowOpacity: 0.05,
    shadowRadius: mw(4),
    elevation: 1,
  },
  eventImageContainer: {
    width: '100%',
    height: h(160),
    borderRadius: mw(12),
    marginBottom: h(12),
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  skeletonLine: {
    height: h(20),
    backgroundColor: Colors.borderLight,
    borderRadius: mw(4),
    marginBottom: h(8),
  },
  skeletonLineShort: {
    height: h(16),
    backgroundColor: Colors.borderLight,
    borderRadius: mw(4),
    marginBottom: h(8),
    width: '60%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: h(8),
  },
  cardTitle: {
    fontSize: FontSize.fs7,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: w(8),
  },
  favButton: {
    fontSize: FontSize.fs8,
    color: Colors.textMuted,
  },
  favButtonActive: {
    color: Colors.error,
  },
  cardDetails: {
    gap: h(4),
  },
  detailText: {
    fontSize: FontSize.fs3,
    color: Colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: mw(32),
  },
  emptyText: {
    fontSize: FontSize.fs6,
    color: Colors.textMuted,
  },
  errorContainer: {
    padding: mw(16),
    backgroundColor: Colors.error + '15',
    borderRadius: mw(8),
    margin: mw(16),
  },
  errorText: {
    fontSize: FontSize.fs4,
    color: Colors.error,
    textAlign: 'center',
  },
});