import { Controller, Get } from '@nestjs/common';
import { MENU } from './menu.data';

@Controller('api/menu')
export class MenuController {
  @Get()
  getMenu() {
    return MENU;
  }
}
