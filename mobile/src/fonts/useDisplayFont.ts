import { useFonts } from 'expo-font';
import { displayFont } from './display';

/** Whether the masthead face is ready to be drawn with. */
export function useDisplayFont(): boolean {
  const [loaded, error] = useFonts(displayFont);

  // A missing face is not worth holding the app back for — the masthead falls
  // back to the system stack, the same way the web app does while it loads.
  return loaded || error !== null;
}
