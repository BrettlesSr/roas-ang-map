import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { AngularFireDatabase } from 'angularfire2/database';
import { Star } from './models/star';
import { Territory } from './models/territory';
import { Polity } from './models/polity';
import { History } from './models/history';
import { Lane } from './models/lane';
import { PolityType } from './enums/polityType';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private parser: Papa, private db: AngularFireDatabase) {}
  title = 'roas-ang-map';
  showFiller = false;
  isOpen = false;
  timeToOpen = 270;
  activeStar: Star;
  allStars: Star[] = [];
  allTerritories: Territory[] = [];
  allPolities: Polity[] = [];
  allHistory: History[] = [];
  allLanes: Lane[] = [];
  @ViewChild('drawer') drawer;
  @ViewChild('titleChild') titleChild;


  ngOnInit(): void {
    this.http.get('assets/starLocations.tsv', {responseType: 'text'})
        .subscribe(csv => {
          this.importLocations(csv);
        });
    setTimeout(() => {
      this.updateDb();
    }, 2000);
  }

  updateDb(): void{
    console.log(this.allHistory);
    // for (const s of this.allStars) {
    //   this.db.list('/stars').push(s);
    // }
    // for (const t of this.allTerritories) {
    //   this.db.list('/territories').push(t);
    // }
    // for (const p of this.allPolities) {
    //   this.db.list('/polities').push(p);
    // }
    // for (const h of this.allHistory) {
    //   this.db.list('/history').push(h);
    // }
    // for (const l of this.allLanes) {
    //   this.db.list('/lanes').push(l);
    // }
  }

  importLocations(csv: string): void {
    const options = {
      header: true,
      complete: (results, file) => {
        this.allStars = results.data;
        this.activeStar = this.allStars[0];

        this.http.get('assets/polities.tsv', {responseType: 'text'})
          .subscribe(csv2 => {
            this.importPolities(csv2);
          });
        this.http.get('assets/unTaskforces.tsv', {responseType: 'text'})
          .subscribe(csv4 => {
            this.importTaskforces(csv4);
          });
        this.http.get('assets/starLanes.tsv', {responseType: 'text'})
          .subscribe(csv5 => {
            this.importStarLanes(csv5);
          });
      }
    };

    this.parser.parse(csv, options);
  }

  importPolities(csv: string): void {
    const options2 = {
      header: true,
      complete: (results2, file2) => {
        const polities = results2.data;
        for (const polity of polities) {
          const relevantStar = this.allStars.filter(a => a.name === polity.starName)[0];
          if (!relevantStar) {
            break;
          }
          const t: Territory = {
            name: polity.name,
            description: polity.description,
            thumbnail: polity.thumbnail,
            threadlink: polity.threadlink,
            owner: polity.name,
            star: relevantStar.name
          };

          if (t.name === undefined) {
            console.log(t);
          }

          this.allTerritories.push(t);
          if (!relevantStar.territories) {
            relevantStar.territories = [t];
          } else {
            relevantStar.territories.push(t);
          }

          polity.type = PolityType.VergeState;
          polity.territories = [t];
          this.allPolities.push(polity);
        }
        this.titleChild.buildOptions();
        this.http.get('assets/history.tsv', {responseType: 'text'})
          .subscribe(csv3 => {
            this.importHistory(csv3);
        });
      }
    };
    this.parser.parse(csv, options2);
  }

  importHistory(csv: string): void {
    const options2 = {
      header: true,
      complete: (results, file2) => {
        const histories = results.data;
        console.log(histories);
        for (const history of histories) {
          console.log('a');
          const relevantStar = this.allStars.filter(a => a.name === history.starName)[0];
          if (!relevantStar) {
            break;
          }
          console.log('b');
          const relevantTerritory = this.allTerritories.filter(a => a.star === history.starName)[0];
          if (!relevantTerritory) {
            break;
          }
          console.log('c');
          history.location = relevantStar;
          history.territoriesInvolved = [relevantTerritory];
          history.politiesInvolved = [relevantTerritory.owner];
          this.allHistory.push(history);
          console.log('d');
        }
      }
    };
    this.parser.parse(csv, options2);
  }

  importTaskforces(csv: string): void {
    const options2 = {
      header: true,
      complete: (results, file2) => {
        const taskforces = results.data;
        for (const taskforce of taskforces) {
          const relevantStar = this.allStars.filter(a => a.name === taskforce.starName)[0];
          if (!relevantStar) {
            break;
          }
          const t: Territory = {
            name: taskforce.name,
            description: taskforce.description,
            thumbnail: taskforce.thumbnail,
            threadlink: taskforce.threadlink,
            owner: taskforce,
            star: relevantStar.name
          };
          this.allTerritories.push(t);
          if (!relevantStar.territories) {
            relevantStar.territories = [t];
          } else {
            relevantStar.territories.push(t);
          }

          taskforce.type = PolityType.UNTaskforce;
          this.allPolities.push(taskforce);
        }
      }
    };
    this.parser.parse(csv, options2);
  }

  importStarLanes(csv: string): void {
    const options2 = {
      header: true,
      complete: (results, file2) => {
        const lanes = results.data;
        for (const lane of lanes) {
          const relevantStarA = this.allStars.filter(a => a.name === lane.starNameA)[0];
          if (!relevantStarA) {
            break;
          }

          lane.starA = relevantStarA.name;

          const relevantStarB = this.allStars.filter(a => a.name === lane.starNameB)[0];
          if (!relevantStarB) {
            break;
          }

          lane.starB = relevantStarB.name;

          if (!relevantStarA.lanes) {
            relevantStarA.lanes = [lane];
          } else {
            relevantStarA.lanes.push(lane);
          }
          if (!relevantStarB.lanes) {
            relevantStarB.lanes = [lane];
          } else {
            relevantStarB.lanes.push(lane);
          }
          this.allLanes.push(lane);
        }
      }
    };
    this.parser.parse(csv, options2);
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
}
