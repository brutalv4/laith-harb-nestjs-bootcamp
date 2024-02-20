import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('home')
export class HomeController {
  @Get()
  getHomes() {
    return [];
  }

  @Get(':id')
  getHome(@Param('id') id: string) {
    return { id };
  }

  @Post()
  createHome() {
    return {};
  }

  @Put(':id')
  updateHome(@Param('id') id: string) {
    return { id };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteHome(@Param('id') id: string) {}
}
