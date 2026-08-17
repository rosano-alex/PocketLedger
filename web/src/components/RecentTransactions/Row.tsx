import type { ReactNode } from 'react';
import { HStack } from '@gluestack-ui/themed';
import { fadeIn } from '../../animation';

// Separators and the hover tint are in styles.css under [data-row]; only there
// can the last row drop its rule. The negative margin lets the hover wash run
// out to the panel's padding, so a hovered row reads as a full-width band.
export function Row({
  children,
  header = false,
  step,
}: {
  children: ReactNode;
  header?: boolean;
  step?: number;
}) {
  return (
    <HStack
      role="row"
      space="sm"
      alignItems="center"
      marginHorizontal={-10}
      paddingHorizontal={10}
      borderRadius={8}
      paddingVertical={header ? 9 : 13}
      dataSet={{ row: header ? 'head' : 'body', ...(step === undefined ? {} : fadeIn(step)) }}
    >
      {children}
    </HStack>
  );
}
