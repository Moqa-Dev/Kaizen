import {Component, OnInit} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {NotificationLevel} from "../../models/enums/code-enums/notification-level";
import {SnackBarComponent} from "../../components/snack-bar/snack-bar.component";
import Utils from "../../util/Utils";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import { Observable,Subscription, interval  } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataTableComponent } from 'src/app/components/data-table/data-table/data-table.component';
import {ChartsModule, MDBBootstrapModule} from "angular-bootstrap-md";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule,
    DataTableComponent,
    MatSnackBarModule,
    ChartsModule,
    MDBBootstrapModule
  ]
})
export class DashboardComponent implements OnInit {

  jobsCount: number;
  transactionsCount: number;
  processesCount: number;
  workcentersCount: number;

  showLegend: boolean = true;

  pieTransactionsStatusDataset: Array<any> = new Array<any>();
  pieTransactionsStatusLabels: Array<any> = ['MoQa','Kaizen','Kajo','Development','Shaheen'];
  TransactionsStatusColors: Array<any> = [
    {
      backgroundColor: [
        'rgb(102, 187, 106, 0.5)',
        'rgb(255, 40, 40, 0.5)', 
        'rgb(239, 83, 80, 0.5)', 
        'rgb(255, 167, 38, 0.5)', 
        'rgb(44, 168, 255, 0.5)',
      ],
      hoverBackgroundColor: [
        'rgb(102, 187, 106, 0.7)',
        'rgb(255, 40, 40, 0.7)', 
        'rgb(239, 83, 80, 0.7)', 
        'rgb(255, 167, 38, 0.7)', 
        'rgb(44, 168, 255, 0.7)',
      ],
      borderWidth: 2,
    }
  ];

  pieTransactionsProcessDataset: Array<any> = new Array<any>();
  pieTransactionsProcessLabels: Array<any> = new Array<any>();

  polarJobStatusDataset: Array<any> = new Array<any>();
  polarJobStatusLabels: Array<any> = new Array<any>();
  
  polarProcessTypeDataset: Array<any> = new Array<any>();
  polarProcessTypeLabels: Array<any> = new Array<any>();
  

  radarTransactionsDepartmentDataset: Array<any> = new Array<any>();
  radarTransactionsDepartmentLabels: Array<any> = new Array<any>();
  
  radarTransactionsWorkCenterDataset: Array<any> = new Array<any>();
  radarTransactionsWorkCenterLabels: Array<any> = new Array<any>();
  

  chartTransactionsStatusWeekDataset: Array<any> = new Array<any>();
  chartTransactionsStatusWeekLabels: Array<any> = ['MoQa','Kaizen','Kajo','Development','Shaheen'];

  chartTransactionsStatusTodayDataset: Array<any> = new Array<any>();
  chartTransactionsStatusTodayLabels: Array<any> = ['MoQa','Kaizen','Kajo','Development','Shaheen'];
  
  chartOptions: any = {responsive: true};

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
  }
  private updateSubscription: Subscription;
  ngOnInit() {
    

    // this.updateSubscription = interval(30000).subscribe(
    //   (val) => { 
    //     if(this.router.url === '/dashboard'){
    //       if (window.screen.width <= 800) {
    //         this.showLegend = false;
    //       }else{
    //         this.showLegend = true;
    //       }
    //       this.getDashboardData();
    //   }
    //   });
 
    let notFoundParam: string = this.route.snapshot.paramMap.get('notFound');
    if (notFoundParam == 'NotFound') {
      this.router.navigate(['/admin/dashboard']).then(() => {
        this.showNotification('Requested page is not found!', NotificationLevel.ERROR);
      });
    } else {
      this.titleService.setTitle('Kaizen - Dashboard');
      this.getMockDashboardData();
    }
  }

  getMockDashboardData(){
    let response = {
      "cardTransactionsCount": 5546,
      "cardJobsCount": 2129,
      "cardWorkCentersCount": 77,
      "cardProcessesCount": 889,
      "polarJobStatus": {
        "pending": 179,
        "running": 277,
        "stopping": 267,
        "terminating": 365,
        "faulted": 11,
        "successful": 122,
        "stopped": 123,
        "suspended": 223,
        "resumed": 12
      },
      "polarProcessType": {
        "linear": 14,
        "webAccess": 44,
        "queue": 75,
        "dataTable": 23
      },
      "pieTransactionsStatus": {
        "dateTime": "2022-10-13T19:51:58.138Z",
        "MoQa": 21,
        "Kaizen": 56,
        "Kajo": 86,
        "Development": 19,
        "Shaheen": 54
      },
      "pieTransactionsProcess": [
        {
          "processName": "Post1",
          "transactionsCount": 542
        },
      {
          "processName": "Post2",
          "transactionsCount": 433
        },
      {
          "processName": "Post3",
          "transactionsCount": 675
        },
      {
          "processName": "Post4",
          "transactionsCount": 458
        }
      ],
      "radarTransactionsDepartment": [
        {
          "department": "D1",
          "transactionsCount": {
          "dateTime": "2022-10-11T17:51:58.138Z",
          "MoQa": 50,
          "Kaizen": 187,
          "Kajo": 12,
          "Development": 11,
          "Shaheen": 45
        }
        },
      {
          "department": "D2",
          "transactionsCount": {
          "dateTime": "2022-10-11T17:51:58.138Z",
          "MoQa": 100,
          "Kaizen": 87,
          "Kajo": 12,
          "Development": 111,
          "Shaheen": 245
        }
        },
      {
          "department": "D3",
          "transactionsCount": {
          "dateTime": "2022-10-11T17:51:58.138Z",
          "MoQa": 100,
          "Kaizen": 87,
          "Kajo": 12,
          "Development": 11,
          "Shaheen": 45
        }
        }
      ],
      "radarTransactionsWorkCenter": [
      {
          "workCenter": "W1",
          "transactionsCount": {
          "dateTime": "2022-10-11T17:51:58.138Z",
          "MoQa": 100,
          "Kaizen": 87,
          "Kajo": 12,
          "Development": 211,
          "Shaheen": 45
        }
        },
      {
          "workCenter": "W2",
          "transactionsCount": {
          "dateTime": "2022-10-11T17:51:58.138Z",
          "MoQa": 100,
          "Kaizen": 87,
          "Kajo": 12,
          "Development": 11,
          "Shaheen": 345
        }
        },
      {
          "workCenter": "W3",
          "transactionsCount": {
          "dateTime": "2022-10-11T17:51:58.138Z",
          "MoQa": 100,
          "Kaizen": 87,
          "Kajo": 12,
          "Development": 11,
          "Shaheen": 45
        }
        }
      ],
      "chartTransactionsStatusWeek": [
        {
          "dateTime": "2022-10-11T17:51:58.138Z",
          "MoQa": 100,
          "Kaizen": 87,
          "Kajo": 12,
          "Development": 11,
          "Shaheen": 45
        },
      {
          "dateTime": "2022-10-1T18:51:58.138Z",
          "MoQa": 87,
          "Kaizen": 76,
          "Kajo": 12,
          "Development": 65,
          "Shaheen": 18
        },
      {
          "dateTime": "2022-10-13T19:51:58.138Z",
          "MoQa": 99,
          "Kaizen": 63,
          "Kajo": 15,
          "Development": 34,
          "Shaheen": 11
        }
      ],
      "chartTransactionsStatusToday": [
        {
          "dateTime": "2022-10-13T17:51:58.138Z",
          "MoQa": 100,
          "Kaizen": 87,
          "Kajo": 12,
          "Development": 11,
          "Shaheen": 45
        },
      {
          "dateTime": "2022-10-13T18:51:58.138Z",
          "MoQa": 87,
          "Kaizen": 76,
          "Kajo": 12,
          "Development": 65,
          "Shaheen": 18
        },
      {
          "dateTime": "2022-10-13T19:51:58.138Z",
          "MoQa": 99,
          "Kaizen": 63,
          "Kajo": 15,
          "Development": 34,
          "Shaheen": 11
        }
      ]
    };

    
        //CARDS
        try {
          this.jobsCount = response["cardJobsCount"];
        } catch (error) {
        }

        try {
          this.transactionsCount = response["cardTransactionsCount"];
        } catch (error) {
        }

        try {
          this.processesCount = response["cardProcessesCount"];
        } catch (error) {
        }

        try {
          this.workcentersCount = response["cardWorkCentersCount"];
        } catch (error) {
        }

        //PIE
        try {
          this.pieTransactionsStatusDataset = [
          {
            data: [
              response['pieTransactionsStatus']['MoQa'],
              response['pieTransactionsStatus']['Kaizen'],
              response['pieTransactionsStatus']['Kajo'],
              response['pieTransactionsStatus']['Development'],
              response['pieTransactionsStatus']['Shaheen'],
            ],   
            label: 'Transactions Status'
          }
        ];
        } catch (error) {
        }

        try {
          let processesTransactions: Array<any> = response['pieTransactionsProcess'];
          let data = new Array<any>();
          this.pieTransactionsProcessLabels = new Array<any>();
          processesTransactions.forEach(process =>{
            this.pieTransactionsProcessLabels.push(process['processName']);
            data.push(process['transactionsCount']);
          })
          this.pieTransactionsProcessDataset = [
            {
              data: data,
              label: 'Processes Transactions'
            }
          ];
        } catch (error) {
        }

        //POLAR
        try {
          //@ts-ignore
          let jobsStatuses: Array<any> = response['polarJobStatus'];
          let data = new Array<any>();
          this.polarJobStatusLabels = new Array<any>();
          for (var jobStatus in jobsStatuses){
            this.polarJobStatusLabels.push(jobStatus);
            data.push(jobsStatuses[jobStatus]);
          }
          this.polarJobStatusDataset = [
            {
              data: data,
              label: 'Jobs Status'
            }
          ];
        } catch (error) {
          
        }try {
          //@ts-ignore
          let processTypes: Array<any> = response['polarProcessType'];
          let data = new Array<any>();
          this.polarProcessTypeLabels = new Array<any>();
          for (var processType in processTypes){
            this.polarProcessTypeLabels.push(processType);
            data.push(processTypes[processType]);
          }
          this.polarProcessTypeDataset = [
            {
              data: data,
              label: 'Process Types'
            }
          ];
        } catch (error) {
        }

        //RADAR
        try {
          let departmentsTransactions: Array<any> = response['radarTransactionsDepartment'];
          let data = new Array<any>();
          this.radarTransactionsDepartmentDataset = new Array<any>();
          this.radarTransactionsDepartmentLabels = new Array<any>();

          //labels
          for (var label in departmentsTransactions[0]['transactionsCount']){
            if(label === 'dateTime')
              continue;
            this.radarTransactionsDepartmentLabels.push(label);
          }
          //data
          for (var department in departmentsTransactions){
            data = new Array<any>();
            for (var label in departmentsTransactions[department]['transactionsCount']){
              if(label === 'dateTime')
                continue;
              data.push(departmentsTransactions[department]['transactionsCount'][label])
            }
            this.radarTransactionsDepartmentDataset.push(
              {
                data: data,
                label: departmentsTransactions[department]['department']
              }
            );

          }
        } catch (error) {
        }

        try {
          let workcentersTransactions: Array<any> = response['radarTransactionsWorkCenter'];
          let data = new Array<any>();
          this.radarTransactionsWorkCenterDataset = new Array<any>();
          this.radarTransactionsWorkCenterLabels = new Array<any>();

          //labels
          for (var label in workcentersTransactions[0]['transactionsCount']){
            if(label === 'dateTime')
              continue;
            this.radarTransactionsWorkCenterLabels.push(label);
          }
          //data
          for (var workcenter in workcentersTransactions){
            data = new Array<any>();
            for (var label in workcentersTransactions[workcenter]['transactionsCount']){
              if(label === 'dateTime')
                continue;
              data.push(workcentersTransactions[workcenter]['transactionsCount'][label])
            }
            this.radarTransactionsWorkCenterDataset.push(
              {
                data: data,
                label: workcentersTransactions[workcenter]['workCenter']
              }
            );

          }
        } catch (error) {
        }

        //Line Charts
        try {
          let transactionsWeek = response['chartTransactionsStatusWeek'];
          this.chartTransactionsStatusWeekDataset = new Array<any>();
          this.chartTransactionsStatusWeekLabels = new Array<any>();
          let sucess: number[] = [];
          let initException: number[] = [];
          let systemException: number[] = [];
          let businessException: number[] = [];
          let notImplementedException: number[] = [];

          for (let i = 0; i < transactionsWeek.length; i++) {
            this.chartTransactionsStatusWeekLabels.push(
              transactionsWeek[i]['dateTime'].substring(
                0,
                transactionsWeek[i]['dateTime'].indexOf('T')).split('-').join('/'));

              sucess.push(transactionsWeek[i]['MoQa']);
              initException.push(transactionsWeek[i]['Kaizen']);
              systemException.push(transactionsWeek[i]['Kajo']);
              businessException.push(transactionsWeek[i]['Development']);
              notImplementedException.push(transactionsWeek[i]['Shaheen']);
          }
          this.chartTransactionsStatusWeekDataset = [
            {data: sucess, label: 'Sucess'},
            {data: initException, label: 'Kaizen'},
            {data: systemException, label: 'Kajo'},
            {data: businessException, label: 'Development'},
            {data: notImplementedException, label: 'Shaheen'},
          ];
        } catch (error) {  
        }

        try {
          let transactionsToday = response['chartTransactionsStatusToday'];
          this.chartTransactionsStatusTodayDataset = new Array<any>();
          this.chartTransactionsStatusTodayLabels = new Array<any>();
          let sucess = [];
          let initException = [];
          let systemException = [];
          let businessException = [];
          let notImplementedException = [];

          for (let i = 0; i < transactionsToday.length; i++) {
            this.chartTransactionsStatusTodayLabels.push(
              transactionsToday[i]['dateTime'].substring(
                transactionsToday[i]['dateTime'].indexOf('T')+1).substring(0,5)
                );
              
              sucess.push(transactionsToday[i]['MoQa']);
              initException.push(transactionsToday[i]['Kaizen']);
              systemException.push(transactionsToday[i]['Kajo']);
              businessException.push(transactionsToday[i]['Development']);
              notImplementedException.push(transactionsToday[i]['Shaheen']);
          }
          this.chartTransactionsStatusTodayDataset = [
            {data: sucess, label: 'Sucess'},
            {data: initException, label: 'Kaizen'},
            {data: systemException, label: 'Kajo'},
            {data: businessException, label: 'Development'},
            {data: notImplementedException, label: 'Shaheen'},
          ];
        } catch (error) {
        }

  }
  

  showNotification(message: string, level: NotificationLevel) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      panelClass: [Utils.notificationLevel(level)],
      data: {
        message: message
      }
    });
  }
}
