import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Pressable, View, Image, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/fonts';
import { Images } from '../../constants/images';
import { mw, h, w } from '../../utils/RNSize';
import AppText from '../../components/AppText';
import AppTextInput from '../../components/AppTextInput';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setIsLoading(true);
    // TODO: Implement forgot password API call
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSuccess(true);
  };

  const handleBackToLogin = () => {
    // Navigation handled by router
  };

  if (success) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Image
            source={Images.DANCING_GIRL_BG}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          <View style={styles.cardContainer}>
            <Image source={Images.PLIE_ELEVATE} style={styles.logo} />
            <View style={styles.card}>
              <View style={styles.successContainer}>
                <View style={styles.successIcon}>
                  <Image source={Images.CHECK} style={styles.checkmark} />
                </View>
                <AppText style={styles.successTitle}>Check Your Email</AppText>
                <AppText style={styles.successMessage}>
                  We've sent a password reset link to <AppText style={styles.emailText}>{email}</AppText>
                </AppText>
                <Pressable style={styles.backButton} onPress={handleBackToLogin}>
                  <AppText style={styles.backButtonText}>Back to Login</AppText>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

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
              <AppText style={styles.formTitle}>Forgot Password?</AppText>
              <AppText style={styles.formSubtitle}>
                Enter your email address and we'll send you a link to reset your password.
              </AppText>

              <View style={styles.inputContainer}>
                <AppTextInput
                  label="Email"
                  placeholder="email@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="done"
                  value={email}
                  onChangeText={setEmail}
                  onSubmitEditing={handleSubmit}
                />
              </View>
            </View>

            <Pressable
              android_ripple={{
                color: Colors.primaryLight,
                borderless: false,
              }}
              style={styles.signInButton}
              onPress={handleSubmit}
              disabled={isLoading || !email}
            >
              <AppText style={styles.signInButtonText}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </AppText>
            </Pressable>

            <Pressable style={styles.backContainer} onPress={handleBackToLogin}>
              <Image source={Images.ARROW_LEFT} style={styles.backArrow} />
              <AppText style={styles.backText}>Back to Login</AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

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
  formTitle: {
    fontSize: FontSize.fs12,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: h(8),
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: FontSize.fs4,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: h(20),
    marginBottom: h(24),
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
  backContainer: {
    marginTop: h(24),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: mw(6),
  },
  backArrow: {
    width: w(14),
    height: h(14),
    resizeMode: 'contain',
    tintColor: Colors.primary,
  },
  backText: {
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
  successContainer: {
    alignItems: 'center',
    paddingVertical: h(20),
  },
  successIcon: {
    width: mw(80),
    height: mw(80),
    borderRadius: mw(40),
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: h(24),
  },
  checkmark: {
    width: mw(40),
    height: mw(40),
    resizeMode: 'contain',
    tintColor: Colors.success,
  },
  successTitle: {
    fontSize: FontSize.fs10,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: h(12),
    textAlign: 'center',
  },
  successMessage: {
    fontSize: FontSize.fs4,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: h(20),
    marginBottom: h(32),
  },
  emailText: {
    fontWeight: '600',
    color: Colors.text,
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: mw(12),
    paddingVertical: h(10),
    paddingHorizontal: mw(32),
  },
  backButtonText: {
    fontSize: FontSize.fs6,
    fontWeight: '600',
    color: Colors.white,
  },
});