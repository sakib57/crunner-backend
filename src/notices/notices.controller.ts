import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  MethodNotAllowedException,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { User } from '../common/decorators/user.decorator';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { IUser } from '../users/users.interface';
import { SearchQueryDTO } from '../common/dto/searchquery.dto';
import { IPaginateNotices } from './notices.interface';
import { NoticesService } from './notices.service';

/**
 * Notice Controller
 */
@ApiTags('Notice')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('notices')
export class NoticesController {
  /**
   * Constructor
   * @param {NoticesService} noticeService
   */
  constructor(private readonly noticeService: NoticesService) {}

  /**
   * find all notice
   * @returns {Promise<IPaginateNotices>}
   */
  @ApiOperation({ summary: 'Get all Notices' })
  @UsePipes(new ValidationPipe(true))
  @UseGuards(JwtAuthGuard)
  @Get()
  public findAll(
    @Query() query: SearchQueryDTO,
    @User() user: IUser,
  ): Promise<IPaginateNotices> {
    try {
      return this.noticeService.findAll(query, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
  @ApiExcludeEndpoint()
  @Post()
  public findAllPost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put()
  public findAllPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch()
  public findAllPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete()
  public findAllDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }
}
