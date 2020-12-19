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

import { TitleComponent } from './title/title.component';

import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AddHistoryComponent } from './add-history/add-history.component';
import { AddTerritoryComponent } from './add-territory/add-territory.component';
import { AddStarComponent } from './add-star/add-star.component';
import { MatNativeDateModule } from '@angular/material/core';
import { AddPolityComponent } from './add-polity/add-polity.component';

@NgModule({
  declarations: [
    AppComponent,
    StarInfoComponent,
    TitleComponent,
    AddHistoryComponent,
    AddTerritoryComponent,
    AddStarComponent,
    AddPolityComponent    
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
    MatNativeDateModule,
    AngularFireModule.initializeApp(environment.firebase, 'roas-ang-map'),
    AngularFireDatabaseModule,
    DragDropModule,
    NgxPanZoomModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
