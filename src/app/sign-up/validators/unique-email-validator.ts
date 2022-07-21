import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { UserService } from '../services/user.service';


@Injectable({
  providedIn: 'root',
})
export class UniqueEmailValidator implements AsyncValidator {

  constructor(private userService: UserService) {}

  validate(
    control: AbstractControl<any, any>
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const value = control.value;

    return this.userService.isEmailTaken(value).pipe(
      map((_) => (_ ? { uniqueEmail: true } : null)),
      catchError(() => of(null))
    );
  }
}
