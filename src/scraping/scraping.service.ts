import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IScraperUrl } from './scraper-url.interface';
import { ScrapDTO } from './dto';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import { convertEngDigits } from '../common/utils/helper';
import { NoticesService } from '../notices/notices.service';
import { IUserFollow } from 'src/user-follow/user-follow.interface';
import { PushNotificationService } from 'src/push-notification/push-notification.service';
import { PushNotificationDto } from 'src/push-notification/push-notification.dto';

@Injectable()
export class ScrapingService {
  /**
   * Constructor
   * @param {Model<IScraperUrl>} sUrlModel
   * @param {Service<NoticesService>} noticeService
   */
  constructor(
    @InjectModel('ScraperUrl')
    private readonly sUrlModel: Model<IScraperUrl>,
    @InjectModel('UserFollow')
    private readonly uFollowModel: Model<IUserFollow>,
    private readonly noticeService: NoticesService,
    private readonly notificationService: PushNotificationService,
  ) {}

  async scrap() {
    const notifyUrls: any = new Set();
    const res: any = [];
    const urls: any = await this.sUrlModel.find().populate({
      path: 'category',
      select: {
        name: 1,
      },
    });

    for (let i = 0; i < urls.length; i++) {
      const scrapUrl = new ScrapDTO();
      scrapUrl.url = urls[i]?.url;
      const scrapedData: any = await this.getScrappingData(
        scrapUrl,
        urls[i]?.category,
        urls[i]?.title,
      );
      if (scrapedData) {
        for (let j = 0; j < scrapedData.length; j++) {
          if (j > 2) {
            break;
          }
          res.push(scrapedData[j]);
          const response = await this.noticeService.create(scrapedData[j]);
          if (response) {
            notifyUrls.add(response.url);
          }
          // console.log(response);
        }
      }
    }

    notifyUrls.forEach(async (v) => {
      const scUrl = await this.sUrlModel.findOne({ url: v });
      const follow: any = await this.uFollowModel
        .find({ url: scUrl?._id })
        .populate([
          {
            path: 'user',
          },
          {
            path: 'url',
            populate: {
              path: 'category',
            },
          },
        ]);
      if (follow.length > 0) {
        follow.map((f) => {
          if (f.user.fcmToken) {
            const notificationDto = new PushNotificationDto();
            notificationDto.token = f?.user?.fcmToken;
            notificationDto.title = `New post of ${f?.url?.title}`;
            notificationDto.body = `From ${f?.url?.category?.name}`;
            this.notificationService.send(notificationDto);
          }
        });
      }
    });

    const finalRes = res.reduce((group, arr) => {
      const category = arr.category.name;
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

  async getScrappingData(scrap: ScrapDTO, category, linkTitle: string) {
    try {
      const data = await axios.get(scrap.url);
      const $ = cheerio.load(data.data);
      const listItems = $('table.bordered > tbody > tr');
      if (listItems.length === 0) {
        return false;
      }
      const table = [];
      listItems.each((idx, el) => {
        if (idx != 0) {
          const tds = $(el).find('td');
          let sl = $(tds[0]).text();
          let title = $(tds[1]).text();
          let publishedDate: any = convertEngDigits($(tds[2]).text());
          if (tds.length === 6) {
            publishedDate = convertEngDigits($(tds[4]).text());
          }
          if (tds.length === 3) {
            sl = '1';
            title = $(tds[0]).text(); // it is confusing, sometimes column 1 other times columns 0
            publishedDate = convertEngDigits($(tds[1]).text()).split(',')[0];
            if (title.length < 3) {
              sl = $(tds[0]).text();
              title = $(tds[1]).text();
              publishedDate = convertEngDigits($(tds[2]).text()).split(',')[0];
            }
          }
          sl = convertEngDigits(sl).replace(/[^\d]/g, '');
          title = title
            .replace(/[\n\t]|^\d+/g, ' ')
            .replace(/[ ]{2,}/g, ' ')
            .trim();
          publishedDate = publishedDate.replace(/[^\d.-]/g, '');
          let format = 'DD/MM/YYYY';
          if (publishedDate.split('-')[0].length === 4) {
            format = 'YYYY/MM/DD';
          }
          publishedDate = moment(publishedDate, format).valueOf();
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
        }
      });
      return table;
    } catch (err) {
      // throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
      return undefined;
    }
  }
}
