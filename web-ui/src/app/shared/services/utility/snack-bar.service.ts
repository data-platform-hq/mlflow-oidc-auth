import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CORE_CONFIGS } from '../../../core/configs/core';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(
    private readonly snackBarService: MatSnackBar,
  ) { }

  openErrorSnackBar(message: string) {
    return this.snackBarService.open(message, 'OK', {
      duration: CORE_CONFIGS.SNACK_BAR_DURATION
    });
  }
}
