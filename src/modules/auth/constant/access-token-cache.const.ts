export const ACCESS_TOKEN_CACHE_KEY = {
  blackList: (tokenJti: string) => `ACCESS_TOKEN:BL:${tokenJti}`,
};
