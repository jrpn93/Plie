import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/fonts';
import { mw, h, w } from '../../utils/RNSize';
import AppText from '../../components/AppText';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  isFavourite: boolean;
}

const mockFavourites: Event[] = [
  { id: '2', title: 'Tech Conference 2024', date: 'Sep 10-12, 2024', location: 'Moscone Center, SF', image: '', isFavourite: true },
  { id: '5', title: 'Startup Networking Event', date: 'Dec 3, 2024', location: 'WeWork, Austin', image: '', isFavourite: true },
];

const EventCard: React.FC<{ event: Event; onRemove: (id: string) => void }> = ({ event, onRemove }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <AppText style={styles.cardTitle}>{event.title}</AppText>
      <Pressable onPress={() => onRemove(event.id)} style={styles.removeButton}>
        <AppText style={styles.removeButtonText}>Remove</AppText>
      </Pressable>
    </View>
    <View style={styles.cardDetails}>
      <AppText style={styles.detailText}>📅 {event.date}</AppText>
      <AppText style={styles.detailText}>📍 {event.location}</AppText>
    </View>
  </View>
);

const FavouritesScreen: React.FC = () => {
  const [favourites, setFavourites] = React.useState<Event[]>(mockFavourites);

  const handleRemove = (id: string) => {
    setFavourites((prev) => prev.filter((e) => e.id !== id));
  };

  if (favourites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <AppText style={styles.emptyTitle}>No Favourites Yet</AppText>
        <AppText style={styles.emptySubtitle}>
          Events you mark as favourite will appear here.
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favourites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} onRemove={handleRemove} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default FavouritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: mw(32),
  },
  emptyTitle: {
    fontSize: FontSize.fs10,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: h(8),
  },
  emptySubtitle: {
    fontSize: FontSize.fs5,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: h(22),
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
  removeButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: mw(8),
    paddingVertical: h(6),
    paddingHorizontal: mw(12),
  },
  removeButtonText: {
    fontSize: FontSize.fs3,
    fontWeight: '600',
    color: Colors.error,
  },
  cardDetails: {
    gap: h(4),
  },
  detailText: {
    fontSize: FontSize.fs3,
    color: Colors.textSecondary,
  },
});