import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Pressable, View, Image, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/fonts';
import { Images } from '../../constants/images';
import { mw, h, w } from '../../utils/RNSize';
import AppText from '../../components/AppText';
import AppTextInput from '../../components/AppTextInput';

const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = () => {
    // TODO: Implement register API call
  };

  const handleLogin = () => {
    // Navigation handled by router
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={Images.DANCING_GIRL_BG}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.cardContainer}>
          <Image source={Images.PLIE_ELEVATE} style={styles.logo} />

          <View style={styles.card}>
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <AppTextInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                  value={formData.name}
                  onChangeText={(value) => handleChange('name', value)}
                />
                <AppTextInput
                  label="Email"
                  placeholder="email@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  value={formData.email}
                  onChangeText={(value) => handleChange('email', value)}
                />
                <AppTextInput
                  label="Password"
                  placeholder="Create a password"
                  secureTextEntry
                  showEyeButton
                  autoComplete="new-password"
                  returnKeyType="next"
                  value={formData.password}
                  onChangeText={(value) => handleChange('password', value)}
                />
                <AppTextInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  secureTextEntry
                  showEyeButton
                  autoComplete="new-password"
                  returnKeyType="done"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleChange('confirmPassword', value)}
                />
              </View>
            </View>

            <Pressable
              android_ripple={{
                color: Colors.primaryLight,
                borderless: false,
              }}
              style={styles.signInButton}
              onPress={handleRegister}
            >
              <AppText style={styles.signInButtonText}>Create Account</AppText>
            </Pressable>

            <View style={styles.signUpContainer}>
              <AppText style={styles.signUpText}>Already have an account? </AppText>
              <AppText onPress={handleLogin} style={styles.signUpLink}>Sign In</AppText>
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <AppText style={styles.dividerText}>or Sign Up with</AppText>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <Pressable style={styles.socialButton}>
                <Image source={Images.APPLE_LOGO} style={styles.socialIcon} />
              </Pressable>
              <Pressable style={styles.socialButton}>
                <Image source={Images.GOOGLE_LOGO} style={styles.socialIcon} />
              </Pressable>
              <Pressable style={styles.socialButton}>
                <Image source={Images.FACEBOOK_LOGO} style={styles.socialIcon} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: mw(24),
    paddingTop: h(60),
    paddingBottom: h(40),
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  cardContainer: {
    width: '100%',
    zIndex: 1,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: mw(24),
    padding: mw(28),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: h(2) },
    shadowOpacity: 0.08,
    shadowRadius: mw(6),
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  form: {
    marginBottom: h(28),
  },
  signInButton: {
    backgroundColor: Colors.primary,
    borderRadius: mw(12),
    paddingVertical: h(10),
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: h(2) },
    shadowOpacity: 0.2,
    shadowRadius: mw(8),
    elevation: 4,
  },
  signInButtonText: {
    fontSize: FontSize.fs6,
    fontWeight: '600',
    color: Colors.white,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: h(8),
  },
  signUpText: {
    fontSize: FontSize.fs4,
    color: Colors.textSecondary,
  },
  signUpLink: {
    fontSize: FontSize.fs4,
    color: Colors.primary,
    fontWeight: '600',
  },
  logo: {
    height: h(75),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  inputContainer: {
    gap: h(16),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: h(24),
    gap: w(12),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSize.fs4,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: w(16),
    marginTop: h(8),
  },
  socialButton: {
    width: mw(48),
    height: mw(48),
    borderRadius: mw(12),
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: h(1) },
    shadowOpacity: 0.05,
    shadowRadius: mw(3),
    elevation: 1,
  },
  socialIcon: {
    width: mw(22),
    height: mw(22),
    resizeMode: 'contain',
  },
});