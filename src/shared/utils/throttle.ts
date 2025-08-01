export const throttle = <T extends (...args: any[]) => void>(callback: T, delay: number = 400) => {
  const state = { isThrottling: false };

  return (...arg: Parameters<T>) => {
    if (state.isThrottling) return;

    callback(...arg);
    state.isThrottling = true;

    setTimeout(() => (state.isThrottling = false), delay);
  };
};
