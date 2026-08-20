import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { logout } from '../../store/slices/authSlice';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/fonts';
import { Images } from '../../constants/images';
import { mw, h } from '../../utils/RNSize';
import AppText from '../../components/AppText';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';

interface ProfileOption {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  isDestructive?: boolean;
}

const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  const options: ProfileOption[] = [
    { id: 'tickets', title: 'My Tickets', icon: '🎟', onPress: () => {} },
    { id: 'payment', title: 'Payment Methods', icon: '💳', onPress: () => {} },
    {
      id: 'notifications',
      title: 'Notification Settings',
      icon: '🔔',
      onPress: () => {},
    },
    { id: 'help', title: 'Help & Support', icon: '❔', onPress: () => {} },
    {
      id: 'logout',
      title: 'Logout',
      icon: '⟵',
      onPress: () => dispatch(logout()),
      isDestructive: true,
    },
  ];

  const handleAvatarPress = () => {
    // TODO: Implement image picker
  };

  const avatarSource = user?.usr_profile_img
    ? { uri: user.usr_profile_img }
    : Images.PROFILE_PLACEHOLDER;

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={Images.LOGO} style={styles.logo} />
      </View>

      <View style={styles.profileBlock}>
        <Pressable style={styles.avatarContainer} onPress={handleAvatarPress}>
          <Image
            source={avatarSource}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.cameraButton}>
            <AppText style={styles.cameraIcon}>✎</AppText>
          </View>
        </Pressable>

        <AppText style={styles.userName}>
          {user?.usr_fname && user?.usr_lname
            ? `${user.usr_fname} ${user.usr_lname}`
            : user?.usr_username || 'Dance Enthusiast'}
        </AppText>
        <AppText style={styles.userEmail}>
          {user?.usr_email || 'abc@gmail.com'}
        </AppText>
      </View>

      <View style={styles.optionsContainer}>
        {options.map(option => {
          const optionRowStyle = option.isDestructive
            ? [styles.optionRow, styles.optionRowDestructive]
            : styles.optionRow;
          const optionTitleStyle = option.isDestructive
            ? [styles.optionTitle, styles.optionTitleDestructive]
            : styles.optionTitle;

          return (
            <Pressable
              key={option.id}
              style={optionRowStyle}
              onPress={option.isDestructive ? option.onPress : () => {}}
              android_ripple={{ color: Colors.borderLight, borderless: false }}
            >
              <AppText style={styles.optionIcon}>{option.icon}</AppText>
              <AppText style={optionTitleStyle}>{option.title}</AppText>
              {!option.isDestructive && (
                <AppText style={styles.chevron}>›</AppText>
              )}
            </Pressable>
          );
        })}
      </View>

      {!isAuthenticated && (
        <View style={styles.guestNotice}>
          <AppText style={styles.guestText}>
            You are browsing as a guest
          </AppText>
          <AppText style={styles.guestSubtext}>
            Sign in to access your profile and save favourites
          </AppText>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: h(8),
    paddingBottom: h(12),
    backgroundColor: Colors.background,
  },
  logo: {
    height: h(20),
    resizeMode: 'contain',
  },
  profileBlock: {
    alignItems: 'center',
    paddingBottom: h(18),
    backgroundColor: Colors.background,
    marginTop: h(15),
  },
  avatarContainer: {
    position: 'relative',
    width: mw(85),
    height: mw(85),
    borderRadius: mw(18),
    backgroundColor: '#E5E1DC',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D7D2CC',
    marginBottom: h(18),
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: mw(18),
  },
  cameraButton: {
    position: 'absolute',
    right: -3,
    bottom: -3,
    width: mw(34),
    height: mw(34),
    borderRadius: mw(10),
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  cameraIcon: {
    fontSize: FontSize.fs5,
    color: Colors.white,
    fontWeight: '700',
  },
  userName: {
    fontSize: FontSize.fs12,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: h(42),
    textAlign: 'center',
  },
  userEmail: {
    fontSize: FontSize.fs5,
    color: Colors.textSecondary,
    marginTop: h(2),
    textAlign: 'center',
  },
  optionsContainer: {
    marginHorizontal: mw(18),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: mw(12),
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: h(16),
    paddingHorizontal: mw(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
  optionRowDestructive: {
    borderBottomWidth: 0,
  },
  optionIcon: {
    fontSize: FontSize.fs7,
    marginRight: mw(12),
    width: mw(24),
  },
  optionTitle: {
    fontSize: FontSize.fs7,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
  },
  optionTitleDestructive: {
    color: Colors.error,
  },
  chevron: {
    fontSize: FontSize.fs14,
    color: Colors.textMuted,
    lineHeight: h(26),
  },
  guestNotice: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: mw(24),
    paddingBottom: h(40),
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: 'center',
  },
  guestText: {
    fontSize: FontSize.fs6,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  guestSubtext: {
    fontSize: FontSize.fs4,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: h(4),
  },
});
