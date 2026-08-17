import type { TransactionType } from '@pocketledger/shared';
import { Box, Text } from '@gluestack-ui/themed';

// Sky for money in, coral for money out. The word stays in the badge: colour
// is the emphasis, never the only telling.
export function TypeBadge({ type }: { type: TransactionType }) {
  const credit = type === 'credit';

  return (
    <Box
      alignSelf="flex-start"
      bg={credit ? '$creditWash' : '$debitWash'}
      borderWidth={1}
      borderColor={credit ? '$creditEdge' : '$debitEdge'}
      borderRadius={999}
      paddingHorizontal={9}
      paddingVertical={3}
    >
      <Text
        fontFamily="$heading"
        color={credit ? '$credit' : '$debit'}
        sx={{ fontSize: 9.5, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase' }}
      >
        {credit ? 'Credit' : 'Debit'}
      </Text>
    </Box>
  );
}
