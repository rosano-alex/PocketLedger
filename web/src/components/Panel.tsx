import type { ReactNode } from 'react';
import { Box, Text } from '@gluestack-ui/themed';
import { fadeIn } from '../animation';

// The frosted shell every block of the page sits in. Its surface, border and
// top highlight are in styles.css under [data-panel]: backdrop blur and
// multi-layer shadows have no equivalent in the RN style system.
//
// Titles are set as small-caps labels rather than headings — at a glance the
// eye should land on the balance, not on the word above it.
export function Panel({ title, children, step }: { title: string; children: ReactNode; step?: number }) {
  return (
    <Box dataSet={{ panel: true, ...(step === undefined ? {} : fadeIn(step)) }}>
      <Box paddingHorizontal={22} paddingTop={18} paddingBottom={14}>
        <Text
          fontFamily="$heading"
          color="$hint"
          sx={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.7, textTransform: 'uppercase' }}
        >
          {title}
        </Text>
      </Box>

      <Box paddingHorizontal={22} paddingBottom={22}>
        {children}
      </Box>
    </Box>
  );
}
