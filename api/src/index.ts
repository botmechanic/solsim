import cors from 'cors';
import express from 'express';
import { errorMiddleware } from './middleware/errors.js';
import { createRedactedLogger } from './middleware/logRedactor.js';
import { plansRouter } from './routes/plans.js';

const PORT = Number(process.env.PORT ?? 8787);
const log = createRedactedLogger();

const app = express();
app.use(cors());
app.use(express.json({ limit: '32kb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'solsim-api' });
});

app.get('/v1/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'solsim-api' });
});

app.use('/v1', plansRouter);

app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    log.info(`[solsim-api] listening on :${PORT}`);
  });
}

export { app };
