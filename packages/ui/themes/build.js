import pkg from './package.json' assert { type: 'json' };
import builder from '@rfm-util/builder';

builder.run({ pkg });
