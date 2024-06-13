import { IScraperUrl } from '../scraper-url/scraper-url.interface';

export interface IUserFollow {
  readonly _id: string;
  readonly user: string;
  readonly url: IScraperUrl;
}
