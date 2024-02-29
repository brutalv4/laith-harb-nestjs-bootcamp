import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PropertyType } from '@prisma/client';

import { HomeResponseDto } from './dtos/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
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
