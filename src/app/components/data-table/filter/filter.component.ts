import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import {Filter} from "../../../models/filter";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    RouterModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    MatDividerModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class FilterComponent implements OnInit {

  @Input() filters: Filter[] = [];
  @Input() dateFilter?: boolean;
  @Output() refresh: EventEmitter<{filters: Filter[], searchText: string, startDate: Date, endDate:Date}>
    = new EventEmitter<{filters: Filter[], searchText: string, startDate: Date, endDate:Date}>();

  searchText: string = '';

  range = new FormGroup({
    startDate: new FormControl({value: null,disabled:true}),
    endDate: new FormControl({value: null,disabled:true})
  });

  constructor() {
  }

  ngOnInit(): void {
  }

  dateChanged(event: MatDatepickerInputEvent<Date>){
    if (event.value){
      this.applyFilter();
    }
      
  }
  

  clearDate(){
    this.range.reset();
    this.applyFilter();
  }

  applyFilter(event?: any) {
    if (event != null && event instanceof KeyboardEvent) {
      // @ts-ignore
      this.searchText = event.target.value;
    }
    this.refresh.emit({
      filters: this.filters, 
      searchText: this.searchText, 
      // @ts-ignore
      startDate: this.range.value.startDate, 
      // @ts-ignore
      endDate: this.range.value.endDate});
  }
}
