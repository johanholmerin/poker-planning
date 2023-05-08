import { z } from 'zod';
import { Connect, Score, Finish, Restart } from '../shared/messages';

const Connect: z.ZodType<Connect> = z.object({
  type: z.literal('CONNECT'),
});

const Score: z.ZodType<Score> = z.object({
  type: z.literal('SCORE'),
  value: z.number(),
});

const Finish: z.ZodType<Finish> = z.object({
  type: z.literal('FINISH'),
});

const Restart: z.ZodType<Restart> = z.object({
  type: z.literal('RESTART'),
});

export const Message = z.union([Connect, Score, Finish, Restart]);
