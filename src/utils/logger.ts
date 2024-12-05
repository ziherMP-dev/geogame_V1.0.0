const DEBUG = true;

export const logger = {
  debug: (...args: unknown[]) => {
    if (DEBUG) {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  }
};