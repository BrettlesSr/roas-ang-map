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
