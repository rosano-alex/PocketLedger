import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { colors } from '../theme';

// Hoisted: an inline array is a new prop on every render, which the native
// gradient view then has to diff.
const STOPS = [0, 0.46, 1] as const;

// The page ground. The web app stacks four washes and a grain layer over this
// fall; RN has neither blend modes nor a noise source, so mobile keeps the fall
// itself — which is what carries the navy from light at the masthead to dark at
// the foot of a long list.
export function Ground({ children }: { children: ReactNode }) {
  return (
    <LinearGradient colors={colors.pageFall} locations={STOPS} style={styles.ground}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  ground: {
    flex: 1,
    backgroundColor: colors.page,
  },
});
