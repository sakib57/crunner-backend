export interface INotice {
  readonly _id: string;
  readonly category: string;
  readonly sl: string;
  readonly linkTitle: string;
  readonly title: string;
  readonly url: string;
  readonly publishedDate: number;
  readonly file: string;
}

export interface IPaginateNotices {
  data: {
    notices: INotice[];
  };
  message?: string;
  pagination?: {
    total: number;
    limit: number;
    skip: number;
  };
}
