import Constants from 'expo-constants';

// Where `npm run dev:api` puts the server.
const API_PORT = 4400;

/**
 * A phone has no localhost worth talking to, so the API's address has to be the
 * address of the machine running it. In development that is the same machine
 * serving this bundle, and Expo hands us its host — so the app finds the API on
 * its own, on whatever network it is on, with no address to keep up to date by
 * hand.
 */
export function devApiBaseUrl(): string {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  const host = hostUri?.split(':')[0];

  // Falls back to the simulator's own loopback, which reaches a server on the
  // same Mac. On a real device there is nothing sensible to guess.
  return `http://${host ?? 'localhost'}:${API_PORT}`;
}
