import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/users/users.interface';
import {
  CreateScraperUrlDTO,
  UpdateScraperUrlDTO,
  ScraperUrlDTO,
  ScrapDTO,
} from './dto';
import { IScraperUrl } from './scraper-url.interface';
import * as moment from 'moment-timezone';
import axios from 'axios';
import cheerio from 'cheerio';
import { UserFollowService } from 'src/user-follow/user-follow.service';

@Injectable()
export class ScraperUrlService {
  /**
   * Constructor
   * @param {Model<IScraperUrl>} sUrlModel
   */
  constructor(
    @InjectModel('ScraperUrl')
    private readonly sUrlModel: Model<IScraperUrl>,
    private readonly uFService: UserFollowService,
  ) {}

  /**
   * Create Field
   * @param {IUser} user
   * @param {CreateScraperUrlDTO} cDTO
   * @returns {Promise<IScraperUrl>}
   */
  async create(user: IUser, cDTO: CreateScraperUrlDTO): Promise<any> {
    try {
      // const scrapDto = new ScrapDTO();
      // scrapDto.url = cDTO.url;
      // const resp = await this.getScrappingData(scrapDto, 'oo', 'ppp');
      // if (!resp) {
      //   throw new ForbiddenException('Url not valid');
      // }
      const dto = new ScraperUrlDTO();
      dto.cBy = user._id;
      dto.cTime =
        (cDTO?.timezone && moment().tz(cDTO.timezone).valueOf()) || Date.now();
      const setData = { ...cDTO, ...dto };
      const registerDoc = new this.sUrlModel(setData);
      return await registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.sUrlModel.find({ isDeleted: false }).populate({
      path: 'category',
      select: { name: 1 },
    });
  }

  async findOne(id: string) {
    return await this.sUrlModel.findOne({ _id: id });
  }

  /**
   * Update Position
   * @param {IUser} user
   * @param {string} id
   * @param {UpdateScraperUrlDTO} uDTO
   * @returns {Promise<IPositions>}
   */
  async update(
    user: IUser,
    id: string,
    uDTO: UpdateScraperUrlDTO,
  ): Promise<any> {
    try {
      const url = await this.sUrlModel.findOne({ _id: id });
      if (!url) {
        throw Promise.reject(new NotFoundException('Could not find url.'));
      }
      if (uDTO.url && uDTO.url != '') {
        const scrapDto = new ScrapDTO();
        scrapDto.url = uDTO.url;
        const resp = await this.getScrappingData(scrapDto, 'oo', 'ppp');
        if (!resp) {
          return new ForbiddenException('Url not valid');
        }
      }
      const dto = new ScraperUrlDTO();
      dto.uBy = user._id;
      dto.uTime =
        (dto?.timezone && moment().tz(dto.timezone).valueOf()) || Date.now();
      const setData = { ...uDTO, ...dto };
      return await url.set(setData).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  async scrap(user: IUser) {
    const res: any = [];
    const urls: any = await this.uFService.findAll(user?._id);

    for (let i = 0; i < urls.length; i++) {
      const scrapUrl = new ScrapDTO();
      scrapUrl.url = urls[i]?.url?.url;
      const scrapedData: any = await this.getScrappingData(
        scrapUrl,
        urls[i]?.url?.category?.name,
        urls[i]?.url?.title,
      );
      for (let j = 0; j < scrapedData.length; j++) {
        if (j > 2) {
          break;
        }
        res.push(scrapedData[j]);
      }
    }

    const finalRes = res.reduce((group, arr) => {
      const category = arr.category;
      group[category] = group[category] ?? [];
      group[category].push(arr);
      return group;
    }, {});

    const arrayOfObjects = Object.entries(finalRes).map(
      ([category, scrapData]) => {
        return { category: category, scrapData };
      },
    );

    return arrayOfObjects;
  }

  async getScrappingData(scrap: ScrapDTO, category: string, linkTitle: string) {
    try {
      const data = await axios.get(scrap.url);
      const $ = cheerio.load(data.data);
      const listItems = $('table.bordered > tbody > tr');
      if (listItems.length > 0) {
        const table = [];
        listItems.each((idx, el) => {
          const tds = $(el).find('td');
          const sl = $(tds[0]).text();
          let title = $(tds[1]).text();
          const publishedDate = $(tds[2]).text();
          const pattern = /[\n\t]|^\d+/g;
          title = title
            .replace(pattern, ' ')
            .replace(/[ ]{2,}/g, ' ')
            .trim();
          const file = $(tds[3]).find('a').attr('href');
          const url = scrap.url;
          table.push({
            sl,
            linkTitle,
            category,
            title,
            url,
            publishedDate,
            file,
          });
        });
        return table;
      } else {
        return false;
      }
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
