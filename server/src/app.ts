import { access } from 'node:fs/promises';
import { join } from 'node:path';
import express, { type Express, type Response } from 'express';
import type { ApiResponse } from '@pocketledger/shared';
import type { Ledger } from './ledger.js';

// Every responce is 200 or 500. A refusal is a 200: the request was handled,
// the ledger just said no. 500 means the server itself failed.
export async function createApp(ledger: Ledger, webRoot?: string): Promise<Express> {
  const app = express();
  app.use(express.json({ limit: '16kb' }));

  app.get('/api/account', (_req, res) => send(res, 200, { ok: true, data: ledger.summary() }));

  app.get('/api/transactions', (_req, res) => send(res, 200, { ok: true, data: ledger.recent() }));

  app.post('/api/transactions', (req, res, next) => {
    ledger
      .post(req.body)
      .then((outcome) => {
        if (!outcome.ok) {
          send(res, outcome.fault ? 500 : 200, { ok: false, error: outcome.error });
          return;
        }

        // Postings are serialsed, so the newest entry is the one just written.
        const { transactions, balance } = ledger.recent();
        send(res, 200, { ok: true, data: { transaction: transactions[0]!, balance } });
      })
      .catch(next);
  });

  if (webRoot && (await exists(join(webRoot, 'index.html')))) {
    app.use(express.static(webRoot));

    // The UI is a signle page, so any non-API path returns index.html.
    app.use((req, res, next) => {
      if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
      res.sendFile(join(webRoot, 'index.html'));
    });
  }

  app.use(((err, _req, res, _next) => {
    // An unparseable body never reaches a route; answer with the usual envelope.
    const malformed = err instanceof SyntaxError && 'body' in err;
    if (!malformed) console.error('[http]', err);

    send(res, malformed ? 200 : 500, {
      ok: false,
      error: malformed
        ? { code: 'INVALID_INPUT', message: 'Invalid JSON.' }
        : { code: 'STORAGE_FAILURE', message: 'Something went wrong.' },
    });
  }) as express.ErrorRequestHandler);

  return app;
}


function send<T>(res: Response, status: 200 | 500, body: ApiResponse<T>): void {

  res.status(status).json(body);
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
