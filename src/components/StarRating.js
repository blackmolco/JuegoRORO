import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function StarRating({ stars, size = 12 }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Text
          key={i}
          style={[
            styles.star,
            { fontSize: size, color: i < stars ? COLORS.rarity[stars] : COLORS.textDim },
          ]}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  star: { marginRight: 1 },
});
