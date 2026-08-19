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
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const options: ProfileOption[] = [
    { id: 'settings', title: 'Settings', icon: '⚙️', onPress: () => {} },
    { id: 'notifications', title: 'Notifications', icon: '🔔', onPress: () => {} },
    { id: 'help', title: 'Help & Support', icon: '❓', onPress: () => {} },
    { id: 'about', title: 'About', icon: 'ℹ️', onPress: () => {} },
    { id: 'logout', title: 'Logout', icon: '🚪', onPress: () => dispatch(logout()), isDestructive: true },
  ];

  const handleAvatarPress = () => {
    // TODO: Implement image picker
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.avatarContainer} onPress={handleAvatarPress}>
          <Image
            source={Images.PROFILE_PLACEHOLDER}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.cameraButton}>
            <AppText style={styles.cameraIcon}>📷</AppText>
          </View>
        </Pressable>
        <View style={styles.userInfo}>
          <AppText style={styles.userName}>{user?.usr_fname && user?.usr_lname ? `${user.usr_fname} ${user.usr_lname}` : 'Guest User'}</AppText>
          <AppText style={styles.userEmail}>{user?.usr_email || 'guest@example.com'}</AppText>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option) => {
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
              android_ripple={{ color: option.isDestructive ? '#FEF2F2' : Colors.borderLight, borderless: false }}
            >
              <AppText style={styles.optionIcon}>{option.icon}</AppText>
              <AppText style={optionTitleStyle}>
                {option.title}
              </AppText>
              {!option.isDestructive && <AppText style={styles.chevron}>›</AppText>}
            </Pressable>
          );
        })}
      </View>

      {!isAuthenticated && (
        <View style={styles.guestNotice}>
          <AppText style={styles.guestText}>You are browsing as a guest</AppText>
          <AppText style={styles.guestSubtext}>Sign in to access your profile and save favourites</AppText>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: mw(24),
    paddingTop: h(60),
    paddingBottom: h(24),
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  avatarContainer: {
    position: 'relative',
    width: mw(80),
    height: mw(80),
    borderRadius: mw(40),
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: mw(40),
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: mw(28),
    height: mw(28),
    borderRadius: mw(14),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  cameraIcon: {
    fontSize: FontSize.fs4,
  },
  userInfo: {
    marginLeft: mw(16),
    flex: 1,
  },
  userName: {
    fontSize: FontSize.fs10,
    fontWeight: '700',
    color: Colors.text,
  },
  userEmail: {
    fontSize: FontSize.fs4,
    color: Colors.textSecondary,
    marginTop: h(2),
  },
  optionsContainer: {
    paddingHorizontal: mw(16),
    paddingTop: h(16),
    gap: h(8),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: h(14),
    paddingHorizontal: mw(16),
    backgroundColor: Colors.surface,
    borderRadius: mw(12),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  optionRowDestructive: {
    borderColor: '#FECACA',
  },
  optionIcon: {
    fontSize: FontSize.fs7,
    marginRight: mw(12),
  },
  optionTitle: {
    fontSize: FontSize.fs6,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
  },
  optionTitleDestructive: {
    color: Colors.error,
  },
  chevron: {
    fontSize: FontSize.fs8,
    color: Colors.textMuted,
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