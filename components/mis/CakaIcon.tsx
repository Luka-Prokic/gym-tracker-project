import icons, { CakaIcons } from '../../assets/icons/CustomIcons';
import React from 'react';
import { View, StyleSheet } from 'react-native';



interface CustomIconProps {
  name: CakaIcons;
  size?: number;
  fill?: string;
  stroke?: string;
  style?: object;
}


const CakaIcon: React.FC<CustomIconProps> = ({ name, size = 30, fill = "#00000000", stroke = "#00000000", style }) => {
  return (
    <View style={[styles.iconContainer, style]}>
      {icons[name] ? React.cloneElement(icons[name], { width: size, height: size, fill: fill, stroke: stroke }) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CakaIcon;
