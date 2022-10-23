import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {APP_CONFIG, AppConfig} from "../app-config/app-config.module";
import {Observable} from "rxjs";
import {ResultSet} from "../models/result-set";
import {Sort} from "@angular/material/sort";
import { Topic } from '../models/api-models/Topic';
import { UpdateTopicDTO } from '../models/api-models/dtos/UpdateTopicDTO';


@Injectable({
  providedIn: 'root'
})
export class TopicsService {

  private readonly BASE_URL: string;
  private readonly GET_ALL: string;
  private readonly GET_BY_ID: string;
  private readonly UPDATE_ITEM: string;
  private readonly DELETE_ITEM: string;
  private readonly Add_ITEM: string;

  constructor(
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.BASE_URL = this.config.apiEndpoint;
    this.GET_ALL = this.BASE_URL + '/Topics';
    this.GET_BY_ID = this.GET_ALL + '/';
    this.UPDATE_ITEM = this.GET_ALL + '/';
    this.DELETE_ITEM = this.GET_ALL + '/';
    this.Add_ITEM = this.GET_ALL;
  }

  getAll(top: number, skip: number, order?: Sort, filtersToApply?: any): Observable<ResultSet<Topic>> {
    let params: HttpParams = new HttpParams();
    let filterString: string = '';
    if (filtersToApply != null) {
      for (let i = 0; i < filtersToApply.filters.length; i++) {
        if (filtersToApply.filters[i].value != '' && filtersToApply.filters[i].value != 'All') {
          if (filterString != '') {
            filterString += ' and ';
          }
          filterString += `${filtersToApply.filters[i].parameter} Eq '${filtersToApply.filters[i].value}'`;
        }
      }
      if (filtersToApply.searchText != '') {
        if (filterString != '')
          filterString += ' and '
        filterString += `(contains(title, '${filtersToApply.searchText}'))`;
      }
    }
    if (filterString != '')
      params = params.set('$filter', filterString);
    else
      params = params.delete('$filter');

    if (order && order.direction != '') {
      params = params.set('$orderby', order.active.replace(/\./gi, '/') + ' ' + order.direction);
    }
    params = params.set('$count', 'true');
    params = params.set('$top', top.toString());
    params = params.set('$skip', skip.toString());
    params = params.set('$expand', 'user,posts');
    return this.httpClient.get<ResultSet<Topic>>(this.GET_ALL, {params: params});
  }

  getForExport(order?: Sort, filtersToApply?: any): Observable<ResultSet<Topic>> {
    let params: HttpParams = new HttpParams();
    let filterString: string = '';
    if (filtersToApply != null) {
      for (let i = 0; i < filtersToApply.filters.length; i++) {
        if (filtersToApply.filters[i].value != '' && filtersToApply.filters[i].value != 'All') {
          if (filterString != '') {
            filterString += ' and ';
          }
          filterString += `${filtersToApply.filters[i].parameter} Eq '${filtersToApply.filters[i].value}'`;
        }
      }
      if (filtersToApply.searchText != '') {
        if (filterString != '')
          filterString += ' and '
        filterString += `(contains(title, '${filtersToApply.searchText}'))`;
      }
    }
    if (filterString != '')
      params = params.set('$filter', filterString);
    else
      params = params.delete('$filter');

    if (order && order.direction != '') {
      params = params.set('$orderby', order.active.replace(/\./gi, '/') + ' ' + order.direction);
    } 
    params = params.set('$expand', 'user,posts');
    return this.httpClient.get<ResultSet<Topic>>(this.GET_ALL, {params: params});
  }

  getById(id: string): Observable<Topic> {
    let params: HttpParams = new HttpParams();
    params = params.set('$expand', 'user,posts');
    return this.httpClient.get<Topic>(this.GET_BY_ID + id, {params: params});
  }

  AddItem(item: UpdateTopicDTO): Observable<Topic> {
    return this.httpClient.post<Topic>(this.Add_ITEM, item);
  }

  updateItem(id: string, item: UpdateTopicDTO): Observable<Topic> {
    return this.httpClient.put<Topic>(this.UPDATE_ITEM + id, item);
  }

  deleteItem(id: string) {
    return this.httpClient.delete(this.DELETE_ITEM + id);
  }

  
  geItemsForDropdown(): Observable<ResultSet<Topic>> {
    let params: HttpParams = new HttpParams();
    params = params.set('$select', 'id,title');
    return this.httpClient.get<ResultSet<Topic>>(this.GET_ALL, {params: params});
  }

}
