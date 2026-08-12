import type { ReactNode } from 'react';
import { Box, Heading } from '@gluestack-ui/themed';

export function Panel({ title, children }: { title: string; children: ReactNode }) {


  return (
    <Box bg="#16181c" borderWidth={1} borderColor="#2a2e34" borderRadius={4}>
      <Box paddingHorizontal="$4" paddingVertical={12} borderBottomWidth={1} borderBottomColor="$line">
        <Heading fontFamily="$heading" color="$text" fontWeight="$semibold" sx={{ fontSize: 15 }}>
          {title}
        </Heading>
      </Box>

      <Box paddingHorizontal="$4" paddingVertical="$4">
        {children}
      </Box>
    </Box>
  );
}
