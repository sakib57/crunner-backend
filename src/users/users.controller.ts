import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  UseGuards,
  UsePipes,
  HttpStatus,
  HttpCode,
  HttpException,
  Headers,
  MethodNotAllowedException,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDTO,
  EmailDTO,
  PasswordDTO,
  ResetPasswordDTO,
  UpdateUserDTO,
} from './dto';
import { IUser } from './users.interface';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ValidationPipe, TrimPipe, NullValidationPipe } from '../common/pipes';
import { User } from '../common/decorators/user.decorator';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiHeader,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';

/**
 * User Controller
 */
@ApiTags('User')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('users')
export class UsersController {
  /**
   * Constructor
   * @param {UsersService} usersService
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a user
   * @Body {CreateUserDTO} createUserDTO
   * @returns {Promise<IUser>} created user data
   */
  @ApiOperation({ summary: 'User registration: create new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new user.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Record already exist',
  })
  @UsePipes(new NullValidationPipe())
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @Post('register')
  public async register(@Body() createUserDTO: CreateUserDTO): Promise<IUser> {
    try {
      return await this.usersService.register(createUserDTO);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('register')
  public registerGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('register')
  public registerPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('register')
  public registerPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('register')
  public registerDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * verify a user's email by token
   * @Headers {Headers} headers
   * @returns {Promise<IUser>} mutated user data
   */
  @ApiOperation({ summary: `User's email verification: token verification` })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return verified user',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Token is expire or Invalid Token',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No token is received',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Custom header',
  })
  // @UseInterceptors(EmailInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('verification/email')
  public async accountVerification(@Headers() headers): Promise<IUser> {
    try {
      const token =
        headers.hasOwnProperty('authorization') && headers['authorization']
          ? headers['authorization']
          : '';
      return await this.usersService.emailVerification(token);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('verification/email')
  public accountVerificationGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('verification/email')
  public accountVerificationPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('verification/email')
  public accountVerificationPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('verification/email')
  public accountVerificationDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * Generate link for user verification
   * @Body {EmailDTO} emailDTO the user given id to fetch
   * @returns {Promise<object>} queried new otp
   */
  @ApiOperation({ summary: 'Generate email link for user verification' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sent token generation message',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Custom header',
  })
  @UsePipes(new ValidationPipe(false))
  @UsePipes(new TrimPipe())
  // @UseInterceptors(EmailInterceptor)
  @Post('generate/link')
  public async generateToken(
    @Headers() headers,
    @Body() emailDTO: EmailDTO,
  ): Promise<Record<any, any>> {
    try {
      const token =
        headers.hasOwnProperty('authorization') && headers['authorization']
          ? headers['authorization']
          : '';
      return await this.usersService.generateEmailVerificationToken(
        emailDTO.email,
        token,
      );
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('generate/link')
  public generateTokenGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('generate/link')
  public generateTokenPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('generate/link')
  public generateTokenPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('generate/link')
  public generateTokenDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /******Password Reset*******/
  /**
   * generate password reset token
   * @param {EmailDTO} emailDTO
   * @returns {Promise<object>}
   */
  @ApiOperation({ summary: 'Password reset token generate link' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return new otp for verification.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  // @UseInterceptors(EmailInterceptor)
  @Post('reset-password/generate/link')
  public generatePasswordResetToken(
    @Body() emailDTO: EmailDTO,
  ): Promise<Record<any, any>> {
    try {
      return this.usersService.generatePasswordResetToken(emailDTO.email);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('reset-password/generate/link')
  public generatePasswordResetTokenGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('reset-password/generate/link')
  public generatePasswordResetTokenPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('reset-password/generate/link')
  public generatePasswordResetTokenPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('reset-password/generate/link')
  public generatePasswordResetTokenDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * reset user password using token
   * @returns {Promise<IUser>}
   * @param headers
   * @param {PasswordDTO} passwordDTO
   */
  @ApiOperation({ summary: 'Password reset' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return updated user.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Token is expire or Invalid Token',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No token is received',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Custom header',
  })
  @ApiBasicAuth()
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  // @UseInterceptors(EmailInterceptor)
  @Patch('forget/password')
  public forgetPassword(
    @Headers() headers,
    @Body() passwordDTO: PasswordDTO,
  ): Promise<IUser> {
    try {
      const token =
        headers.hasOwnProperty('authorization') && headers['authorization']
          ? headers['authorization']
          : '';
      return this.usersService.forgetPassword(token, passwordDTO.password);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('forget/password')
  public forgetPasswordGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Post('forget/password')
  public forgetPasswordPost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('forget/password')
  public forgetPasswordPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('forget/password')
  public forgetPasswordDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * reset user password using token
   * @User {IUser} user
   * @Body {ResetPasswordDTO} data
   * @returns {Promise<object>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Password reset' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return updated user.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Current password is not matched',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  // @UseGuards(JwtAuthGuard)
  @Patch('reset/password')
  public resetPassword(
    @User() user: IUser,
    @Body() passwordDTO: ResetPasswordDTO,
  ): Promise<IUser> {
    try {
      const userId = user._id;
      return this.usersService.resetPassword(
        userId,
        passwordDTO.currentPassword,
        passwordDTO.newPassword,
      );
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('reset/password')
  public resetPasswordGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Post('reset/password')
  public resetPasswordPost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('reset/password')
  public resetPasswordPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('reset/password')
  public resetPasswordDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * update user
   * @User {IUser} user
   * @Body {UserProfileDTO} UserProfileDTO
   * @returns {Promise<IUserProfile>} created user data
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'user update' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return updated user.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @UsePipes(new NullValidationPipe())
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  // @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  public async updateUser(
    @Param('id') id: string,
    @Body() updateDTO: UpdateUserDTO,
    @User() user: IUser,
  ): Promise<IUser> {
    try {
      return this.usersService.update(id, updateDTO, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('update')
  public updateGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Post('update')
  public updatePost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('update')
  public updateDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * Retrieves all user user (Public Api)
   * @returns {Promise<IUser[]>} queried user data
   */
  @ApiOperation({ summary: 'Get all user' })
  @ApiResponse({ status: 200, description: 'Return user information.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User Not found.',
  })
  @Get('user/list')
  public async getAllUser(): Promise<IUser[]> {
    try {
      return await this.usersService.findAll();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Put('list')
  public getAllUserPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('list')
  public getAllUserPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('list')
  public getAllUserDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * Retrieves a particular user (Public Api)
   * @Param {string} profileId
   * @returns {Promise<IUser>} queried user data
   */
  @ApiOperation({ summary: 'Get user from id' })
  @ApiResponse({ status: 200, description: 'Return user information.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User Not found.',
  })
  @Get('user/:id')
  public async getUserById(@Param('id') id: string): Promise<IUser> {
    try {
      return await this.usersService.findOne(id);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Put(':id')
  public getUserByIdPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  public getUserByIdPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  public getUserByIdDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }
}
