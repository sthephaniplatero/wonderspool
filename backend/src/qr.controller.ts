import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as QRCode from 'qrcode';

/**
 * GET /api/qr          -> PNG
 * GET /api/qr?format=svg
 * GET /api/qr?download=1  (fuerza descarga)
 * La URL codificada sale de PUBLIC_URL (ej. https://menu.tudominio.com)
 */
@Controller('api/qr')
export class QrController {
  @Get()
  @Header('Cache-Control', 'public, max-age=3600')
  async qr(
    @Query('format') format: string = 'png',
    @Query('download') download: string | undefined,
    @Res() res: Response,
  ) {
    const url = process.env.PUBLIC_URL ?? 'http://localhost:3000';
    const opts = {
      errorCorrectionLevel: 'H' as const,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    };
    const svg = format === 'svg';
    if (download) {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="menu-qr.${svg ? 'svg' : 'png'}"`,
      );
    }
    if (svg) {
      res.type('image/svg+xml').send(await QRCode.toString(url, { ...opts, type: 'svg' }));
    } else {
      res.type('image/png').send(await QRCode.toBuffer(url, { ...opts, width: 1024 }));
    }
  }
}
