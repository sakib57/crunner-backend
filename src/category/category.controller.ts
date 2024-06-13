import {
  Body,
  Controller,
  Delete,
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
import { TrimPipe, ValidationPipe } from 'src/common/pipes';
import { ICategory } from './category.interface';
import { CreateCategoryDTO } from './dto';
import { CategoryService } from './category.service';
import { UpdateCategoryDTO } from './dto/update-egory.dto';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/users/users.interface';

@ApiTags('Category')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('category')
export class CategoryController {
  /**
   * Constructor
   * @param {CategoryService} CategoryService
   */

  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Url create
   * @Body {CreateCategoryTO} cCategoryDTO
   * @User user: IUser
   * @returns {Promise<ICategory>}
   */
  @ApiOperation({ summary: 'category creation' })
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
  create(@Body() createCategoryDto: CreateCategoryDTO): Promise<ICategory> {
    try {
      return this.categoryService.create(createCategoryDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Url create
   * @Body {CreateCategoryTO} cCategoryDTO
   * @User user: IUser
   * @returns {Promise<ICategory>}
   */
  @ApiOperation({ summary: 'category update' })
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
  @Patch(':id')
  update(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDTO,
  ): Promise<ICategory> {
    try {
      return this.categoryService.update(user, id, updateCategoryDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
}
