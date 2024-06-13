import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INotice, IPaginateNotices } from './notices.interface';
import { NoticeDTO } from './dto/notice.dto';
import { SearchQueryDTO } from '../common/dto/searchquery.dto';
import { createSearchQuery } from '../common/utils/helper';
import { IUser } from '../users/users.interface';
import { IUserFollow } from '../user-follow/user-follow.interface';

@Injectable()
export class NoticesService {
  /**
   * Constructor
   * @param {Model<ICategory>} noticeModel
   */
  constructor(
    @InjectModel('Notice')
    private readonly noticeModel: Model<INotice>,
    @InjectModel('UserFollow')
    private readonly userFollowModel: Model<IUserFollow>,
  ) {}

  /**
   * Create Notice
   * @param {NoticeDTO} cDTO
   * @returns {Promise<IUserFollow>}
   */
  async create(cDTO: NoticeDTO): Promise<INotice> {
    try {
      const isExist = await this.noticeModel.find({
        title: cDTO.title,
        publishedDate: cDTO.publishedDate,
        url: cDTO.url,
      });
      if (isExist && Array.isArray(isExist) && isExist.length > 0) {
        return;
      }
      const registerDoc = new this.noticeModel(cDTO);
      return await registerDoc.save();
    } catch (err) {
      console.log(cDTO);
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: err,
      });
    }
  }

  /**
   * Find All notices
   * @param {SearchQueryDTO} query
   * @returns {Promise<IPaginateNotices>}
   */
  async findAll(query: SearchQueryDTO, user: IUser): Promise<IPaginateNotices> {
    try {
      let urls: any = await this.userFollowModel
        .find({
          user: user._id,
        })
        .populate({
          path: 'url',
          select: {
            url: 1,
          },
        })
        .exec();
      urls = urls.map((data) => {
        return data.url.url;
      });
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;

      let cursor;
      if (query.hasOwnProperty('groupBy') && query.groupBy) {
        cursor = this.noticeModel.aggregate([
          {
            $match: {
              ...searchQuery,
              url: { $in: urls },
            },
          },
          { $sort: { publishedDate: -1 } },
          {
            $lookup: {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $addFields: {
              category: { $arrayElemAt: ['$category.name', 0] },
            },
          },
          {
            $group: {
              _id: `$${query.groupBy}`,
              data: { $push: '$$ROOT' },
            },
          },
          {
            $project: {
              _id: 1,
              category: 1,
              data: {
                _id: 1,
                sl: 1,
                linkTitle: 1,
                title: 1,
                url: 1,
                publishedDate: 1,
                file: 1,
                category: 1,
              },
            },
          },
        ]);
      } else {
        cursor = this.noticeModel
          .find({ ...searchQuery, url: { $in: urls } })
          .populate([
            {
              path: 'category',
              select: {
                name: 1,
              },
            },
          ])
          .limit(limit)
          .skip(skip)
          .sort({ publishedDate: -1 });
      }

      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }

      const result: IPaginateNotices = {
        data: {
          notices: await cursor.exec(),
        },
      };

      if (query.pagination) {
        result.pagination = {
          total: await this.noticeModel.countDocuments(searchQuery),
          limit,
          skip,
        };
      }
      return result;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
