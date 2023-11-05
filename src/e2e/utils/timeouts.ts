import 'dotenv/config';

export const timeouts = {
  small: 2_000,
  waitPageToLoad: Number(process.env.WAIT_PAGE_TO_LOAD_SEC) * 1000,
};
