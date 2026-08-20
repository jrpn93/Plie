import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize } from '../constants/fonts';
import { mw, h, w } from '../utils/RNSize';
import AppText from './AppText';
import { Event } from '../api/api';
import { Images } from '../constants/images';

const formatPrice = (event: Event) => {
  if (event.event_price_from && event.event_price_to) {
    return `€${event.event_price_from} - €${event.event_price_to}`;
  }
  if (event.event_price_from) {
    return `€${event.event_price_from}`;
  }
  return 'Free';
};

const getEventImage = (event: Event): string | null => {
  return event.event_profile_img || event.event_profile_pic || null;
};

interface EventCardProps {
  event: Event;
  onFavourite: (eventId: number) => void;
  variant?: 'default' | 'compact';
  onRemove?: (eventId: number) => void;
  onShare?: (eventId: number) => void;
  onPress?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onFavourite,
  variant = 'default',
  onRemove,
  onShare,
  onPress,
}) => {
  const [eventImage, setEventImage] = useState<string | null>(
    getEventImage(event),
  );

  if (variant === 'compact') {
    return (
      <Pressable onPress={() => onPress?.(event)}>
        <View style={styles.cardCompact}>
          <View style={styles.cardHeaderCompact}>
            <AppText style={styles.cardTitleCompact}>
              {event.event_name}
            </AppText>
            {onRemove ? (
              <Pressable
                onPress={() => onRemove(event.event_id)}
                style={styles.removeButtonCompact}
              >
                <AppText style={styles.removeButtonTextCompact}>Remove</AppText>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => onFavourite(event.event_id)}
                style={styles.favButtonWrapCompact}
              >
                <Image
                  source={
                    event.isFavorite
                      ? Images.HEART_FILLED_ICON
                      : Images.HEART_ICON
                  }
                  style={styles.favIconCompact}
                />
              </Pressable>
            )}
          </View>
          <View style={styles.cardDetailsCompact}>
            <View style={styles.detailTextCompactRow}>
              <Image
                source={Images.CALENDAR}
                style={styles.detailIconCompact}
              />
              <AppText style={styles.detailTextCompact}>
                {event.readable_from_date}
                {event.readable_to_date ? ` - ${event.readable_to_date}` : ''}
              </AppText>
            </View>
            <View style={styles.detailTextCompactRow}>
              <Image source={Images.MAP_PIN} style={styles.detailIconCompact} />
              <AppText style={styles.detailTextCompact}>
                {event.city}, {event.country}
              </AppText>
            </View>
            {event.danceStyles && event.danceStyles.length > 0 && (
              <AppText style={styles.detailTextCompact}>
                {event.danceStyles.map(ds => ds.ds_name).join(', ')}
              </AppText>
            )}
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={() => onPress?.(event)}>
      <View style={styles.cardRow}>
        <View style={styles.eventImageContainer}>
          {eventImage ? (
            <Image
              defaultSource={Images.IMAGE_PREVIEW}
              source={{ uri: eventImage }}
              style={styles.eventImage}
              resizeMode="cover"
              onError={() => setEventImage(null)}
            />
          ) : (
            <Image
              source={Images.IMAGE_PREVIEW}
              style={styles.eventImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.imageOverlayButtons}>
            <Pressable
              onPress={() => onShare?.(event.event_id)}
              style={styles.overlayButton}
            >
              <Image source={Images.SHARE} style={styles.overlayIcon} />
            </Pressable>
            <Pressable
              onPress={() => onFavourite(event.event_id)}
              style={styles.overlayButton}
            >
              <Image
                source={
                  event.isFavorite
                    ? Images.HEART_FILLED_ICON
                    : Images.HEART_ICON
                }
                style={styles.overlayIcon}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.tagRow}>
            <View style={styles.tagChip}>
              <AppText style={styles.tagText}>{event.city}</AppText>
            </View>
            <AppText style={styles.cityText}>{event.country}</AppText>
          </View>

          <AppText style={styles.cardTitle}>{event.event_name}</AppText>

          <View style={styles.detailRow}>
            <Image source={Images.MAP_PIN} style={styles.detailIcon} />
            <AppText style={styles.detailText}>
              {event.city}, {event.country}
            </AppText>
          </View>

          <View style={styles.footerRow}>
            <View style={styles.detailRow}>
              <Image source={Images.CALENDAR} style={styles.detailIcon} />
              <AppText style={styles.detailText}>
                {event.readable_from_date}
                {event.readable_to_date ? ` - ${event.readable_to_date}` : ''}
              </AppText>
            </View>
            <AppText style={styles.priceText}>{formatPrice(event)}</AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default EventCard;

const styles = StyleSheet.create({
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
  eventImageContainer: {
    width: w(118),
    height: h(102),
    borderRadius: mw(12),
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  metaContainer: {
    flex: 1,
    minWidth: 0,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: h(6),
  },
  tagChip: {
    backgroundColor: Colors.borderLight,
    borderRadius: mw(10),
    paddingHorizontal: w(8),
    paddingVertical: h(3),
  },
  tagText: {
    fontSize: FontSize.fs2,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  cityText: {
    fontSize: FontSize.fs3,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: FontSize.fs8,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: h(22),
    marginBottom: h(4),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: w(6),
  },
  detailIcon: {
    width: w(14),
    height: h(14),
    resizeMode: 'contain',
    tintColor: Colors.textMuted,
  },
  detailText: {
    fontSize: FontSize.fs3,
    color: Colors.textSecondary,
    flexShrink: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: h(4),
    gap: w(8),
  },
  priceText: {
    fontSize: FontSize.fs7,
    fontWeight: '700',
    color: Colors.text,
  },
  imageOverlayButtons: {
    position: 'absolute',
    top: h(8),
    left: h(8),
    right: h(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlayButton: {
    width: mw(28),
    height: mw(28),
    borderRadius: w(14),
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayIcon: {
    width: w(16),
    height: h(16),
    tintColor: Colors.white,
  },
  cardCompact: {
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
  cardHeaderCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: h(8),
  },
  cardTitleCompact: {
    fontSize: FontSize.fs7,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: w(8),
  },
  favButtonWrapCompact: {
    padding: w(4),
  },
  favIconCompact: {
    width: w(24),
    height: h(24),
  },
  removeButtonCompact: {
    backgroundColor: '#FEF2F2',
    borderRadius: mw(8),
    paddingVertical: h(6),
    paddingHorizontal: mw(12),
  },
  removeButtonTextCompact: {
    fontSize: FontSize.fs3,
    fontWeight: '600',
    color: Colors.error,
  },
  cardDetailsCompact: {
    gap: h(4),
  },
  detailTextCompactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: w(6),
  },
  detailIconCompact: {
    width: w(12),
    height: h(12),
    resizeMode: 'contain',
    tintColor: Colors.textMuted,
  },
  detailTextCompact: {
    fontSize: FontSize.fs3,
    color: Colors.textSecondary,
  },
});
