import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserFollow } from './user-follow.interface';
import { CreateUserFollowDTO, UserFollowDTO } from './dto';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class UserFollowService {
  /**
   * Constructor
   * @param {Model<IUserFollow>} userFollowModel
   */
  constructor(
    @InjectModel('UserFollow')
    private readonly userFollowModel: Model<IUserFollow>,
  ) {}

  /**
   * Create Field
   * @param {IUser} user
   * @param {CreateUserFollowDTO} cDTO
   * @returns {Promise<IUserFollow>}
   */
  async create(user: IUser, cDTO: CreateUserFollowDTO): Promise<IUserFollow> {
    try {
      const dto = new UserFollowDTO();
      dto.user = user._id;
      const setData = { ...cDTO, ...dto };
      const registerDoc = new this.userFollowModel(setData);
      return await registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(user_id: string) {
    return await this.userFollowModel.find({ user: user_id }).populate({
      path: 'url',
      populate: 'category',
    });
  }

  remove(id: string) {
    return this.userFollowModel.deleteOne({ _id: id });
  }
}
