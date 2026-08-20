import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { noticeTitle } from '@pocketledger/shared/submission';
import { useLedgerStore } from '@pocketledger/shared/store';
import { colors, fonts, text } from '../theme';

// A refusal is the ledger's answer to a submit, so it interrupts: the dialog
// has to be dismissed before the form can be corrected.
//
// Dismissing is an EDIT — the same path a keystroke takes — which clears the
// notice and puts the machine back to idle. `notice` is the only source of
// truth for whether this is open, so there is no second flag to disagree with.
export function NoticeDialog() {
  const notice = useLedgerStore((state) => state.notice);
  const dispatch = useLedgerStore((state) => state.dispatch);

  const close = () => dispatch({ type: 'EDIT' });
  const colour = notice?.tone === 'refused' ? colors.danger : colors.warn;

  return (
    <Modal
      visible={notice !== null}
      transparent
      animationType="fade"
      // Android's back button is a dismissal like any other.
      onRequestClose={close}
    >
      <View style={styles.scrim}>
        <View style={[styles.card, { borderColor: colour }]}>
          <View style={styles.header}>
            <Text style={[text.label, styles.title, { color: colour }]}>{noticeTitle(notice)}</Text>
          </View>

          <Text style={styles.message}>{notice?.message}</Text>

          <View style={styles.footer}>
            <Pressable
              onPress={close}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              accessibilityRole="button"
            >
              <Text style={styles.buttonLabel}>Back to the form</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: colors.page,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingBottom: 12,
  },
  title: {
    fontSize: 11,
    letterSpacing: 1.7,
  },
  message: {
    ...text.body,
    fontSize: 14.5,
    lineHeight: 21,
    paddingVertical: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 16,
  },
  button: {
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: colors.accentPressed,
  },
  buttonLabel: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: colors.onAccent,
  },
});
