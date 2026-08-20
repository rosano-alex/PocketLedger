import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, text } from '../../theme';

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onSubmitEditing: () => void;
  placeholder: string;
  /** A fixed adornment inside the border, e.g. the currency symbol. */
  prefix?: string;
  mono?: boolean;
  keyboardType?: 'default' | 'decimal-pad';
  returnKeyType?: 'next' | 'done';
}

// Both fields share this shell, so their border, height and placeholder
// treatment can only be changed in one place.
//
// The label is drawn, not just announced: a placeholder disappears the moment
// there is a value in the field, which is exactly when the label is worth
// having.
export function TextField({
  label,
  value,
  onChangeText,
  onSubmitEditing,
  placeholder,
  prefix,
  mono = false,
  keyboardType = 'default',
  returnKeyType = 'done',
}: TextFieldProps) {
  return (
    <View>
      <Text style={text.label}>{label}</Text>

      <View style={styles.well}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}

        <TextInput
          style={[styles.input, mono ? styles.mono : styles.plain]}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={colors.hint}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          accessibilityLabel={label}
          // The ledger is the only thing that should be correcting an amount
          // or a description.
          autoCorrect={false}
          autoCapitalize="none"
          selectionColor={colors.accent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  well: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    height: 46,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    // A film of light rather than a hole: on lit panels a dark pit reads as a
    // dead patch, where sky at low alpha still reads as somewhere to type.
    backgroundColor: colors.well,
    paddingHorizontal: 12,
  },
  prefix: {
    fontFamily: fonts.mono,
    fontSize: 15,
    color: colors.hint,
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.text,
    // Android centres single-line input text oddly without this.
    paddingVertical: 0,
  },
  mono: {
    fontFamily: fonts.mono,
    fontSize: 15,
  },
  plain: {
    fontFamily: fonts.body,
    fontSize: 14,
  },
});
