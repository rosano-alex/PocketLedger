import { StyleSheet, View } from 'react-native';
import { steps } from '@pocketledger/shared/animation';
import { useSubmit } from '@pocketledger/shared/form';
import { cleanAmount } from '@pocketledger/shared/format';
import { useLedgerStore } from '@pocketledger/shared/store';
import { Panel } from '../Panel';
import { SubmitButton } from './SubmitButton';
import { TextField } from './TextField';
import { TypeSwitch } from './TypeSwitch';

// Every decision this form makes — what the amount parses to, whether the
// button is live, what pressing it does — is `useSubmit`, which the web app
// runs too. Only the markup below is this platform's.
export function TransactionForm() {
  const draft = useLedgerStore((state) => state.draft);
  const setField = useLedgerStore((state) => state.setField);
  const { canSubmit, isSubmitting, submit } = useSubmit();

  return (
    <Panel title="New Transaction" step={steps.form}>
      <View style={styles.stack}>
        <TypeSwitch value={draft.type} onSelect={setField} />

        <TextField
          label="Amount"
          value={draft.amount}
          onChangeText={(value) => setField('amount', cleanAmount(value))}
          onSubmitEditing={submit}
          placeholder="0.00"
          prefix="$"
          keyboardType="decimal-pad"
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
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 18,
  },
});
