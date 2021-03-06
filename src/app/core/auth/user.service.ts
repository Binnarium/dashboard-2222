import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { UserDto, UserRoleDto } from './user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly afAuth: AngularFireAuth,
    private readonly afFirestore: AngularFirestore,
  ) { }

  public readonly user$: Observable<UserDto | null> = this.afAuth.user.pipe(
    switchMap(user => {
      if (!user)
        return of(null);

      const email = user.email;

      if (!email)
        return of(user as UserDto);

      const ref = this.userDocument(email);

      const userChanges = ref.valueChanges().pipe(
        map(data => data ? Object.assign(data, user) as UserDto : null)
      );
      return userChanges;
    }),
    shareReplay(1),
  );

  public readonly isAdministrator$: Observable<boolean> = this.user$.pipe(
    map(user => !!user?.isAdmin)
  );

  /**
   * Get the firestore document reference to obtain a user
   * @param email required user mail address
   * @returns reference to the user document
   */
  public userDocument(email: string) {
    return this.afFirestore.collection('users').doc<UserRoleDto>(email);
  }
}
