import { Box, Text } from '@gluestack-ui/themed';
import { fadeIn, steps } from '../animation';

// The ledger has exactly one rule, and it decides half of what the UI ever
// says back to you. Worth stating once, quietly, at the foot of the page.
export function Footer() {
  return (
    <Box borderTopWidth={1} borderTopColor="$line" marginTop={32} paddingTop={18} dataSet={fadeIn(steps.footer)}>
      <Text
        fontFamily="$heading"
        color="$hint"
        sx={{ fontSize: 10, fontWeight: '600', letterSpacing: 1.6, textTransform: 'uppercase' }}
      >
        No transaction may take the balance below zero
      </Text>
    </Box>
  );
}
