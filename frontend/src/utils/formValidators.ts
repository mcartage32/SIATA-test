export const noOnlySpaces = (message: string) => ({
  validator(_: unknown, value: string) {
    if (!value || value.trim().length === 0) {
      return Promise.reject(new Error(message));
    }

    return Promise.resolve();
  },
});
