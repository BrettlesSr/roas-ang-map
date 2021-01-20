import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { AngularFireDatabase } from 'angularfire2/database';
import { Star } from './models/star';
import { Polity } from './models/polity';
import { Territory } from './models/territory';
import { map } from 'rxjs/internal/operators/map';
import { CookieService } from './services/cookie-service';
import { PanZoomConfig, PanZoomAPI, PanZoomModel, PanZoomConfigOptions } from 'ngx-panzoom';
import { Observable, Subscription } from 'rxjs';
import { SidebarMode } from './enums/sidebarMode';
import { Region } from './models/region';
import { PiracyState } from './enums/piracyState';
import { MatChipSelectionChange } from '@angular/material/chips';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'roas-ang-map';
  showFiller = false;
  isOpen = false;
  timeToOpen = 270;
  mode = SidebarMode.Star;
  activeStar: Star;
  activePolity: Polity;
  activeRegion: Region;
  allStars: Star[];
  allPolities: Polity[];
  allRegions: Region[];
  allTerritories: Territory[];
  x = false;
  mapUrls = ['https://i.imgur.com/LR2U3Ak.jpg'];
  mapIndex = 0;
  mapDimension = 2500;
  cookieService = new CookieService();
  displayNotification = true;
  panZoomConfig: PanZoomConfig = new PanZoomConfig();
  scrollCountdown = 0;
  private panZoomAPI: PanZoomAPI;
  private apiSubscription: Subscription;

  constructor(private http: HttpClient, private parser: Papa, private db: AngularFireDatabase, private papa: Papa) {
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
    for (const url of this.mapUrls) {
      const img = new Image();
      img.src = url;
    }
    if (this.mapUrls.length > 1) {
      const notCookie = this.cookieService.getCookie('roas-ang-map.displayNotification');
      if (notCookie === 'yes') {
        this.displayNotification = true;
      } else if (notCookie === 'no'){
        this.displayNotification = false;
      }
    }
    else {
      this.displayNotification = false;
    }
  }

  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();
  }

  openDrawerToStar(name: string): void {
    const matchingStars = this.allStars.filter(a => a.name === name);
    if (matchingStars.length > 0) {
      this.drawer.open();
      this.isOpen = true;
      this.activeStar = matchingStars[0];
      this.mode = SidebarMode.Star;
    }
  }

  openDrawerToRegion(name: string): void {
    const matchingRegions = this.allRegions.filter(a => a.name === name);
    if (matchingRegions.length > 0) {
      this.drawer.open();
      this.isOpen = true;
      this.activeRegion = matchingRegions[0];
      this.mode = SidebarMode.Region;
    }
  }

  closeDrawer(): void {
    this.drawer.close();
    setTimeout(() => {
      this.isOpen = false;
    }, this.timeToOpen);
  }

  scrollToStar(name: string): void {
    this.openDrawerToStar(name);
    this.scrollCountdown = 1000;
    const zoom = this.panZoomAPI.model.zoomLevel;
    const adjustment = (1080 / zoom) - 110;
    const point = {
      x: this.activeStar.x * 1 + adjustment,
      y: this.activeStar.y * 1
    };
    setTimeout(() => {
      this.panZoomAPI.detectContentDimensions();
      this.panZoomAPI.panToPoint(point);
    }, (this.isOpen ? 0 : this.timeToOpen));
    setTimeout(() => {
      this.tickDownCountdown();
    }, 1500);
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

    this.db.list('/regions').valueChanges().subscribe((regions: Region[]) => {
      this.allRegions = regions;
      this.fetchGoogleSheet('1MuRqRi3qJ0Tn74ohy7SvnFHe3HeRvkqHh6Befwv76NU', 'Titan_SOV')
        .subscribe((csv: string) => {
          this.papa.parse(csv, {
            header: true,
            complete: (result) => {
              for (const region of this.allRegions) {
                // tslint:disable: no-string-literal
               const terror = result.data.find(r => r['Stellar Region'] === region.name);
               region.autonomists = this.asNumber(terror['Autonomists']);
               region.blackHand = this.asNumber(terror['Black Hand']);
               region.corruptReformists = this.asNumber(terror['Corrupt Reformists']);
               region.dominantSoVFaction = this.asNumber(terror['Dominant SOV Faction']);
               region.murderApes = this.asNumber(terror['Murder Apes']);
               region.petitioners = this.asNumber(terror['Petitioners']);
               region.tfTitans = this.asNumber(terror['TF Titans']);
              }
            }
          });
        });
      this.fetchGoogleSheet('1MuRqRi3qJ0Tn74ohy7SvnFHe3HeRvkqHh6Befwv76NU', 'Demimonde')
        .subscribe((csv: string) => {
          this.papa.parse(csv, {
            header: true,
            complete: (result) => {
              for (const region of this.allRegions) {
               const piracy = result.data.find(r => r['Stellar Region'] === region.name);
               region.prismConcern = this.asNumber(piracy['Prism Concern']);
               region.midgardAthling = this.asNumber(piracy['Midgard Allthing']);
               region.myCorp = this.asNumber(piracy['MyCorp']);
               region.pack = this.asNumber(piracy['The Pack']);
               region.knights = this.asNumber(piracy['The Knights']);
               region.freebooters = this.asNumber(piracy['Freebooters']);
               region.stronghold = piracy['Stronghold Faction'];
               region.piracyState = piracy['Is in Turf War?'] === 'Yes' ? PiracyState.TurfWar : PiracyState.None;
              }
            }
          });
        });
      this.fetchGoogleSheet('1MuRqRi3qJ0Tn74ohy7SvnFHe3HeRvkqHh6Befwv76NU', 'Regional_Trade_Power')
        .subscribe((csv: string) => {
          this.papa.parse(csv, {
            header: true,
            complete: (result) => {
              for (const region of this.allRegions) {
               const trade = result.data.find(r => r['Stellar Region'] === region.name);
               region.tradeNodes = this.asNumber(trade['Trade Nodes']);
               region.totalTradeValue = this.asNumber(trade['Total']);
               region.baseTradeValue = this.asNumber(trade['Base Trade']);
              }
            }
          });
        });
    });
  }

  tickDownCountdown(): void {
    if (this.scrollCountdown < 10){
      this.scrollCountdown = 0;
    }
    else {
      this.scrollCountdown = this.scrollCountdown - 10;
      setTimeout(() => {
        this.tickDownCountdown();
      }, 10);
    }
  }

  fetchGoogleSheet(id: string, page: string): Observable<string> {
    const options: {
        headers?: HttpHeaders;
        observe?: 'body';
        params?: HttpParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
    } = {
        responseType: 'text'
    };

    return this.http
        .get('https://docs.google.com/spreadsheets/d/' + id + '/gviz/tq?tqx=out:csv&sheet=' + page, options)
        .pipe(
            map((file: string) => {
                return file;
            })
        );
  }

  asNumber(input: string): number {
    if (input === undefined || input.length === 0) {
      return 0;
    }
    const sentence = input.split(' ');
    const first = sentence[0];
    return Number.parseInt(first, 10);
  }

  get highlightDimensionsCss(): object{
    if (this.scrollCountdown === 0) {
      return {
        height: this.mapDimension + 'px',
        width: this.mapDimension + 'px',
        top: '0px',
        left: '0px',
        'box-shadow': '0 0 0 100vmax rgba(0,0,0,0)'
     };
    }
    const alpha = (this.scrollCountdown / 2300).toFixed(1);
    return {
       height: Math.abs(this.activeStar.yEnd - this.activeStar.yStart).toFixed(0) + 'px',
       width: Math.abs(this.activeStar.xEnd - this.activeStar.xStart).toFixed(0) + 'px',
       top: (this.activeStar.yStart ?? 0).toFixed(0) + 'px',
       left: (this.activeStar.xStart ?? 0).toFixed(0) + 'px',
       'box-shadow': ('0 0 0 100vmax rgba(0,0,0,' + alpha + ')')
    };
  }
}
