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

interface CreateHomeParams {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  price: number;
  landSize: number;
  propertyType: PropertyType;
  images: { url: string }[];
}

interface UpdateHomeParams {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  price?: number;
  landSize?: number;
  propertyType?: PropertyType;
}

const select = {
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

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(where: GetHomesParam): Promise<HomeResponseDto[]> {
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

  async createHome(
    {
      address,
      city,
      price,
      landSize,
      numberOfBathrooms,
      numberOfBedrooms,
      propertyType,
      images,
    }: CreateHomeParams,
    userId: number,
  ) {
    const home = await this.prismaService.home.create({
      data: {
        address,
        city,
        price,
        land_size: landSize,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        property_type: propertyType,
        realtor_id: userId,
      },
    });

    const homeImages = images.map((image) => ({ ...image, home_id: home.id }));

    await this.prismaService.image.createMany({ data: homeImages });

    return new HomeResponseDto(home);
  }

  async updateHomeById(
    id: number,
    data: UpdateHomeParams,
  ): Promise<HomeResponseDto> {
    // this is just a guard: bypass or throw
    await this.getHomeById(id);

    const updatedHome = await this.prismaService.home.update({
      where: { id },
      data,
    });

    return new HomeResponseDto(updatedHome);
  }

  async deleteHomeById(id: number): Promise<void> {
    await this.prismaService.image.deleteMany({ where: { home_id: id } });
    await this.prismaService.home.delete({ where: { id } });
  }

  async getRealtorByHomeId(id: number) {
    return this.prismaService.home
      .findUniqueOrThrow({
        where: { id },
        select: {
          realtor: {
            select: {
              name: true,
              id: true,
              email: true,
              phone: true,
            },
          },
        },
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }
}
