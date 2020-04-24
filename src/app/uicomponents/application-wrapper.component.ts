import {Component} from '@angular/core';
import {SubjectPoolService} from '../service/subjects/subject-pool.service';
import {ContextService} from '../service/context/context.service';
import {ApiService} from '../api/api.service';
import {Router} from '@angular/router';
import {AuthenticationStateService} from '../service/subjects/authentication-state.service';
import {TranslateService} from '@ngx-translate/core';
import {TranslationModule} from '../service/translation.module';

@Component({
  selector: 'application-wrapper',
  templateUrl: 'application-wrapper.html',
  styleUrls: ['./application-wrapper.css']
})
export class ApplicationWrapperComponent {



  constructor(private router: Router,
              private context: ContextService,
              private subjectPoolService: SubjectPoolService,
              private authState: AuthenticationStateService,
              private api: ApiService,
              public translation: TranslateService,
              public translationModule: TranslationModule) {
    this.init();
  }

  private init() {
    // Get application settings
    this.getApplicationSettings();
  }

  private getApplicationSettings() {
    this.api.getApplicationSettings().subscribe(applicationSettings => {
      if (applicationSettings != null) {
        this.context.setApplicationSettings(applicationSettings);
      }
    });
  }




}

