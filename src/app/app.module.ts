import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxPanZoomModule } from 'ngx-panzoom';

import { MatSidenavModule } from '@angular/material/sidenav';
import { StarInfoComponent } from './star-info/star-info.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';

import { TitleComponent } from './title/title.component';

import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AddHistoryComponent } from './add-history/add-history.component';
import { AddTerritoryComponent } from './add-territory/add-territory.component';
import { AddStarComponent } from './add-star/add-star.component';
import { MatNativeDateModule } from '@angular/material/core';
import { AddPolityComponent } from './add-polity/add-polity.component';
import { PolityInfoComponent } from './polity-info/polity-info.component';
import { ArticlePipe } from './article.pipe';
import { AddPolityToHistoryComponent } from './add-polity-to-history/add-polity-to-history.component';
import { RegionInfoComponent } from './region-info/region-info.component';
import { NumberDisplayComponent } from './number-display/number-display.component';
import { EditStarsComponent } from './edit-stars/edit-stars.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    StarInfoComponent,
    TitleComponent,
    AddHistoryComponent,
    AddTerritoryComponent,
    AddStarComponent,
    AddPolityComponent,
    PolityInfoComponent,
    ArticlePipe,
    AddPolityToHistoryComponent,
    RegionInfoComponent,
    NumberDisplayComponent,
    EditStarsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatTabsModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatChipsModule,
    MatExpansionModule,
    MatCardModule,
    MatNativeDateModule,
    MatTooltipModule,
    AngularFireModule.initializeApp(environment.firebase, 'roas-ang-map'),
    AngularFireDatabaseModule,
    DragDropModule,
    NgxPanZoomModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
