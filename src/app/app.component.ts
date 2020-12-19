import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { AngularFireDatabase } from 'angularfire2/database';
import { Star } from './models/star';
import { Polity } from './models/polity';
import { Territory } from './models/territory';
import { map } from 'rxjs/internal/operators/map';
import { CookieService } from './services/cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'roas-ang-map';
  showFiller = false;
  isOpen = false;
  timeToOpen = 270;
  activeStar: Star;
  allStars: Star[];
  allPolities: Polity[];
  allTerritories: Territory[];
  x = false;
  mapUrls = ['https://i.imgur.com/G0vtvJU.jpg', 'https://i.imgur.com/clLgk7G.jpg'];
  mapIndex = 0;
  cookieService = new CookieService();
  displayNotification = true;

  constructor(private http: HttpClient, private parser: Papa, private db: AngularFireDatabase) {
  }

  @ViewChild('drawer') drawer: { open: () => void; close: () => void; };
  @ViewChild('titleChild') titleChild: { buildOptions: () => void; };

  ngOnInit(): void {
    this.readInFromDatabase();
    for (let i = 0; i < this.mapUrls.length; i++) {
      const url = this.mapUrls[i];
      var img = new Image();
      img.src = url;
    }
    const notCookie = this.cookieService.getCookie('roas-ang-map.displayNotification');
    if (notCookie === 'yes') {
      this.displayNotification = true;
    } else if (notCookie === 'no'){
      this.displayNotification = false;
    }
  }

  openDrawer(name: string): void {
    const matchingStars = this.allStars.filter(a => a.name === name);
    if (matchingStars.length > 0) {
      this.drawer.open();
      this.isOpen = true;
      this.activeStar = matchingStars[0];
    }
  }

  closeDrawer(): void {
    this.drawer.close();
    setTimeout(() => {
      this.isOpen = false;
    }, this.timeToOpen);
  }

  scrollToStar(name: string): void {
    setTimeout(() => {
      const x = (this.activeStar.xStart * 1 + this.activeStar.xEnd * 1) / 2;
      const y = (this.activeStar.yStart * 1 + this.activeStar.yEnd * 1) / 2; // javascript is terrible
      const element = document.getElementsByClassName('mat-drawer-content ng-star-inserted')[0];

      const vy = element.clientHeight;
      const vx = element.clientWidth;

      element.scrollTo({
        top: y - (vy / 2),
        left: x - (vx / 2),
        behavior: 'smooth'
      });
    }, (this.isOpen ? 0 : this.timeToOpen));
    this.openDrawer(name);
  }

  bumpMapIndex(): void {
    this.mapIndex++;
    if (this.mapIndex + 1 > this.mapUrls.length) {
      this.mapIndex = 0;
    }
  }

  dismissNotification(): void {
    this.cookieService.setCookie('roas-ang-map.displayNotification', 'no', 600);
    this.displayNotification = false;
  }

  readInFromDatabase(): void {
    this.db.list('/stars').valueChanges()
    .subscribe(
      (stars: Star[]) => {
        this.allStars = stars;
        this.activeStar = this.allStars[0];
        this.titleChild.buildOptions();
        this.db.list('/stars').snapshotChanges()
        .pipe(
          map(actions => actions.map(a => a.key))
        )
        .subscribe(k => {
          for (let i = 0; i < k.length; i++) {
            this.allStars[i].key = k[i];
          }
        });
      }
    );
    this.db.list('/polities').valueChanges().subscribe((polities: Polity[]) => {
      this.allPolities = polities;
      this.db.list('/polities').snapshotChanges()
        .pipe(
          map(actions => actions.map(a => a.key))
        )
        .subscribe(k => {
          for (let i = 0; i < k.length; i++) {
            this.allPolities[i].key = k[i];
          }
        });
    });
    this.db.list('/territories').valueChanges().subscribe((t: Territory[]) => {
      this.allTerritories = t;
      this.titleChild.buildOptions();
      this.db.list('/territories').snapshotChanges()
        .pipe(
          map(actions => actions.map(a => a.key))
        )
        .subscribe(k => {
          for (let i = 0; i < k.length; i++) {
            this.allTerritories[i].key = k[i];
          }
        });
    });
  }
}
