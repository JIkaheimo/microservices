import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { UpdateCatDto, CreateCatDto } from './dto';
import { Cat } from './interfaces';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  async findAll(@Query() query?: { limit: number }): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Post()
  async create(@Body() catData: CreateCatDto): Promise<Cat> {
    return this.catsService.create(catData);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Cat> {
    return this.catsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() catData: UpdateCatDto,
  ): Promise<Cat> {
    return this.catsService.update(id, catData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.catsService.remove(id);
  }
}
