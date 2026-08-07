/**
 * With `adb reverse tcp:8787 tcp:8787`, both emulator and physical devices
 * reach the host API at 127.0.0.1. (10.0.2.2 is emulator-only.)
 */
export const API_BASE_URL = 'http://127.0.0.1:8787';

export const PLANS_PATH = '/v1/plans';
