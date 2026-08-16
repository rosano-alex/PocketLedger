import type { ReactNode } from 'react';
import { Box } from '@gluestack-ui/themed';

export function Container({
  children,
  paddingVertical,
}: {
  children: ReactNode;
  paddingVertical: string | number;
}) {
  return (
    <Box width="100%" maxWidth={1000} marginHorizontal="auto" paddingHorizontal={20} paddingVertical={paddingVertical}>
      {children}
    </Box>
  );
}
