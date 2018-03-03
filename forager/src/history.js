import InMemory from '@hickory/in-memory';
import { parse, stringify } from 'qs';

export default InMemory({
  query: { stringify, parse }
});
