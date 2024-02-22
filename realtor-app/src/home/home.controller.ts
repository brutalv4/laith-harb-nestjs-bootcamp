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

import { HomeResponseDto } from './dtos/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(): Promise<HomeResponseDto[]> {
    return this.homeService.getHomes();
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
