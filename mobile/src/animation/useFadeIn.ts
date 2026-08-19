import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { FADE_DURATION_MS, FADE_EASING, fadeDelay } from '@pocketledger/shared/animation';

// The web app's entrance, on the same ladder: each block rises 10px into place
// after the one before it. `steps` and the delays both come from shared, so the
// two clients open in the same order at the same pace.
export function useFadeIn(step: number) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: FADE_DURATION_MS,
      delay: fadeDelay(step),
      easing: Easing.bezier(...FADE_EASING),
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [progress, step]);

  return {
    opacity: progress,
    transform: [
      { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) },
    ],
  };
}
