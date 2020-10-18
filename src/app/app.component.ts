import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { AngularFireDatabase } from 'angularfire2/database';
import { Star } from './models/star';
import { ImportService } from './services/importService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  importService: ImportService;
  title = 'roas-ang-map';
  showFiller = false;
  isOpen = false;
  timeToOpen = 270;
  activeStar: Star;
  allStars: Star[];

  constructor(private http: HttpClient, private parser: Papa, private db: AngularFireDatabase) {
    this.importService = new ImportService(this.http, this.parser, this.db);
  }

  @ViewChild('drawer') drawer: { open: () => void; close: () => void; };
  @ViewChild('titleChild') titleChild: { buildOptions: () => void; };

  ngOnInit(): void {
    // this only needs to be run once ever
    // this.importFromFiles();

    this.db.list('/stars').valueChanges().subscribe((stars: Star[]) => {
      this.allStars = stars;
      this.activeStar = this.allStars[0];
      this.titleChild.buildOptions();
    });
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

  importFromFiles(): void {
    this.http.get('assets/starLocations.tsv', {responseType: 'text'})
        .subscribe(csv => {
          this.importService.importLocations(csv);
        });
  }
}
