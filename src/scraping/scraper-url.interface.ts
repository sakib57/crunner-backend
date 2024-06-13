import { ICategory } from 'src/category/category.interface';

export interface IScraperUrl {
  readonly _id: string;
  readonly url: string;
  readonly category: ICategory;
}
