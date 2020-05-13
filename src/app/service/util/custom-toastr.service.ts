import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CustomToastrService {

  private successConfig = {
    timeOut: 10000,
    enableHtml: true
  };

  private errorConfig = {
    timeOut: 10000,
    extendedTimeOut: 5000,
    enableHtml: true,
    tapToDismiss: false,
    closeButton: true,
    progressBar: true
  };

  private infoConfig = {
    timeOut: 10000,
    enableHtml: true
  };

  constructor(private toastr: ToastrService) { }

  public success(msg: string, title: string): void {
    this.toastr.success(msg, title, this.successConfig);
  }

  public error(msg: string, title: string): void {
    this.toastr.error(msg, title, this.errorConfig);
  }

  info(msg: string, title: string): void {
    this.toastr.info(msg, title, this.infoConfig);
  }
}
