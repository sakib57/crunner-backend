import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { TrimPipe, ValidationPipe } from 'src/common/pipes';
import { IUser } from '../users/users.interface';
import { ScraperUrlService } from './scraper-url.service';
import { CreateScraperUrlDTO, UpdateScraperUrlDTO } from './dto';
import { IScraperUrl } from './scraper-url.interface';

@ApiTags('scraper-url')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('scraper-url')
export class ScraperUrlController {
  /**
   * Constructor
   * @param {ScraperUrlService} scraperUrlService
   */

  constructor(private readonly scraperUrlService: ScraperUrlService) {}

  /**
   * Url create
   * @Body {CreateFieldDTO} cFieldDTO
   * @User user: IUser
   * @returns {Promise<IField>}
   */
  @ApiOperation({ summary: 'url creation' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return url.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Record already exist',
  })
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @User() user: IUser,
    @Body() createScraperUrlDto: CreateScraperUrlDTO,
  ): Promise<IScraperUrl> {
    try {
      return this.scraperUrlService.create(user, createScraperUrlDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.scraperUrlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scraperUrlService.findOne(id);
  }

  /**
   * Url update
   * @Body {UpdateScraperUrlDTO} uDTO
   * @User user: IUser
   * @returns {Promise<IScraperUrl>}
   */
  @ApiOperation({ summary: 'Field update' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return url.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() uDTO: UpdateScraperUrlDTO,
  ): Promise<IScraperUrl> {
    try {
      return this.scraperUrlService.update(user, id, uDTO);
    } catch (err) {
      console.log(err);
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Fetch scrapped data
   * @Body {ScrapDTO} scrap
   * @returns {Promise<any>}
   */
  @ApiOperation({ summary: 'Fetch scrapped data' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Record already exist',
  })
  @UseGuards(JwtAuthGuard)
  @Post('scrap')
  getScrappedData(@User() user: IUser): Promise<any> {
    try {
      return this.scraperUrlService.scrap(user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
