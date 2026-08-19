import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  Image,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../constants/colors';
import { FontSize } from '../constants/fonts';
import { mw, h, w } from '../utils/RNSize';
import AppText from './AppText';
import { Images } from '../constants/images';

interface AppTextInputProps extends TextInputProps {
  label: string;
  secureTextEntry?: boolean;
  showEyeButton?: boolean;
  containerStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
  error?: string | undefined;
}

const AppTextInput: React.FC<AppTextInputProps> = ({
  label,
  secureTextEntry = false,
  showEyeButton = false,
  containerStyle,
  inputStyle,
  labelStyle,
  error,
  ...props
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const toggleSecure = () => setIsSecure(!isSecure);

  return (
    <View style={[styles.container, containerStyle]}>
      <AppText style={[styles.label, labelStyle]}>{label}</AppText>
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        <TextInput
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, inputStyle]}
          placeholderTextColor={Colors.textSecondary}
          {...props}
        />
        {showEyeButton && (
          <Pressable
            style={styles.eyeButton}
            onPress={toggleSecure}
            hitSlop={10}
          >
            <Image
              source={isSecure ? Images.EYE_OFF : Images.EYE}
              style={{ width: mw(18), height: h(18), resizeMode: 'contain' }}
            />
          </Pressable>
        )}
      </View>
      {error && <AppText style={styles.errorText}>{error}</AppText>}
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  container: {
    gap: h(6),
  },
  label: {
    fontSize: FontSize.fs3,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: mw(12),
    paddingHorizontal: w(10),
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
  },
  inputWrapperError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: FontSize.fs5,
    color: Colors.text,
    paddingVertical: h(12),
  },
  eyeButton: {
    padding: mw(2),
  },
  errorText: {
    fontSize: FontSize.fs2,
    color: Colors.error,
  },
});
