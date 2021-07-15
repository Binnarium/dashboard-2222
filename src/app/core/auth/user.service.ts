import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
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

      const uid = user.uid;
      const ref = this.userCollection(uid);

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

  private userCollection(uid: string) {
    return this.afFirestore.collection('users').doc<UserRoleDto>(uid);
  }
}