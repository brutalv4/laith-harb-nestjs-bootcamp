import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { HomeResponseDto } from './dtos/home.dto';

interface GetHomesParam {
  city?: string;
  propertyType?: PropertyType;
  price?: {
    lte?: number;
    gte?: number;
  };
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(where: GetHomesParam): Promise<HomeResponseDto[]> {
    const select = this.getSelectFields();
    const homes = await this.prismaService.home.findMany({
      select,
      where,
    });

    if (!homes.length) {
      throw new NotFoundException();
    }

    return homes.map((home) => {
      const next = { ...home, image: home.images[0].url };
      delete next.images;
      return new HomeResponseDto(next);
    });
  }

  async getHomeById(id: number) {
    const select = this.getSelectFields();
    const home = await this.prismaService.home
      .findUniqueOrThrow({
        select: {
          ...select,
          images: { select: { url: true } },
          realtor: { select: { name: true, email: true, phone: true } },
        },
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('No Home found');
      });

    return new HomeResponseDto(home);
  }

  private getSelectFields() {
    return {
      id: true,
      address: true,
      city: true,
      price: true,
      property_type: true,
      number_of_bathrooms: true,
      number_of_bedrooms: true,
      images: {
        select: {
          url: true,
        },
        take: 1,
      },
    };
  }
}
