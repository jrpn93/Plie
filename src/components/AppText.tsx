/* 
    This component is used to wrap the text component and apply the default properties to the text.
    We can also utilize this component to apply different font sizes, font families, 
    and other text properties to support different themes.
*/

import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { CONST } from '../constants/constants';
import { Colors } from '../constants/colors';
import { FontSize } from '../constants/fonts';

interface CustomTextProps extends TextProps {
  children: ReactNode;
  style?: TextStyle | TextStyle[];
}

const AppText: React.FC<CustomTextProps> = ({ style, children, ...props }) => {
  return (
    <Text
      {...CONST.DEFAULT_TEXT_PROPS}
      style={[styles.default, { color: Colors.black }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  default: {
    fontSize: FontSize.fs5,
  },
});
