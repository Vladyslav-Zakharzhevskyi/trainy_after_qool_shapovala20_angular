import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ContextService } from './context/context.service';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    TranslateModule
  ]
})
export class TranslationModule {

  // Default language
  private startupLanguage = 'en';

  private languages: Language[] = [
    new Language('en', 'us'),
    new Language('ru', 'ru')
  ];

  constructor(public translate: TranslateService, private context: ContextService) {
    const langs: any[] = [];
    langs.push(this.languages.map(value => value.lang)) ;

    translate.addLangs(langs);

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(context.getLang() || this.startupLanguage);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(context.getLang() || this.startupLanguage);


    // Save changed lang to session storage
    this.subscribe();
  }

  private subscribe(): void {
    this.translate.onLangChange.subscribe(langContext => {
        this.context.setUsedLang(langContext.lang);
      }
    );
  }

  public getLangImgSuffix(lang: string): string {
    return this.languages.find(language => language.lang === lang).iconPrefix;
  }

}

class Language {
  private readonly _lang;
  private readonly _iconPrefix;

  constructor(lang, iconPrefix) {
    this._lang = lang;
    this._iconPrefix = iconPrefix;
  }


  get lang(): any {
    return this._lang;
  }

  get iconPrefix(): any {
    return this._iconPrefix;
  }
}
