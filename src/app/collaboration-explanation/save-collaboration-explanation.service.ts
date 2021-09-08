import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { catchError, mapTo } from 'rxjs/operators';
import { CollaborationExplanationDto } from './collaboration-explanation.dto';

@Injectable({
  providedIn: 'root'
})
export class SaveCollaborationExplanationService {

  constructor(
    private readonly afFirestore: AngularFirestore,
  ) { }

  public save$(payload: CollaborationExplanationDto): Observable<boolean> {
    const saveTask = this.afFirestore.collection('application')
      .doc<CollaborationExplanationDto>('collaboration-explanation')
      .set(payload, { merge: true });

    return from(saveTask).pipe(
      mapTo(true),
      catchError(_ => of(false)),
    );
  }
}
