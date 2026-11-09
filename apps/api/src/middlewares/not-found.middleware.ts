import type { Request, Response } from 'express';

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: 'Not found', method: req.method, path: req.path });
}
