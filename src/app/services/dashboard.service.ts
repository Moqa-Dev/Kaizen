import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {APP_CONFIG, AppConfig} from "../app-config/app-config.module";
import {Observable} from "rxjs";
import {ResultSet} from "../models/result-set";
import { DashboardModel } from '../models/api-models/DashboardModel';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly BASE_URL: string;
  private readonly GET_DATA: string;
  private readonly GET_REPORT_DATA: string;

  constructor(
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.BASE_URL = this.config.apiEndpoint;
    this.GET_DATA = this.BASE_URL + '/GetDashboardData';
    this.GET_REPORT_DATA = this.BASE_URL + '/GetDailyReport';
  }

  getData(): Observable<ResultSet<DashboardModel>> {
    let params: HttpParams = new HttpParams();
    return this.httpClient.get<ResultSet<DashboardModel>>(this.GET_DATA, {params: params});
  }

  getReportData(reportDate: Date): Observable<any> {
    
    let params: HttpParams = new HttpParams();

    let from:Date = reportDate;
    from.setHours(0,0,0);
    params = params.set('From', from.toISOString());
    let to:Date = reportDate;
    to.setHours(23,59,59);
    params = params.set('To', to.toISOString());
    return this.httpClient.get<any>(this.GET_REPORT_DATA, {params: params});
  }
}
