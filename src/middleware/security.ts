import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// 1. Configuración básica de Helmet para seguridad de headers
export const securityHeaders = helmet();

// 2. Rate Limiting para prevenir ataques de fuerza bruta
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100 // límite de 100 solicitudes por ventana
});

// 3. Validación de contenido JSON
export const validateJsonContent = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  next();
};

// 4. Sanitización básica de entrada
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};

// 5. Validación de origen de solicitudes
export const validateOrigin = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = ['http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  next();
};