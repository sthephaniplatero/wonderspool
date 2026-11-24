import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MenuController } from './menu.controller';
import { QrController } from './qr.controller';

@Module({
  imports: [
    // Sirve el frontend compilado de Vite (frontend/dist)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
      exclude: ['/api{/*path}'],
    }),
  ],
  controllers: [MenuController, QrController],
})
export class AppModule {}
