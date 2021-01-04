import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { AngularFireDatabase } from 'angularfire2/database';
import { Star } from './models/star';
import { Polity } from './models/polity';
import { Territory } from './models/territory';
import { map } from 'rxjs/internal/operators/map';
import { CookieService } from './services/cookie-service';
import { PanZoomConfig, PanZoomAPI, PanZoomModel, PanZoomConfigOptions } from 'ngx-panzoom';
import { Subscription } from 'rxjs';
import { SidebarMode } from './enums/sidebarMode';

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
  mode = SidebarMode.Star;
  activeStar: Star;
  activePolity: Polity;
  allStars: Star[];
  allPolities: Polity[];
  allTerritories: Territory[];
  x = false;
  mapUrls = ['https://i.imgur.com/HtDiIoI.jpg'];
  mapIndex = 0;
  cookieService = new CookieService();
  displayNotification = true;
  panZoomConfig: PanZoomConfig = new PanZoomConfig();
  private panZoomAPI: PanZoomAPI;
  private apiSubscription: Subscription;

  constructor(private http: HttpClient, private parser: Papa, private db: AngularFireDatabase) {    
  }

  @ViewChild('drawer') drawer: { open: () => void; close: () => void; };
  @ViewChild('titleChild') titleChild: { buildOptions: () => void; };

  ngOnInit(): void {
    this.panZoomConfig.keepInBounds = false;
    this.panZoomConfig.zoomLevels = 7;
    this.panZoomConfig.neutralZoomLevel = 3;
    this.panZoomConfig.scalePerZoomLevel = 1.5; 
    this.panZoomConfig.freeMouseWheel = false;   
    this.panZoomConfig.invertMouseWheel = true;
    this.panZoomConfig.initialZoomLevel = 3;
    this.readInFromDatabase();
    this.apiSubscription = this.panZoomConfig.api.subscribe( (api: PanZoomAPI) => this.panZoomAPI = api );
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

  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();
  }

  openDrawer(name: string): void {
    const matchingStars = this.allStars.filter(a => a.name === name);
    if (matchingStars.length > 0) {
      this.drawer.open();
      this.isOpen = true;
      this.activeStar = matchingStars[0];
      this.mode = SidebarMode.Star;
    }
  }

  closeDrawer(): void {
    this.drawer.close();
    setTimeout(() => {
      this.isOpen = false;
    }, this.timeToOpen);
  }

  scrollToStar(name: string): void {  
    this.openDrawer(name);
    const zoom = this.panZoomAPI.model.zoomLevel;
    const adjustment = (1080/zoom)-110;
    console.log(adjustment);
    const point = {
      x: this.activeStar.x * 1 + adjustment,
      y: this.activeStar.y * 1
    };
    setTimeout(() => {
      console.log(point);
      this.panZoomAPI.detectContentDimensions();
      this.panZoomAPI.panToPoint(point);
    }, (this.isOpen ? 0 : this.timeToOpen));        
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

  openPolity(name: string): void {
    this.mode = SidebarMode.Polity;
    this.activePolity = this.allPolities.find(p => p.name === name);
  }

  openStar(name: string): void {
    this.mode = SidebarMode.Star;
    this.activeStar = this.allStars.find(p => p.name === name);
    this.scrollToStar(name);
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
