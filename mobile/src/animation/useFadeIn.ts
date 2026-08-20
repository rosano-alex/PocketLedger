import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { FADE_DURATION_MS, FADE_EASING, fadeDelay } from '@pocketledger/shared/animation';

// The web app's entrance, on the same ladder: each block rises 10px into place
// after the one before it. `steps` and the delays both come from shared, so the
// two clients open in the same order at the same pace.
export function useFadeIn(step: number) {
  const progress = useRef(new Animated.Value(0)).current;

  // Read once. A row's step is its position in the list, so posting a
  // transaction shifts every existing row's step by one — and depending on it
  // here would start a fresh animation on all five. Nothing would move, since
  // the value is already at rest, but it schedules five native animations for
  // no reason on every post and every pull to refresh.
  const delay = useRef(fadeDelay(step)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: FADE_DURATION_MS,
      delay,
      easing: Easing.bezier(...FADE_EASING),
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [progress, delay]);

  // Held steady, or every render would hand Animated.View a new style object to
  // diff against the old one.
  return useMemo(
    () => ({
      opacity: progress,
      transform: [
        { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) },
      ],
    }),
    [progress],
  );
}
