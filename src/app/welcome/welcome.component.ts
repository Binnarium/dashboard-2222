import { Component, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { debounce, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { VideoDTO } from '../shared/upload/asset.dto';
import { LoadWelcomeService } from './load-welcome.service';
import { SaveWelcomeService } from './save-welcome.service';
import { WelcomeDto } from './welcome.dto';

@Component({
  selector: 'dashboard-welcome',
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent implements OnDestroy {

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly loadWelcomeService: LoadWelcomeService,
    private readonly saveWelcomeService: SaveWelcomeService,
  ) { }

  /** form so upload content */
  public readonly form: UntypedFormGroup = this.fb.group(<Record<keyof WelcomeDto, UntypedFormControl | UntypedFormGroup>>{
    profundityText: this.fb.control(null),
    pageTitle: this.fb.control(null),
    workloadText: this.fb.control(null),
    welcomeVideo: this.fb.group(<Record<keyof VideoDTO, UntypedFormControl>>{
      duration: this.fb.control(null),
      format: this.fb.control(null),
      name: this.fb.control(null),
      path: this.fb.control(null),
      url: this.fb.control(null)
    }),
  });

  /** Current state of the form if its value have been saved */
  public saved = true;

  /** load from database */
  private readonly loadInscriptionSub: Subscription = this.loadWelcomeService.load$.pipe(
    take(1),
    shareReplay(),
  ).subscribe(welcome => {
    if (welcome?.pageTitle)
      this.form.controls[<keyof WelcomeDto>'pageTitle'].setValue(welcome.pageTitle, { emitEvent: false });
    if (welcome?.profundityText)
      this.form.controls[<keyof WelcomeDto>'profundityText'].setValue(welcome.profundityText, { emitEvent: false });
    if (welcome?.workloadText)
      this.form.controls[<keyof WelcomeDto>'workloadText'].setValue(welcome.workloadText, { emitEvent: false });
    if (welcome?.welcomeVideo)
      this.form.controls[<keyof WelcomeDto>'welcomeVideo'].setValue(welcome.welcomeVideo, { emitEvent: false });
  });

  private autoSaveSub: Subscription = this.form.valueChanges.pipe(
    tap(() => this.saved = false),
    debounce(() => interval(1000)),
    switchMap(welcome => this.saveWelcomeService.save$(welcome)),
    tap(saved => this.saved = saved),
  ).subscribe();

  ngOnDestroy(): void {
    this.loadInscriptionSub.unsubscribe();
    this.autoSaveSub.unsubscribe();
  }
  uploadVideo(video: NonNullable<VideoDTO>) {
    this.form.controls[<keyof WelcomeDto>'welcomeVideo'].setValue(video);
  }
}
