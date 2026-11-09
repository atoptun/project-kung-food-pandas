import type { TransportTargetOptions } from 'pino';
import pino from 'pino';

import env from '@/config/env.js';

const devTargets: TransportTargetOptions[] = [
  // Console
  {
    target: 'pino-pretty',
    level: 'debug',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
  // File
  {
    target: 'pino/file',
    level: 'debug',
    options: {
      destination: '../../../../logs/api.log',
      mkdir: true,
    },
  },
];

const logger = pino({
  level: env.IS_TEST ? 'silent' : env.LOG_LEVEL,
  transport: env.IS_DEV
    ? {
        targets: devTargets,
      }
    : undefined,
});

export default logger;
