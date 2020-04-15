export class HeaderItem {

  private _title: string;
  private readonly _key: string;
  private readonly _url: string;
  private readonly _queryParams: object = {};

  constructor(key: string, url: string, queryParams: object) {
    this._key = key;
    this._url = url;
    this._queryParams = queryParams;
  }


  get key(): string {
    return this._key;
  }

  get url(): string {
    return this._url;
  }

  get queryParams(): object {
    return this._queryParams;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }
}
