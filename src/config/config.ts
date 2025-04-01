export const CONFIG = {
  refresh_token: {
    cookie_key: 'refresh_token',
    expired_days: 1,
    deleted_from_db_after_days: 3,
    max_amount_per_user: Number.MAX_SAFE_INTEGER,
  },
  access_token: {
    expired_minutes: 5,
  },
};
