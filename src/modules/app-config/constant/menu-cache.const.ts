export const MENU_CACHE_KEY = {
  BY_PARENT: (parentId?: string) => `menu:by-parent:${parentId || 'root'}`,
};

export const MENU_CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 60 * 5, // 5 minutes
  LONG: 60 * 60 * 12, // 12 hours
};
