import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  ButtonText,
  Heading,
  Text,
} from '@gluestack-ui/themed';
import { useLedgerStore } from '../../store';
import { backdropSx, contentSx } from './animation';
import { toneStyle } from './tone';

// A refusal is the ledger's answer to a submit, so it interrupts: the dialog
// takes focus and has to be dismissed before the form can be corrected.
//
// Dismissing is an EDIT — same path a keystroke takes — which clears the
// notice and puts the machine back to idle. `notice` is the only source of
// truth for whether this is open, so there's no second flag to disagree with.
export function NoticeDialog() {
  const notice = useLedgerStore((state) => state.notice);
  const dispatch = useLedgerStore((state) => state.dispatch);

  const close = () => dispatch({ type: 'EDIT' });

  const { title, colour } = toneStyle(notice);

  return (
    <AlertDialog isOpen={notice !== null} onClose={close}>
      <AlertDialogBackdrop bg="#000" sx={backdropSx} />

      <AlertDialogContent
        bg="$surface"
        borderWidth={1}
        borderColor={colour}
        borderRadius={16}
        maxWidth={420}
        width="100%"
        sx={contentSx}
      >
        <AlertDialogHeader borderBottomWidth={1} borderBottomColor="$line" paddingBottom="$3">
          <Heading
            fontFamily="$heading"
            color={colour}
            sx={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.7, textTransform: 'uppercase' }}
          >
            {title}
          </Heading>
        </AlertDialogHeader>

        <AlertDialogBody paddingTop="$4" paddingBottom="$4">
          <Text fontFamily="$body" color="$text" sx={{ fontSize: 14.5, lineHeight: 21 }}>{notice?.message}</Text>
        </AlertDialogBody>

        <AlertDialogFooter borderTopWidth={1} borderTopColor="$line" paddingTop="$3">
          <Button
            onPress={close}
            dataSet={{ cta: true }}
            height={40}
            borderRadius={10}
            bg="$accent"
            sx={{ ':hover': { bg: '$accentHover' } }}
          >
            <ButtonText
              fontFamily="$heading"
              color="$onAccent"
              sx={{ fontSize: 11.5, fontWeight: '600', letterSpacing: 1.3, textTransform: 'uppercase' }}
            >
              Back to the form
            </ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
