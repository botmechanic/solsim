import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { errorMiddleware } from './middleware/errors.js';
import { createRedactedLogger } from './middleware/logRedactor.js';
import { mintsRouter } from './routes/mints.js';
import { plansRouter } from './routes/plans.js';

dotenv.config();

const PORT = Number(process.env.PORT ?? 8787);
const log = createRedactedLogger();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json({ limit: '32kb' }));
app.use('/nft', express.static(path.join(__dirname, '../public/nft')));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'solsim-api' });
});

app.get('/v1/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'solsim-api' });
});

app.use('/v1', plansRouter);
app.use('/v1', mintsRouter);

app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    log.info(`[solsim-api] listening on :${PORT}`);
  });
}

export { app };
