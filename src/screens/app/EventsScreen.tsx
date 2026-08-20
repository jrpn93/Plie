import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/fonts';
import { mw, h, w } from '../../utils/RNSize';
import AppText from '../../components/AppText';
import { Api, Event } from '../../api/api';
import EventCard from '../../components/EventCard';
import { useAppSelector } from '../../hooks/useRedux';
import { Images } from '../../constants/images';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants/routes';

const SkeletonCard: React.FC = () => (
  <View style={styles.cardRow}>
    <View style={styles.skeletonImage} />
    <View style={styles.skeletonMeta}>
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
      <View style={[styles.skeletonLine, styles.skeletonLineSmall]} />
    </View>
  </View>
);

const EventsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAppSelector(state => state.auth);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const userName = user?.usr_fname;

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
    setEvents(prev =>
      prev.map(e =>
        e.event_id === eventId ? { ...e, isFavorite: e.isFavorite ? 0 : 1 } : e,
      ),
    );
  };

  const onRefresh = () => {
    fetchEvents(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header_logo_container}>
        <Image source={Images.LOGO} style={styles.header_logo} />
      </View>
      <View style={styles.header}>
        <AppText style={styles.greeting}>Hello {userName}!</AppText>
        <AppText style={styles.subtitle}>
          Are you ready to dance? Explore today&apos;s movements.
        </AppText>
        <View style={styles.searchBarContainer}>
          <Image source={Images.SEARCH_ICON} style={styles.searchIcon} />
          <AppText style={styles.searchPlaceholder}>Search events...</AppText>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <AppText style={styles.errorText}>{error}</AppText>
        </View>
      )}

      {isLoading ? (
        <FlatList
          data={Array.from({ length: 4 })}
          keyExtractor={(_, i) => `skeleton-${i}`}
          renderItem={() => <SkeletonCard />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => String(item.event_date_id)}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onFavourite={handleFavourite}
              variant="default"
              onPress={(event) => navigation.navigate(ROUTES.EVENT_DETAILS, { event })}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <AppText style={styles.emptyText}>No events available</AppText>
            </View>
          }
        />
      )}
    </View>
  );
};

export default EventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: mw(18),
    paddingTop: h(18),
    paddingBottom: h(8),
  },
  greeting: {
    fontSize: FontSize.fs14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: h(4),
  },
  subtitle: {
    fontSize: FontSize.fs7,
    color: Colors.text,
    fontWeight: '400',
    marginBottom: h(14),
    maxWidth: '92%',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: h(42),
    backgroundColor: Colors.background,
    borderRadius: mw(18),
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: mw(14),
    gap: w(8),
  },
  searchIcon: {
    height: h(16),
    width: w(16),
    marginTop: h(2),
  },
  searchPlaceholder: {
    fontSize: FontSize.fs7,
    color: Colors.placeholder,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: mw(18),
    paddingBottom: h(24),
    gap: h(12),
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: mw(18),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: mw(10),
    gap: w(12),
  },
  skeletonImage: {
    width: w(118),
    height: h(102),
    borderRadius: mw(12),
    backgroundColor: Colors.borderLight,
  },
  skeletonMeta: {
    flex: 1,
    gap: h(8),
    paddingVertical: h(8),
  },
  skeletonLine: {
    height: h(16),
    backgroundColor: Colors.borderLight,
    borderRadius: mw(6),
  },
  skeletonLineShort: {
    width: '70%',
  },
  skeletonLineSmall: {
    width: '45%',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: h(36),
  },
  emptyText: {
    fontSize: FontSize.fs6,
    color: Colors.textMuted,
  },
  errorContainer: {
    padding: mw(16),
    backgroundColor: Colors.error + '15',
    borderRadius: mw(8),
    marginHorizontal: mw(18),
    marginBottom: h(12),
  },
  errorText: {
    fontSize: FontSize.fs4,
    color: Colors.error,
    textAlign: 'center',
  },
  header_logo: {
    height: h(20),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  header_logo_container: {
    backgroundColor: Colors.background,
    paddingVertical: h(8),
  },
});
