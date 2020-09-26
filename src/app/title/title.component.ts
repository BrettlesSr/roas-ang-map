import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { Option } from '../models/option';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  @Input() parent: AppComponent;
  searchFormControl = new FormControl('', []);
  options: Option[] = [];
  filteredOptions: Observable<Option[]>;
  showAutoComplete = false;
  showClear = false;
  constructor() { }

  ngOnInit(): void {
    this.filteredOptions = this.searchFormControl.valueChanges
      .pipe(
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): Option[] {
    return this.options
    .filter(option => option.fullSearchText.toLowerCase().includes(value.toLowerCase()))
    .sort((a, b) => a.order - b.order);
  }

  updatedVal(e): void {
    if (e && e.length >= 3) {
       this.showAutoComplete = true;
    } else {
       this.showAutoComplete = false;
    }
    if (e && e.length > 0){
      this.showClear = true;
    } else{
      this.showClear = false;
    }
  }

  optionClicked(option: Option): void {
    this.parent.scrollToStar(option.starName);
    this.showAutoComplete = false;
  }

  clear(): void {
    this.searchFormControl.setValue('');
  }

  buildOptions(): void {
    for (const star of this.parent.allStars) {
      const starOption = {
        value: star.name,
        starName: star.name,
        fullSearchText: star.name,
        order: 0
      };
      this.options.push(starOption);
      if (!star.polities) {
        continue;
      }
      for (const polity of star.polities) {
        const polityOption = {
        value: star.name + ' - ' + polity.title,
        starName: star.name,
        fullSearchText: star.name + polity.title + polity.description,
        order: 1
        };
        this.options.push(polityOption);
      }
    }
  }
}
