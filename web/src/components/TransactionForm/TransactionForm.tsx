import { HStack, VStack } from '@gluestack-ui/themed';
import { steps } from '../../animation';
import { cleanAmount } from '@pocketledger/shared/format';
import { useLedgerStore } from '@pocketledger/shared/store';
import { Panel } from '../Panel';
import { SubmitButton } from './SubmitButton';
import { TextField } from './TextField';
import { TypeOption } from './TypeOption';
import { useSubmit } from '@pocketledger/shared/form';

export function TransactionForm() {
  const draft = useLedgerStore((state) => state.draft);
  const setField = useLedgerStore((state) => state.setField);
  const { canSubmit, isSubmitting, submit } = useSubmit();

  return (
    <Panel title="New Transaction" step={steps.form}>
      <VStack space="lg">
        {/* A sunken track holding two halves, so the pair reads as one switch. */}
        <HStack
          space="xs"
          role="radiogroup"
          aria-label="Transaction type"
          bg="$well"
          borderWidth={1}
          borderColor="$line"
          borderRadius={12}
          padding={4}
        >
          <TypeOption value="credit" selected={draft.type === 'credit'} onSelect={setField} />
          <TypeOption value="debit" selected={draft.type === 'debit'} onSelect={setField} />
        </HStack>

        <TextField
          label="Amount"
          value={draft.amount}
          onChangeText={(value) => setField('amount', cleanAmount(value))}
          onSubmitEditing={submit}
          placeholder="0.00"
          prefix="$"
          inputMode="decimal"
          mono
        />

        <TextField
          label="Description"
          value={draft.description}
          onChangeText={(value) => setField('description', value)}
          onSubmitEditing={submit}
          placeholder="What was it for?"
        />

        <SubmitButton onPress={submit} isDisabled={!canSubmit} isSubmitting={isSubmitting} />
      </VStack>
    </Panel>
  );
}
