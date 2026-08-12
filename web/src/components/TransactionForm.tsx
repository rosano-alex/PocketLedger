import type { TransactionType } from '@pocketledger/shared';
import {
  Button,
  ButtonSpinner,
  ButtonText,
  HStack,
  Input,
  InputField,
  InputSlot,
  Pressable,
  Text,
  VStack,

} from '@gluestack-ui/themed';
import { cleanAmount } from '../format';
import { usePostTransaction } from '../api';
import { useLedgerStore } from '../store';
import { Panel } from './Panel';

export function TransactionForm() {
  const draft = useLedgerStore((state) => state.draft);
  const status = useLedgerStore((state) => state.status);
  const setField = useLedgerStore((state) => state.setField);
  const dispatch = useLedgerStore((state) => state.dispatch);

  const post = usePostTransaction();
  const isSubmitting = status === 'submitting';

  const amount = Number.parseFloat(draft.amount);



  const canSubmit =
    Number.isFinite(amount) && amount > 0 && draft.description.trim() !== '' && !isSubmitting;

  const submit = () => {
    // The machine is the guard: it won't accept SUBMIT while one is in flight.
    if (!canSubmit || !dispatch({ type: 'SUBMIT' })) return;

    post.mutate({ amount, type: draft.type, description: draft.description.trim() });
  };

  return (
    <Panel title="New transaction">
      <VStack space="md">
        <HStack space="sm" role="radiogroup" aria-label="Transaction type">
          <TypeOption value="credit" selected={draft.type === 'credit'} onSelect={setField} />
          <TypeOption value="debit" selected={draft.type === 'debit'} onSelect={setField} />
        </HStack>

        <Input borderColor="#3c4147" borderRadius={4} height={44}>
          <InputSlot paddingLeft="$3">
            <Text fontFamily="$mono" color="#6b7178" sx={{ fontSize: 15 }}>
              $
            </Text>
          </InputSlot>
          <InputField
            value={draft.amount}
            onChangeText={(value: string) => setField('amount', cleanAmount(value))}
            onSubmitEditing={submit}
            placeholder="0.00"
            placeholderTextColor="#6b7178"
            inputMode="decimal"
            fontFamily="$mono"
            color="$text"
            dataSet={{ figure: true }}
            sx={{ fontSize: 15 }}
            aria-label="Amount"
          />
        </Input>

        <Input borderColor="#3c4147" borderRadius={4} height={44}>
          <InputField
            value={draft.description}
            onChangeText={(value: string) => setField('description', value)}
            onSubmitEditing={submit}
            placeholder="Description"
            placeholderTextColor="#6b7178"
            fontFamily="$body"
            color="$text"
            sx={{ fontSize: 14 }}
            aria-label="Description"
          />
        </Input>

        <Button
          onPress={submit}
          isDisabled={!canSubmit}
          height={44}
          borderRadius={4}
          bg="#e8eaed"
          sx={{ ':hover': { bg: '$textMuted' }, ':disabled': { opacity: 0.4 } }}
        >
          {isSubmitting ? <ButtonSpinner marginRight="$2" color="$surface" /> : null}
          <ButtonText fontFamily="$body" color="#16181c" fontWeight="500" sx={{ fontSize: 14 }}>
            {isSubmitting ? 'Posting…' : 'Post transaction'}
          </ButtonText>
        </Button>
      </VStack>
    </Panel>
  );
}

function TypeOption({
  value,
  selected,
  onSelect,
}: {
  value: TransactionType;
  selected: boolean;
  onSelect: (field: 'type', value: TransactionType) => void;
}) {


  return (
    <Pressable
      flex={1}
      role="radio"
      aria-checked={selected}
      onPress={() => onSelect('type', value)}
      borderWidth={1}
      borderRadius={4}
      borderColor={selected ? '$text' : '$line'}
      bg={selected ? '$surfaceMuted' : '$surface'}
      paddingVertical={8}
      alignItems="center"
    >
      <Text
        fontFamily="$body"
        color={selected ? '$text' : '$textMuted'}
        sx={{ fontSize: 14, textTransform: 'capitalize' }}
      >
        {value}
      </Text>
    </Pressable>
  );
}
