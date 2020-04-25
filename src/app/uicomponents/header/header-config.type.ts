import { HeaderItem } from './header-item.type';
import { TranslateService } from '@ngx-translate/core';
import { RequireTranslationListener } from '../../_models/interfaces/require-translation-listener.interface';

export class HeaderConfig implements RequireTranslationListener {

  private readonly _description: string = 'Config include data to be applied to header component';
  private readonly _items: HeaderItem[] = [];


  constructor(private translation: TranslateService, items: HeaderItem[]) {
    this._items = items;
    this.translateHeadersTitles();
    this.listenLangChange();
  }

  listenLangChange(): void {
    this.translation.onLangChange.subscribe(lang => {
      this.translateHeadersTitles();
    });
  }

  private translateHeadersTitles(): void {
    this._items.forEach(header => this.translation.get(header.key).subscribe(
      translation =>  header.title = translation
    ));
  }

  get items(): HeaderItem[] {
    return this._items;
  }

}
