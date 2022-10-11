import {Component, OnInit} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {NotificationLevel} from "../../models/enums/code-enums/notification-level";
import {SnackBarComponent} from "../../components/snack-bar/snack-bar.component";
import Utils from "../../util/Utils";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import { Observable,Subscription, interval  } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
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
  pieTransactionsStatusLabels: Array<any> = ['Suceess','InitException','SystemException','BusinessException','NotImplementedException'];
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
  chartTransactionsStatusWeekLabels: Array<any> = ['Suceess','InitException','SystemException','BusinessException','NotImplementedException'];

  chartTransactionsStatusTodayDataset: Array<any> = new Array<any>();
  chartTransactionsStatusTodayLabels: Array<any> = ['Suceess','InitException','SystemException','BusinessException','NotImplementedException'];
  
  chartOptions: any = {responsive: true};

  constructor(
    private dashboardService: DashboardService,
    private titleService: Title,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
  }
  private updateSubscription: Subscription;
  ngOnInit() {
    

    this.updateSubscription = interval(30000).subscribe(
      (val) => { 
        if(this.router.url === '/dashboard'){
          if (window.screen.width <= 800) {
            this.showLegend = false;
          }else{
            this.showLegend = true;
          }
          this.getDashboardData();
      }
      });
 
    let notFoundParam: string = this.route.snapshot.paramMap.get('notFound');
    if (notFoundParam == 'NotFound') {
      this.router.navigate(['dashboard']).then(() => {
        this.showNotification('Requested page is not found!', NotificationLevel.ERROR);
      });
    } else {
      this.titleService.setTitle('MOQA - Dashboard');
      this.getDashboardData();
    }
  }

  getDashboardData(){

    this.dashboardService.getData().subscribe(response =>{
      if(response){
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
              response['pieTransactionsStatus']['suceess'],
              response['pieTransactionsStatus']['initException'],
              response['pieTransactionsStatus']['systemException'],
              response['pieTransactionsStatus']['businessException'],
              response['pieTransactionsStatus']['notImplementedException'],
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

              sucess.push(transactionsWeek[i]['suceess']);
              initException.push(transactionsWeek[i]['initException']);
              systemException.push(transactionsWeek[i]['systemException']);
              businessException.push(transactionsWeek[i]['businessException']);
              notImplementedException.push(transactionsWeek[i]['notImplementedException']);
          }
          this.chartTransactionsStatusWeekDataset = [
            {data: sucess, label: 'Sucess'},
            {data: initException, label: 'InitException'},
            {data: systemException, label: 'SystemException'},
            {data: businessException, label: 'BusinessException'},
            {data: notImplementedException, label: 'NotImplementedException'},
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
              
              sucess.push(transactionsToday[i]['suceess']);
              initException.push(transactionsToday[i]['initException']);
              systemException.push(transactionsToday[i]['systemException']);
              businessException.push(transactionsToday[i]['businessException']);
              notImplementedException.push(transactionsToday[i]['notImplementedException']);
          }
          this.chartTransactionsStatusTodayDataset = [
            {data: sucess, label: 'Sucess'},
            {data: initException, label: 'InitException'},
            {data: systemException, label: 'SystemException'},
            {data: businessException, label: 'BusinessException'},
            {data: notImplementedException, label: 'NotImplementedException'},
          ];
        } catch (error) {
        }

      }
    });
  }
  



  showNotification(message: string, level: NotificationLevel) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      panelClass: [Utils.notificationLevel(level)],
      data: {
        message: message
      }
    });
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

}
