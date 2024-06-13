import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
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
import { IUserFollow } from './user-follow.interface';
import { CreateUserFollowDTO } from './dto';
import { UserFollowService } from './user-follow.service';

@ApiTags('User-Follow')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('user-follow')
export class UserFollowController {
  /**
   * Constructor
   * @param {UserFollowService} UserFollowService
   */

  constructor(private readonly userFollowService: UserFollowService) {}

  /**
   * Url create
   * @Body {CreateFieldDTO} cFieldDTO
   * @User user: IUser
   * @returns {Promise<IField>}
   */
  @ApiOperation({ summary: 'follow creation' })
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
    @Body() createUserFollowDto: CreateUserFollowDTO,
  ): Promise<IUserFollow> {
    try {
      return this.userFollowService.create(user, createUserFollowDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':user_id')
  findAll(@Param('user_id') user_id: string) {
    return this.userFollowService.findAll(user_id);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFollowService.remove(id);
  }
}
