import React from 'react';
import { View, StyleSheet, TextInput, FlatList, ActivityIndicator, Image, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/fonts';
import { mw, h, w } from '../../utils/RNSize';
import AppText from '../../components/AppText';
import { Api, Event } from '../../api/api';
import EventCard from '../../components/EventCard';
import { Images } from '../../constants/images';
import { useFocusEffect } from '@react-navigation/native';

const SearchScreen: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<Event[]>([]);
  const [hasSearched, setHasSearched] = React.useState(false);
  const searchInputRef = React.useRef<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      searchInputRef.current?.focus();
    }, [])
  );

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    searchInputRef.current?.focus();
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await Api.getEvents();
      if (response.success && response.data.events) {
        const filtered = response.data.events.filter(
          (e) => e.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 e.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 e.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 e.danceStyles?.some((ds) => ds.ds_name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setResults(filtered);
      }
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavourite = (eventId: number) => {
    setResults((prev) =>
      prev.map((e) => (e.event_id === eventId ? { ...e, isFavorite: e.isFavorite ? 0 : 1 } : e))
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header_logo_container}>
        <Image source={Images.LOGO} style={styles.header_logo} />
      </View>
      <View style={styles.searchBarContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search events..."
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={Colors.placeholder}
          />
          {query && (
            <Pressable style={styles.clearButton} onPress={clearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Image source={Images.CROSS} style={styles.clearIcon} />
            </Pressable>
          )}
        </View>
        {isLoading && <ActivityIndicator size="small" color={Colors.primary} style={styles.loadingIndicator} />}
      </View>
      {hasSearched && results.length === 0 && !isLoading ? (
        <View style={styles.emptyState}>
          <AppText style={styles.emptyText}>No events found</AppText>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.event_date_id)}
          renderItem={({ item }) => <EventCard event={item} onFavourite={handleFavourite} variant="compact" />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !hasSearched ? (
              <View style={styles.emptyState}>
                <AppText style={styles.emptyText}>Search for events...</AppText>
              </View>
            ) : undefined
          }
        />
      )}
    </View>
  );
};

export default SearchScreen;

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
  searchBarContainer: {
    paddingHorizontal: mw(16),
    paddingVertical: h(12),
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: h(34),
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: mw(12),
    paddingHorizontal: mw(16),
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.fs6,
    color: Colors.text,
  },
  clearButton: {
    padding: mw(4),
    marginLeft: mw(8),
  },
  clearIcon: {
    width: mw(18),
    height: h(18),
    resizeMode: 'contain',
    tintColor: Colors.textMuted,
  },
  loadingIndicator: {
    marginLeft: w(8),
  },
  listContent: {
    padding: mw(16),
    gap: h(12),
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
});