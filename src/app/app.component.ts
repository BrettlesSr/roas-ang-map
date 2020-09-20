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
  activeStar: StarInfo;
  allStars: StarInfo[] = [];
  @ViewChild('drawer') drawer;

  ngOnInit(): void {
    this.http.get('assets/starLocations.csv', {responseType: 'text'})
        .subscribe(csv => {
        const options = {
            header: true,
            complete: (results, file) => {
              this.allStars = results.data;
              this.activeStar = this.allStars[0];
              this.http.get('assets/polities.csv', {responseType: 'text'})
                .subscribe(csv2 => {
                  const options2 = {
                    header: true,
                    complete: (results2, file2) => {
                      const polities = results2.data;
                      console.log(this.allStars);
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
                    }
                  };
                  this.parser.parse(csv2, options2);
                });
            }
          };

        this.parser.parse(csv, options);
        });
  }

  openDrawer(name: string): void {
    this.drawer.open();
    this.activeStar = this.allStars.filter(a => a.name === name)[0];
  }
}
