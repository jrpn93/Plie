import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  SafeAreaView,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/fonts';
import { mw, h, w } from '../../utils/RNSize';
import AppText from '../../components/AppText';
import { Event } from '../../api/api';
import { Images } from '../../constants/images';

type EventDetailsRouteParams = {
  event: Event;
};

type EventDetailsRouteProp = RouteProp<Record<string, EventDetailsRouteParams>, string>;

const formatPrice = (event: Event) => {
  if (event.event_price_from && event.event_price_to) {
    return `€${event.event_price_from} - €${event.event_price_to}`;
  }
  if (event.event_price_from) {
    return `€${event.event_price_from}`;
  }
  return 'Free';
};

const EventDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<EventDetailsRouteProp>();
  const event = route.params?.event;

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <AppText style={styles.emptyText}>Event details unavailable</AppText>
        </View>
      </SafeAreaView>
    );
  }

  const eventImage = event.event_profile_img || event.event_profile_pic;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <AppText style={styles.backArrow}>←</AppText>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          {eventImage ? (
            <Image source={{ uri: eventImage }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroFallback}>
              <AppText style={styles.heroFallbackText}>ADICTO</AppText>
            </View>
          )}

          <View style={styles.heroOverlay}>
            <Pressable style={styles.iconButton}>
              <Image source={Images.HEART_ICON} style={styles.icon} />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Image source={Images.SHARE} style={styles.icon} />
            </Pressable>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.pill}><AppText style={styles.pillText}>Workshop</AppText></View>
          <AppText style={styles.metaText}>{event.city}</AppText>
        </View>

        <AppText style={styles.eventTitle}>{event.event_name}</AppText>
        <AppText style={styles.priceText}>{formatPrice(event)}</AppText>

        <View style={styles.detailList}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconWrap}>
              <AppText style={styles.detailIcon}>🗓</AppText>
            </View>
            <View style={styles.detailValueWrap}>
              <AppText style={styles.label}>DATE & TIME</AppText>
              <AppText style={styles.detailValue}>
                {event.readable_from_date}
                {event.readable_to_date ? ` - ${event.readable_to_date}` : ''}
                {event.readable_to_date ? ' onwards' : ''}
              </AppText>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconWrap}>
              <AppText style={styles.detailIcon}>📍</AppText>
            </View>
            <View style={styles.detailValueWrap}>
              <AppText style={styles.label}>LOCATION</AppText>
              <AppText style={styles.detailValue}>{event.city}, {event.country}</AppText>
            </View>
          </View>
        </View>

        <View style={styles.mapBox}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80' }}
            style={styles.mapImage}
            resizeMode="cover"
          />
        </View>

        <AppText style={styles.sectionTitle}>About the Event</AppText>
        <AppText style={styles.descriptionText}>{event.description || 'No description available.'}</AppText>

        <View style={styles.organizerBox}>
          <View style={styles.organizerBadge}>
            <AppText style={styles.organizerBadgeText}>A</AppText>
          </View>
          <View style={styles.organizerMeta}>
            <AppText style={styles.organizerLabel}>ORGANIZED BY</AppText>
            <AppText style={styles.organizerName}>Adicto International</AppText>
            <AppText style={styles.organizerSubtext}>View Profile</AppText>
          </View>
        </View>

        <Pressable style={styles.ctaButton}>
          <AppText style={styles.ctaText}>Share tickets</AppText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: h(32),
  },
  topBar: {
    paddingHorizontal: mw(16),
    paddingTop: h(8),
    paddingBottom: h(8),
  },
  backButton: {
    width: w(28),
    height: h(28),
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: FontSize.fs18,
    color: Colors.text,
    fontWeight: '600',
  },
  heroCard: {
    marginHorizontal: mw(16),
    height: h(180),
    borderRadius: mw(12),
    overflow: 'hidden',
    backgroundColor: '#0d0d0d',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroFallbackText: {
    fontSize: FontSize.fs20,
    fontWeight: '900',
    color: '#D33A2F',
    letterSpacing: -2,
  },
  heroOverlay: {
    position: 'absolute',
    top: h(16),
    right: mw(16),
    flexDirection: 'row',
    gap: w(12),
  },
  iconButton: {
    width: w(36),
    height: h(36),
    borderRadius: mw(18),
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  icon: {
    width: w(18),
    height: h(18),
    tintColor: Colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: w(12),
    paddingHorizontal: mw(16),
    marginTop: h(14),
    marginBottom: h(6),
  },
  pill: {
    backgroundColor: Colors.borderLight,
    borderRadius: mw(10),
    paddingHorizontal: w(10),
    paddingVertical: h(6),
  },
  pillText: {
    fontSize: FontSize.fs3,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  metaText: {
    fontSize: FontSize.fs4,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  eventTitle: {
    fontSize: FontSize.fs18,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: mw(16),
    marginTop: h(4),
    lineHeight: h(36),
  },
  priceText: {
    fontSize: FontSize.fs12,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: mw(16),
    marginTop: h(4),
  },
  detailList: {
    marginTop: h(18),
    paddingHorizontal: mw(16),
    gap: h(16),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: w(12),
  },
  detailIconWrap: {
    width: w(28),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: h(2),
  },
  detailIcon: {
    fontSize: FontSize.fs8,
  },
  detailValueWrap: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.fs2,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: h(4),
  },
  detailValue: {
    fontSize: FontSize.fs7,
    color: Colors.text,
    fontWeight: '500',
    lineHeight: h(24),
  },
  mapBox: {
    marginHorizontal: mw(16),
    marginTop: h(18),
    borderRadius: mw(10),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#D5EAF5',
  },
  mapImage: {
    width: '100%',
    height: h(150),
  },
  sectionTitle: {
    fontSize: FontSize.fs12,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: mw(16),
    marginTop: h(20),
    marginBottom: h(10),
  },
  descriptionText: {
    fontSize: FontSize.fs7,
    color: Colors.text,
    lineHeight: h(28),
    paddingHorizontal: mw(16),
  },
  organizerBox: {
    marginHorizontal: mw(16),
    marginTop: h(20),
    backgroundColor: Colors.surface,
    borderRadius: mw(12),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: mw(14),
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerBadge: {
    width: w(42),
    height: h(42),
    borderRadius: mw(10),
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizerBadgeText: {
    fontSize: FontSize.fs10,
    color: Colors.white,
    fontWeight: '700',
  },
  organizerMeta: {
    marginLeft: mw(12),
    flex: 1,
  },
  organizerLabel: {
    fontSize: FontSize.fs2,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  organizerName: {
    fontSize: FontSize.fs10,
    fontWeight: '700',
    color: Colors.text,
    marginTop: h(2),
  },
  organizerSubtext: {
    fontSize: FontSize.fs5,
    color: Colors.textSecondary,
    marginTop: h(2),
  },
  ctaButton: {
    marginHorizontal: mw(16),
    marginTop: h(24),
    backgroundColor: '#111111',
    borderRadius: mw(12),
    paddingVertical: h(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: FontSize.fs7,
    color: Colors.white,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: mw(24),
  },
  emptyText: {
    fontSize: FontSize.fs7,
    color: Colors.textSecondary,
  },
});
