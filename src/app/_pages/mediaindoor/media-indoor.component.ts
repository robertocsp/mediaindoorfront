import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaIndoorService } from '../../_services/media-indoor.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, Subscription, timer, BehaviorSubject } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-media-indoor',
  templateUrl: './media-indoor.component.html',
  styleUrls: ['./media-indoor.component.css']
})
export class MediaIndoorComponent implements OnInit, OnDestroy {
  private reset$ = new Subject();
  private ads$ = new BehaviorSubject<any>(null);
  timer$: Observable<any>;
  subscription: Subscription;
  place: any;
  adsList: any;
  currentIndex = 0;
  currentAd: any;

  constructor(private route: ActivatedRoute,
    private mediaIndoorService: MediaIndoorService) {
    this.place = this.route.snapshot.paramMap.get('place');
    this.timer$ = this.reset$.pipe(
      startWith(0),
      switchMap(() => timer(0, 1000))
    );
  }

  ngOnInit() {
    this.mediaIndoorService.onConnect(this.place);
    this.getAds();
    this.ads$.subscribe(ads => {
      this.adsList = ads;
      if (!this.subscription && this.adsList) {
          this.subscription = this.timer$.subscribe((i) => {
            if (i === 0) {
              if (this.currentIndex >= this.adsList.length) {
                this.currentIndex = this.adsList.length - 1;
              }
              this.currentAd = this.adsList[this.currentIndex];
              if(!this.currentAd) {
                this.currentIndex = 0;
                this.currentAd = this.adsList[this.currentIndex];
              }
              this.currentIndex++;
              if (this.currentIndex > this.adsList.length - 1) {
                this.currentIndex = 0;
              }
            }
            if (i === this.currentAd.duration) {
              this.refreshTimer();
            }
          });
        }
    });
  }

  getAds() {
    this.mediaIndoorService.getAds().subscribe(message => {
      if (message) {
        this.ads$.next(JSON.parse(message));
      }
    },
      err => console.error('Observer got an error: ' + err),
      () => console.log('Observer got a complete notification'));
  }

  refreshTimer(): void {
    this.reset$.next(void 0);
  }

  ngOnDestroy() {
    this.unsubscribeTimer();
  }

  private unsubscribeTimer() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}