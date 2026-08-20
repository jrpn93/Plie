import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/fonts';
import { mw, h, w } from '../../utils/RNSize';
import AppText from '../../components/AppText';
import { Event } from '../../api/api';
import { Images } from '../../constants/images';
import WebView from 'react-native-webview';

type EventDetailsRouteParams = {
  event: Event;
};

type EventDetailsRouteProp = RouteProp<
  Record<string, EventDetailsRouteParams>,
  string
>;

const formatPrice = (event: Event) => {
  if (event.event_price_from && event.event_price_to) {
    return `€${event.event_price_from} - €${event.event_price_to}`;
  }
  if (event.event_price_from) {
    return `€${event.event_price_from}`;
  }
  return 'Free';
};

const parseDescriptionToHtml = (text: string): string => {
  if (!text) {
    return '<p style="color:#9A9690;font-size:14px;">No description available.</p>';
  }

  let html = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  html = html.replace(urlRegex, (url) => {
    const cleanUrl = url.replace(/[.)]+$/, '');
    return `<a href="${cleanUrl}" style="color:#0A0A0A;text-decoration:underline;">${cleanUrl}</a>`;
  });

  html = html
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<strong>$1</strong>');

  html = html
    .split('\n')
    .map(line => line.trim() ? `<p style="margin:0 0 8px 0;line-height:1.6;color:#111111;font-size:14px;">${line}</p>` : '<br/>')
    .join('');

  return html;
};

const getMapHtml = (city: string, country: string): string => {
  const query = encodeURIComponent(`${city}, ${country}`);
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 100%; height: 100%; overflow: hidden; }
          iframe { width: 100%; height: 100%; border: 0; }
        </style>
      </head>
      <body>
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=-0.15%2C51.45%2C-0.05%2C51.55&layer=mapnik&marker=0&query=${query}"
          loading="lazy"
        ></iframe>
      </body>
    </html>
  `;
};

const EventDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<EventDetailsRouteProp>();
  const event = route.params?.event;

  if (!event) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <AppText style={styles.emptyText}>Event details unavailable</AppText>
        </View>
      </View>
    );
  }

  const eventImage = event.event_profile_img || event.event_profile_pic;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image source={Images.ARROW_LEFT} style={styles.backArrow} />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          {eventImage ? (
            <Image
              source={{ uri: eventImage }}
              style={styles.heroImage}
              resizeMode="cover"
            />
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
          <View style={styles.pill}>
            <AppText style={styles.pillText}>Workshop</AppText>
          </View>
          <AppText style={styles.metaText}>{event.city}</AppText>
        </View>

        <AppText style={styles.eventTitle}>{event.event_name}</AppText>
        <AppText style={styles.priceText}>{formatPrice(event)}</AppText>

        <View style={styles.detailList}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconWrap}>
              <Image source={Images.CALENDAR_BOLD} style={styles.detailIcon} />
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
              <Image source={Images.MAP_PIN} style={styles.detailIcon} />
            </View>
            <View style={styles.detailValueWrap}>
              <AppText style={styles.label}>LOCATION</AppText>
              <AppText style={styles.detailValue}>
                {event.city}, {event.country}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.mapBox}>
          <WebView
            source={{ html: getMapHtml(event.city, event.country) }}
            style={styles.mapWebview}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <AppText style={styles.sectionTitle}>About the Event</AppText>
        <View style={styles.descriptionWebviewContainer}>
          <WebView
            source={{
              html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                    <style>
                      * { margin: 0; padding: 0; box-sizing: border-box; }
                      body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        background-color: transparent;
                        padding: 16px;
                        color: #111111;
                      }
                      a { color: #0A0A0A; }
                      p { margin: 0 0 8px 0; line-height: 1.6; font-size: 14px; color: #111111; }
                    </style>
                  </head>
                  <body>
                    ${parseDescriptionToHtml(event.description || '')}
                  </body>
                </html>
              `,
            }}
            style={styles.descriptionWebview}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            onShouldStartLoadWithRequest={(request) => {
              if (request.url !== 'about:blank' && request.url !== 'about:srcdoc') {
                return false;
              }
              return true;
            }}
          />
        </View>

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
    </View>
  );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: h(8),
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
    width: w(24),
    height: h(24),
    resizeMode: 'contain',
    tintColor: Colors.text,
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
    width: mw(36),
    height: mw(36),
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
    fontSize: FontSize.fs14,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: mw(16),
    marginTop: h(4),
    lineHeight: h(36),
  },
  priceText: {
    fontSize: FontSize.fs8,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: mw(16),
    marginTop: h(4),
  },
  detailList: {
    marginTop: h(18),
    paddingHorizontal: mw(16),
    gap: h(5),
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
    width: w(22),
    height: h(22),
    resizeMode: 'contain',
    tintColor: Colors.primary,
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
    height: h(150),
  },
  mapWebview: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FontSize.fs12,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: mw(16),
    marginTop: h(20),
    marginBottom: h(10),
  },
  descriptionWebviewContainer: {
    marginHorizontal: mw(16),
    borderRadius: mw(10),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
  descriptionWebview: {
    flex: 1,
    minHeight: h(200),
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
