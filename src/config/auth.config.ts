export const AUTH_CONFIG = {
  refreshToken: {
    key: 'refresh_token',
    expired_seconds: 1 * 24 * 60 * 60,
    deleted_from_db_after_days: 3,
    max_amount_per_user: Number.MAX_SAFE_INTEGER,
  },
  accessToken: {
    key: 'access_token',
    expired_seconds: 5 * 60,
  },
};
