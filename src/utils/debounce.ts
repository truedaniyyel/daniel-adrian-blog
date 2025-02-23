type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

export function debounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 200
): DebouncedFunction<T> {
  let timeoutId: NodeJS.Timeout | undefined;

  // Create the debounced function
  const debouncedFn = (...args: Parameters<T>) => {
    // Clear the previous timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  // Add cancel method
  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debouncedFn;
}
