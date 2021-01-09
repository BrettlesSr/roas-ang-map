import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { PiracyState } from '../enums/piracyState';
import { Region } from '../models/region';

@Component({
  selector: 'app-region-info',
  templateUrl: './region-info.component.html',
  styleUrls: ['./region-info.component.scss']
})
export class RegionInfoComponent implements OnInit {

  constructor(private http: HttpClient) { }

  @Input() regionInfo: Region;

  ngOnInit(): void {    
  }
}
