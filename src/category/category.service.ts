import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/users/users.interface';
import { ICategory } from './category.interface';
import { CreateCategoryDTO, CategoryDTO } from './dto';
import { UpdateCategoryDTO } from './dto/update-egory.dto';
import * as moment from 'moment-timezone';

@Injectable()
export class CategoryService {
  /**
   * Constructor
   * @param {Model<ICategory>} CategoryModel
   */
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<ICategory>,
  ) {}

  /**
   * Create Field
   * @param {IUser} user
   * @param {CreateCategoryDTO} cDTO
   * @returns {Promise<ICategory>}
   */
  async create(cDTO: CreateCategoryDTO): Promise<ICategory> {
    try {
      const dto = new CategoryDTO();
      const setData = { ...cDTO, ...dto };
      const registerDoc = new this.categoryModel(setData);
      return await registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    user: IUser,
    id: string,
    uDTO: UpdateCategoryDTO,
  ): Promise<ICategory> {
    try {
      const url = await this.categoryModel.findOne({ _id: id });
      if (!url) {
        return Promise.reject(
          new NotFoundException('Could not find category.'),
        );
      }
      const dto = new CategoryDTO();
      dto.uBy = user._id;
      dto.uTime =
        (dto?.timezone && moment().tz(dto.timezone).valueOf()) || Date.now();
      const setData = { ...uDTO, ...dto };
      return await url.set(setData).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.categoryModel
      .find({ isDeleted: false })
      .populate('scrapperUrls');
  }
}
