import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Papa } from 'ngx-papaparse';
import { Star } from '../models/star';
import { Territory } from '../models/territory';
import { History } from '../models/history';
import { Polity } from '../models/polity';
import { Lane } from '../models/lane';
import { PolityType } from '../enums/polityType';

export class ImportService{
    constructor(private http: HttpClient, private parser: Papa, private db: AngularFireDatabase){}

    allStars: Star[] = [];
    allTerritories: Territory[] = [];
    allPolities: Polity[] = [];
    allHistory: History[] = [];
    allLanes: Lane[] = [];

    updateDb(): void{
        for (const s of this.allStars) {
          this.db.list('/stars').push(s);
        }
        for (const t of this.allTerritories) {
          this.db.list('/territories').push(t);
        }
        for (const p of this.allPolities) {
          this.db.list('/polities').push(p);
        }
        for (const h of this.allHistory) {
          this.db.list('/history').push(h);
        }
        for (const l of this.allLanes) {
          this.db.list('/lanes').push(l);
        }
    }

      importLocations(csv: string): void {
        const options = {
          header: true,
          complete: (results, file) => {
            this.allStars = results.data;

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
        setTimeout(() => {
            this.updateDb();
          }, 3000);
      }

      importPolities(csv: string): void {
        const options2 = {
          header: true,
          complete: (results2, file2) => {
            const polities = results2.data;
            for (const polity of polities) {
              const relevantStar = this.allStars.filter(a => a.name === polity.starName)[0];
              if (!relevantStar) {
                continue;
              }
              const t: Territory = {
                name: polity.name,
                description: polity.description,
                thumbnail: polity.thumbnail,
                threadlink: polity.threadlink,
                owner: polity.name,
                star: relevantStar.name
              };

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
            // this.titleChild.buildOptions();
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
            for (const history of histories) {
              const relevantStar = this.allStars.filter(a => a.name === history.starName)[0];
              if (!relevantStar) {
                continue;
              }
              const relevantTerritory = this.allTerritories.filter(a => a.star === history.starName)[0];
              if (!relevantTerritory) {
                continue;
              }
              history.location = relevantStar;
              history.territoriesInvolved = [relevantTerritory];

              const owner = this.allPolities.filter(a => a.name === relevantTerritory.owner)[0];
              history.politiesInvolved = [owner];
              this.allHistory.push(history);
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
                continue;
              }
              const t: Territory = {
                name: taskforce.name,
                description: taskforce.description,
                thumbnail: taskforce.thumbnail,
                threadlink: taskforce.threadlink,
                owner: taskforce.name,
                star: relevantStar.name
              };
              this.allTerritories.push(t);
              if (!relevantStar.territories) {
                relevantStar.territories = [t];
              } else {
                relevantStar.territories.push(t);
              }

              taskforce.type = PolityType.UNTaskforce;
              taskforce.territories = [t];
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
              const relevantStarA = this.allStars.filter(a => a.name === lane.starA)[0];
              if (!relevantStarA) {
                continue;
              }

              const relevantStarB = this.allStars.filter(a => a.name === lane.starB)[0];
              if (!relevantStarB) {
                continue;
              }

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
}
