import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CreditScoreWidgetProps {
  score: number;
}

export const CreditScoreWidget: React.FC<CreditScoreWidgetProps> = ({ score }) => {
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  
  // Normalize score (300-850) to 0-1
  const progress = Math.max(0, Math.min(1, (score - 300) / (850 - 300)));
  const strokeDashoffset = circumference - progress * circumference;

  const getColor = (s: number) => {
    if (s >= 750) return '#4CD964'; // Excellent
    if (s >= 700) return '#007AFF'; // Good
    if (s >= 650) return '#FF9500'; // Fair
    return '#FF3B30'; // Poor
  };

  const color = getColor(score);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Credit Score</Text>
        <Text style={[styles.status, { color }]}>
          {score >= 750 ? 'Excellent' : score >= 700 ? 'Good' : score >= 650 ? 'Fair' : 'Poor'}
        </Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.chartContainer}>
          <Svg width={100} height={100} viewBox="0 0 100 100">
            <Circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#333"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <Circle
              cx="50"
              cy="50"
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin="50, 50"
            />
          </Svg>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
