import type { CipherProvider } from "./types";

import { a1z26Provider } from "./a1z26";
import { brailleProvider } from "./braille";
import { caesarProvider } from "./caesar";
import { morseProvider } from "./morse";
import { pigpenProvider } from "./pigpen";
import { semaphoreProvider } from "./semaphore";
import { wordSearchProvider } from "./word-search";

export const cipherProviders: CipherProvider[] = [
  a1z26Provider,
  caesarProvider,
  morseProvider,
  brailleProvider,
  semaphoreProvider,
  pigpenProvider,
  wordSearchProvider
];

