import { Component, OnInit, ViewChild } from '@angular/core';
import { StarInfo } from './models/starInfo';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private parser: Papa) {}
  title = 'roas-ang-map';
  showFiller = false;
  isOpen = false;
  timeToOpen = 270;
  activeStar: StarInfo;
  allStars: StarInfo[] = [];
  @ViewChild('drawer') drawer;
  @ViewChild('titleChild') titleChild;


  ngOnInit(): void {
    this.http.get('assets/starLocations.tsv', {responseType: 'text'})
        .subscribe(csv => {
          this.importLocations(csv);
        });
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
        this.http.get('assets/history.tsv', {responseType: 'text'})
          .subscribe(csv3 => {
            this.importHistory(csv3);
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
            console.log('Could not find star ' + polity.starName);
          }
          else if (!relevantStar.polities) {
            relevantStar.polities = [polity];
          } else{
            relevantStar.polities.push(polity);
          }
        }
        this.titleChild.buildOptions();
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
            console.log('Could not find star ' + history.starName);
          }
          else if (!relevantStar.history) {
            relevantStar.history = [history];
          } else{
            relevantStar.history.push(history);
          }
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
            console.log('Could not find star ' + taskforce.starName);
          }
          else if (!relevantStar.unTaskforces) {
            relevantStar.unTaskforces = [taskforce];
          } else{
            relevantStar.unTaskforces.push(taskforce);
          }
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
        console.log(lanes);
        for (const lane of lanes) {
          const relevantStarA = this.allStars.filter(a => a.name === lane.starNameA)[0];
          if (!relevantStarA) {
            console.log('Could not find star ' + lane.starNameA);
          }
          else if (!relevantStarA.linkedStars) {
            relevantStarA.linkedStars = [lane.starNameB];
          }
          else if (!relevantStarA.linkedStars.find(l => l === lane.starNameB)){
            relevantStarA.linkedStars.push(lane.starNameB);
          }
          const relevantStarB = this.allStars.filter(a => a.name === lane.starNameB)[0];
          if (!relevantStarB) {
            console.log('Could not find star ' + lane.starNameB);
          }
          else if (!relevantStarB.linkedStars) {
            relevantStarB.linkedStars = [lane.starNameA];
          }
          else if (!relevantStarA.linkedStars.find(l => l === lane.starNameA)){
            relevantStarA.linkedStars.push(lane.starNameA);
          }
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
      console.log(this.activeStar);
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
