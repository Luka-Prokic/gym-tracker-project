import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { useTheme } from '../context/ThemeContext';
import Colors, { Themes } from '@/constants/Colors';

const WheelPickerTest = () => {
  const { theme } = useTheme();
  const color = Colors[theme as Themes];
  const backgroundSlideClassic = theme === "dark" || theme === "preworkout" || theme == "Corrupted" ? '#333333' : '#FFFFFF';


  const items = ['1', '2', '3', '4', '5', '6', '7'].map((val) => ({ label: val, value: val }));
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <WheelPickerExpo
      width={"90%"}
      items={items}
      initialSelectedIndex={selectedIndex}
      onChange={({ index }) => setSelectedIndex(index)}
      backgroundColor={backgroundSlideClassic}
      selectedStyle={styles.indicator}
    />
  );
};

const styles = StyleSheet.create({
  indicator: {
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default WheelPickerTest;