import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {

  constructor( private snackBarService: MatSnackBar) { }

  public showSnackBar(message: string, type: string, duration: number) {
    return this.snackBarService.open(message,
      "",{panelClass: "snack-" + type, duration: duration});
  }

}
