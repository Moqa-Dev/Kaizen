import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {Filter} from "../../models/filter";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
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
