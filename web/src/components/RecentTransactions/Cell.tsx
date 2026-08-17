import { Box, Text } from '@gluestack-ui/themed';

export interface CellProps {
  children: string;
  flex: number;
  align?: 'left' | 'right';
  mono?: boolean;
  muted?: boolean;
  /** A column label: small, letterspaced, and quiet enough to stay a label. */
  head?: boolean;
  /** Dropped on phones, where five columns can't share the width. */
  optional?: boolean;
  color?: string;
}

// Five columns don't fit a phone. The running balance is the one that can go:
// it's derivable from the column beside it, and the headline balance above
// already gives the figure that matters.
const dropOnPhones = { '@base': { display: 'none' }, '@sm': { display: 'flex' } } as const;

export function Cell({
  children,
  flex,
  align = 'left',
  mono = false,
  muted = false,
  head = false,
  optional = false,
  color,
}: CellProps) {
  return (
    <Box
      flex={flex}
      minWidth={0}
      role={head ? 'columnheader' : 'cell'}
      {...(optional ? { sx: dropOnPhones } : {})}
    >
      <Text
        fontFamily={mono ? '$mono' : '$body'}
        // Labels sit a step quieter than the figures they head; a muted figure
        // is still a figure, so it keeps enough contrast to be read.
        color={color ?? (head ? '$hint' : muted ? '$textMuted' : '$text')}
        textAlign={align}
        numberOfLines={1}
        dataSet={{ figure: mono }}
        sx={
          head
            ? { fontSize: 10, fontWeight: '600', letterSpacing: 1.3, textTransform: 'uppercase' }
            : { fontSize: 13.5 }
        }
      >
        {children}
      </Text>
    </Box>
  );
}
