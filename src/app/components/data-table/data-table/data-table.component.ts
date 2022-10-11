import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort, SortDirection} from "@angular/material/sort";
import {Title} from "@angular/platform-browser";
import {ResultSet} from "../../models/result-set";
import {PaginationSize} from "../../models/pagination-size";
import Utils from "../../util/Utils";
import {Filter} from "../../models/filter";

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() title: string;
  @Input() fabIcon: string;
  @Input() fabButton: string;
  @Input() inputArray: ResultSet<any> = new ResultSet<any>();
  @Input() dateFilter?: boolean;
  // this array is filled with object parameters name
  disableSort: string[] = [];
  @Input() defaultSortColumn: string;
  @Input() defaultSortDirection: SortDirection;
  @Input() columns: string[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() rowMenuActions: string[][] = [];
  @Input() additionalActions: string[][] = [];
  @Input() filters: Filter[] = [];

  @Output() sort: EventEmitter<Sort> = new EventEmitter<Sort>();
  @Output() refresh: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() fabAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateTable: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  // @Output() viewElement: EventEmitter<any> = new EventEmitter<any>();
  @Output() applyAction: EventEmitter<{ action: string, element: any }>
    = new EventEmitter<{ action: string, element: any }>();
  @Output() refreshForFilters: EventEmitter<{filters: Filter[], searchText: string, startDate: Date, endDate:Date}>
    = new EventEmitter<{filters: Filter[], searchText: string, startDate: Date, endDate:Date}>();

  dataSource: MatTableDataSource<any>;

  length: number = 0;
  pageSizeOptions: number[] = Object.keys(PaginationSize).map(p => {
    if (typeof PaginationSize[p] === 'number')
      return PaginationSize[p];
  }).filter((function (element) {
    return element != undefined;
  }));

  pageSize: number = Utils.getCurrentPagination();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sorter: MatSort;

  // uncomment upon enabling table checkbox mat-checkbox
  // selection = new SelectionModel<any>(true, []);

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Kaizen - ' + this.title);
  }

  ngAfterViewInit() {
    let pageEvent: PageEvent = new PageEvent();
    pageEvent.pageSize = this.pageSize;
    pageEvent.pageIndex = 0;
    this.getList(pageEvent);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputArray']) {
      if (this.inputArray) {
        if (this.inputArray.value) {
          this.length = this.inputArray["@odata.count"];
          this.paginator.pageIndex = this.inputArray.pageIndex;
          this.dataSource = new MatTableDataSource(this.inputArray.value);
          // this.dataSource.sort = this.sorter;
          if (!this.columns.some(c => c == 'menu'))
            this.columns.push('menu');
          // setTimeout(() => this.dataSource.paginator = this.paginator);
        }
      }
    }
  }

  getList(event: PageEvent) {
    localStorage.setItem('pageSize', event.pageSize.toString());
    this.updateTable.emit(event);
  }

  /*getElement(element: any) {
    this.viewElement.emit(element);
  }*/

  executeAction(action: string, element: any) {
    this.applyAction.emit({action: action, element: element});
  }

  executeFabAction() {
    this.fabAction.emit();
  }

  isArray(element: any, column: string, i: number): boolean {
    if (element instanceof Array) {
      this.disableSort[i] = column;
      return true;
    }
    return false;
  }

  isMap(element: any, column: string, i: number): boolean {
    if (element instanceof Map) {
      this.disableSort[i] = column;
      return true;
    }
    return false;
  }

  isColor(color: string|unknown): boolean {
    if (color == null || color == '') {
      return false;
    } 
    let colorString: string = <string> color;
    if (Utils.isColor(colorString)) {
      return true;
    }
    return false;
  }

  refreshData() {
    this.refresh.emit(true);
  }

  sortData(event: Sort) {
    this.sort.emit(event);
  }

  getNestedProperty(element: string, property:string): string {
    let hierarchy: string[] = property.split('.');
    let value: string = element;
    try {
      for (let i = 0; i < hierarchy.length; i++) {
        value = value[hierarchy[i]];
      }
    } catch (e) {
      console.log(e);
      return '';
    }
    return value;
  }

  applyFilter(event: any) {
    this.refreshForFilters.emit(event);
  }

  // to use with checkbox
  /** Whether the number of selected elements matches the total number of rows. */
  /*isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
  }*/

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  /*masterToggle() {
      this.isAllSelected() ? this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
  }*/

  /** The label for the checkbox on the passed row */
  /*checkboxLabel(row?: any): string {
      if (!row) {
          return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }*/
}
