import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable, of } from 'rxjs';
import { catchError, mapTo } from 'rxjs/operators';
import { IntroductionDto } from './introduction.dto';

@Injectable({
  providedIn: 'root'
})
export class SaveIntroductionService {

  constructor(
    private readonly afFirestore: AngularFirestore,
  ) { }

  public save$(cityId: string, payload: IntroductionDto): Observable<boolean> {
    const saveTask = this.afFirestore.collection('cities')
      .doc(cityId)
      .collection('pages')
      .doc<IntroductionDto>('introduction')
      .set(payload, { merge: true });

    return from(saveTask).pipe(
      mapTo(true),
      catchError(_ => of(false)),
    );
  }
}
