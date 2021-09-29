import { NextFunction, Request, Response } from 'express'

export function noCache (_req: Request, res: Response, next: NextFunction) {
  res.set('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.set('pragma', 'no-cache')
  res.set('exprires', '0')
  res.set('surrogate-control', 'no-store')
  next()
}
