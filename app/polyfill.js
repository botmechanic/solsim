/**
 * Must load before @solana/web3.js (Solana Mobile RN setup).
 * @format
 */
import 'react-native-get-random-values';
import 'text-encoding-polyfill';
import { Buffer } from 'buffer';

global.Buffer = global.Buffer || Buffer;
