import { Box, HStack, Heading, Text } from '@gluestack-ui/themed';
import { fadeIn, steps } from '../animation';
import { Container } from './Container';

// Transparent, so the page gradient runs behind it rather than being cut off
// at its lightest end. The closing rule is in styles.css under [data-masthead].
export function Masthead() {
  return (
    <Box dataSet={{ masthead: true, ...fadeIn(steps.masthead) }}>
      <Container paddingVertical={24}>
        <HStack
          space="md"
          justifyContent="space-between"
          sx={{
            '@base': { flexDirection: 'column', alignItems: 'flex-start' },
            '@sm': { flexDirection: 'row', alignItems: 'baseline' },
          }}
        >
          {/*
            400, not 600: the brush face ships one weight, so a heavier request
            only gets synthesised — which smears the stroke edges.
          */}
          <Heading fontFamily="$display" color="$text" fontWeight="400" sx={{ fontSize: 62.5, lineHeight: 76 }}>
            PocketLedger
          </Heading>

          <Text
            fontFamily="$heading"
            color="$hint"
            sx={{ fontSize: 10.5, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase' }}
          >
            Single-account ledger
          </Text>
        </HStack>

        {/* The one bit of coral above the fold, tying the masthead to the button. */}
        <Box width={54} height={2} borderRadius={2} bg="$accent" marginTop={14} />
      </Container>
    </Box>
  );
}
