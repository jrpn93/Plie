import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/fonts';
import { mw, h } from '../../utils/RNSize';
import AppText from '../../components/AppText';
import { Event } from '../../api/api';
import EventCard from '../../components/EventCard';
import { Images } from '../../constants/images';

const mockFavourites: Event[] = [
  {
    event_id: 2,
    event_name: 'Tech Conference 2024',
    description: 'Annual tech conference',
    event_profile_pic: '',
    event_profile_img: '',
    event_url: '',
    event_price_from: 100,
    event_price_to: 500,
    readable_from_date: 'Sep 10, 2024',
    readable_to_date: 'Sep 12, 2024',
    isFavorite: 1,
    city: 'San Francisco',
    country: 'USA',
    keywords: ['tech', 'conference'],
    danceStyles: [],
    event_date_id: 2,
  },
  {
    event_id: 5,
    event_name: 'Startup Networking Event',
    description: 'Networking for startups',
    event_profile_pic: '',
    event_profile_img: '',
    event_url: '',
    event_price_from: 0,
    event_price_to: 0,
    readable_from_date: 'Dec 3, 2024',
    readable_to_date: '',
    isFavorite: 1,
    city: 'Austin',
    country: 'USA',
    keywords: ['startup', 'networking'],
    danceStyles: [],
    event_date_id: 5,
  },
];

const FavouritesScreen: React.FC = () => {
  const [favourites, setFavourites] = React.useState<Event[]>(mockFavourites);

  const handleRemove = (eventId: number) => {
    setFavourites((prev) => prev.filter((e) => e.event_id !== eventId));
  };

  if (favourites.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header_logo_container}>
          <Image source={Images.LOGO} style={styles.header_logo} />
        </View>
        <View style={styles.emptyContainer}>
          <AppText style={styles.emptyTitle}>No Favourites Yet</AppText>
          <AppText style={styles.emptySubtitle}>
            Events you mark as favourite will appear here.
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header_logo_container}>
        <Image source={Images.LOGO} style={styles.header_logo} />
      </View>
      <FlatList
        data={favourites}
        keyExtractor={(item) => String(item.event_date_id)}
        renderItem={({ item }) => <EventCard event={item} onFavourite={() => {}} variant="compact" onRemove={handleRemove} />}
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
  header_logo: {
    height: h(20),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  header_logo_container: {
    backgroundColor: Colors.background,
    paddingVertical: h(8),
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
});