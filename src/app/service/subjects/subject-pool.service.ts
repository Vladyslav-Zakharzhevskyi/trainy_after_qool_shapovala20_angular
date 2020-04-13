import {Injectable} from "@angular/core";
import {Subject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SubjectPoolService {
  public static LOGIN_LOGOUT_ACTION = "login-logout:Action";

  private subjectsPool$: SubjectItem[] = [];

  addSubjectToPool(name: string, subject: Subject<any>): Subject<any> {
    this.subjectsPool$.push(new SubjectItem(name, subject));
    return subject;
  }

  triggerSubject(name: string, value: any): void {
    let subjectItem = this.subjectsPool$.find(item => item.getName()===name);
    subjectItem.getSubject().next(value);
  }

  removeSubject(name: string): void {
    let subjectItemIdx = this.subjectsPool$.findIndex(item => item.getName()===name);
    if (subjectItemIdx) {
      this.subjectsPool$.splice(subjectItemIdx, 1);
    }
  }
}


export class SubjectItem {

  private readonly name: string;
  private readonly subject: Subject<any>;

  constructor(name: string, subject: Subject<any>) {
    this.name = name;
    this.subject = subject;
  }

  public getName(): string {
    return this.name;
  }

  public getSubject(): Subject<any>{
    return this.subject;
  }

}
