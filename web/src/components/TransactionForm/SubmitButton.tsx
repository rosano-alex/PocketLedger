import { Button, ButtonSpinner, ButtonText } from '@gluestack-ui/themed';

interface SubmitButtonProps {
  onPress: () => void;
  isDisabled: boolean;
  isSubmitting: boolean;
}

// The page's only filled control. Its lift and coral glow are in styles.css
// under [data-cta] — transitions have no equivalent in the RN style system.
export function SubmitButton({ onPress, isDisabled, isSubmitting }: SubmitButtonProps) {
  return (
    <Button
      onPress={onPress}
      isDisabled={isDisabled}
      dataSet={{ cta: true }}
      height={46}
      borderRadius={10}
      bg="$accent"
      sx={{ ':hover': { bg: '$accentHover' }, ':disabled': { opacity: 0.35 } }}
    >
      {isSubmitting ? <ButtonSpinner marginRight="$2" color="$onFill" /> : null}
      <ButtonText
        fontFamily="$heading"
        color="$onFill"
        sx={{ fontSize: 15, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' }}
      >
        {isSubmitting ? 'Posting…' : 'Post transaction'}
      </ButtonText>
    </Button>
  );
}
