import type { TransactionType } from '@pocketledger/shared';
import { Pressable, Text } from '@gluestack-ui/themed';

interface TypeOptionProps {
  value: TransactionType;
  selected: boolean;
  onSelect: (field: 'type', value: TransactionType) => void;
}

// One half of the segmented control. The chosen half fills with the colour
// that type carries everywhere else — sky for credit, coral for debit — so the
// form says which way the money is going in the same language as the table.
export function TypeOption({ value, selected, onSelect }: TypeOptionProps) {
  const fill = value === 'credit' ? '$credit' : '$debit';

  return (
    <Pressable
      flex={1}
      role="radio"
      aria-checked={selected}
      onPress={() => onSelect('type', value)}
      borderRadius={9}
      bg={selected ? fill : 'transparent'}
      paddingVertical={9}
      alignItems="center"
      sx={selected ? {} : { ':hover': { bg: '$hover' } }}
    >
      {/*
        Both halves are set in white; the unselected one is held back with
        opacity rather than a second colour, so the fill alone says which is
        chosen.
      */}
      <Text
        fontFamily="$heading"
        color="$onFill"
        opacity={selected ? 1 : 0.62}
        sx={{ fontSize: 14, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' }}
      >
        {value}
      </Text>
    </Pressable>
  );
}
