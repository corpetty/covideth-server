import { PubSub } from 'apollo-server';

import * as MESSAGE_EVENTS from './message';
import * as EVENT_EVENTS from './event';

export const EVENTS = {
  MESSAGE: MESSAGE_EVENTS,
  EVENT: EVENT_EVENTS,
};

export default new PubSub();
