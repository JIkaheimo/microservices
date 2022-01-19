import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Redirect,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { UpdateCatDto } from './dto';
import { CreateCatDto } from './dto/create-cat.dto';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Query() query?: { limit: number }) {
    if (query?.limit)
      return `This action returns all cats (limit: ${query.limit} items)`;

    return 'This action returns all cats';
  }

  @Post()
  create(@Body() catData?: CreateCatDto): string {
    return 'This action adds a new cat';
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() catData?: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }

  // MISC ROUTES

  @Get('async')
  async findAllAsync(): Promise<string[]> {
    return ['first', 'second', 'third'];
  }

  @Get('observable')
  findAllObservable(): Observable<string[]> {
    return of(['first', 'second', 'third']);
  }

  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version', ParseIntPipe) version?: number) {
    if (version == 5) {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }
}
