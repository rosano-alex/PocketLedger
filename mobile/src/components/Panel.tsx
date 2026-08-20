import type { ReactNode } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useFadeIn } from '../animation';
import { colors, text } from '../theme';

// The shell every block of the screen sits in. The web app frosts these with a
// backdrop blur; RN has none, so the panel carries the tint directly and keeps
// the lit hairline along its top edge, which is what reads as depth.
//
// Titles are small-caps labels rather than headings — at a glance the eye
// should land on the balance, not on the word above it.
export function Panel({ title, children, step }: { title: string; children: ReactNode; step: number }) {
  const fade = useFadeIn(step);

  return (
    <Animated.View style={[styles.panel, fade]}>
      <View style={styles.lip} />

      <View style={styles.head}>
        <Text style={[text.label, styles.title]}>{title}</Text>
      </View>

      <View style={styles.body}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelEdge,
    borderRadius: 16,
    overflow: 'hidden',
  },
  lip: {
    height: 1,
    backgroundColor: colors.panelLip,
  },
  head: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 14,
  },
  title: {
    fontSize: 11,
    letterSpacing: 1.7,
  },
  body: {
    paddingHorizontal: 22,
    paddingBottom: 22,
  },
});
