import { Input, InputField, InputSlot, Text, VStack } from '@gluestack-ui/themed';

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onSubmitEditing: () => void;
  placeholder: string;
  // A fixed adornment inside the border, e.g. the currency symbol.
  prefix?: string;
  mono?: boolean;
  inputMode?: 'text' | 'decimal';
}

// Both fields in the form share this shell, so their border, height and
// placeholder treatment can only be changed in one place.
//
// The label is drawn, not just announced: a placeholder disappears the moment
// there's a value in the field, which is exactly when the label is worth
// having. The keyboard ring is in styles.css — react-native-web strips the
// UA outline.
export function TextField({
  label,
  value,
  onChangeText,
  onSubmitEditing,
  placeholder,
  prefix,
  mono = false,
  inputMode = 'text',
}: TextFieldProps) {
  return (
    <VStack space="xs">
      <Text
        fontFamily="$heading"
        color="$hint"
        sx={{ fontSize: 10, fontWeight: '600', letterSpacing: 1.4, textTransform: 'uppercase' }}
      >
        {label}
      </Text>

      <Input borderColor="$line" bg="$well" borderRadius={10} height={46}>
        {prefix ? (
          <InputSlot paddingLeft="$3">
            <Text fontFamily="$mono" color="$hint" sx={{ fontSize: 15 }}>
              {prefix}
            </Text>
          </InputSlot>
        ) : null}

        <InputField
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor="$hint"
          inputMode={inputMode}
          fontFamily={mono ? '$mono' : '$body'}
          color="$text"
          dataSet={{ figure: mono }}
          sx={{ fontSize: mono ? 15 : 14 }}
          aria-label={label}
        />
      </Input>
    </VStack>
  );
}
