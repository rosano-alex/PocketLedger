import { HStack, Text } from '@gluestack-ui/themed';
import { steps } from '../animation';
import { moneyParts } from '../format';
import { Panel } from './Panel';

// The headline. The dollars carry the page's only serif at the page's largest
// size; the cents drop to a third of it in the muted blue, so the figure reads
// as one number with a tail rather than as two.
export function BalancePanel({ balance }: { balance: number }) {
  const { dollars, cents } = moneyParts(balance);

  return (
    <Panel title="Balance" step={steps.balance}>
      <HStack alignItems="baseline" space="xs">
        <Text
          fontFamily="$serif"
          color="$text"
          dataSet={{ figure: true }}
          sx={{ fontSize: 56, lineHeight: 60, fontWeight: '400', letterSpacing: -1.4 }}
        >
          {dollars}
        </Text>

        <Text
          fontFamily="$serif"
          color="$textMuted"
          dataSet={{ figure: true }}
          sx={{ fontSize: 22, lineHeight: 30, fontWeight: '400' }}
        >
          .{cents}
        </Text>

        <Text
          fontFamily="$heading"
          color="$hint"
          marginLeft="$2"
          sx={{ fontSize: 10, fontWeight: '600', letterSpacing: 1.6 }}
        >
          USD
        </Text>
      </HStack>
    </Panel>
  );
}
