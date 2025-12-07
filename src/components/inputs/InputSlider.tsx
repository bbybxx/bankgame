import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';

interface InputSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  suffix?: string;
}

/**
 * Slider input component with value display and edit mode
 * @param {string} label - Slider label
 * @param {number} value - Current value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} step - Step size (default 1)
 * @param {(value: number) => void} onValueChange - Callback on value change
 * @param {string} suffix - Unit suffix (e.g. "$", "%")
 * @returns {React.ReactElement}
 */
export const InputSlider: React.FC<InputSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onValueChange,
  suffix = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(value.toString());

  const handleSliderChange = (newValue: number) => {
    const snappedValue = Math.round(newValue / step) * step;
    onValueChange(snappedValue);
    setTextValue(snappedValue.toString());
  };

  const handleTextChange = (text: string) => {
    setTextValue(text);
  };

  const handleTextSubmit = () => {
    const numValue = parseFloat(textValue);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      const snappedValue = Math.round(clampedValue / step) * step;
      onValueChange(snappedValue);
      setTextValue(snappedValue.toString());
    }
    setIsEditing(false);
  };

  const formattedValue = value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          activeOpacity={0.7}
        >
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              value={textValue}
              onChangeText={handleTextChange}
              onBlur={handleTextSubmit}
              onSubmitEditing={handleTextSubmit}
              keyboardType="decimal-pad"
              autoFocus
            />
          ) : (
            <Text style={styles.value}>
              {suffix}
              {formattedValue}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          value={value}
          onValueChange={handleSliderChange}
          step={step}
          minimumTrackTintColor={Colors.accentPrimary}
          maximumTrackTintColor={Colors.borderDefault}
          thumbTintColor={Colors.accentPrimary}
        />
      </View>

      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>{suffix}{min.toLocaleString()}</Text>
        <Text style={styles.rangeLabel}>{suffix}{max.toLocaleString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  value: {
    ...Typography.bodyMedium,
    color: Colors.accentPrimary,
    fontWeight: '600',
  },
  textInput: {
    ...Typography.bodyMedium,
    color: Colors.accentPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accentPrimary,
    paddingBottom: Spacing.xs,
    minWidth: 80,
    textAlign: 'right',
  },
  sliderContainer: {
    marginVertical: Spacing.md,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
});
