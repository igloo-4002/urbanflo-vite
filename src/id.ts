import { init } from '@paralleldrive/cuid2';

export const createId = init({
  // the length of the id
  length: 10,
});
