import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {APP_CONFIG, AppConfig} from "../app-config/app-config.module";
import {Observable} from "rxjs";
import {ResultSet} from "../models/result-set";
import {Sort} from "@angular/material/sort";
import { Post } from '../models/api-models/Post';
import { UpdatePostDTO } from '../models/api-models/dtos/UpdatePostDTO';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

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
    this.GET_ALL = this.BASE_URL + '/Posts';
    this.GET_BY_ID = this.GET_ALL + '/';
    this.UPDATE_ITEM = this.GET_ALL + '/';
    this.DELETE_ITEM = this.GET_ALL + '/';
    this.Add_ITEM = this.GET_ALL;
  }

  getAll(top: number, skip: number, order?: Sort, filtersToApply?: any): Observable<ResultSet<Post>> {
    let params: HttpParams = new HttpParams();
    let filterString: string = '';
    if (filtersToApply != null) {

      if(filtersToApply.startDate && filtersToApply.endDate){
        let startDate:Date = filtersToApply.startDate;
        let endDate:Date = filtersToApply.endDate;
        endDate.setHours(23,59,59,999)
        filterString += `updateDate ge ${startDate.toISOString()} and updateDate le ${endDate.toISOString()}`
      }

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
    params = params.set('$expand', 'user,topic');
    return this.httpClient.get<ResultSet<Post>>(this.GET_ALL, {params: params});
  }

  getForExport(order?: Sort, filtersToApply?: any): Observable<ResultSet<Post>> {
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
    params = params.set('$expand', 'user,topic');
    return this.httpClient.get<ResultSet<Post>>(this.GET_ALL, {params: params});
  }

  getById(id: string): Observable<Post> {
    let params: HttpParams = new HttpParams();
    params = params.set('$expand', 'user,topic');
    return this.httpClient.get<Post>(this.GET_BY_ID + id, {params: params});
  }

  AddItem(item: UpdatePostDTO): Observable<Post> {
    return this.httpClient.post<Post>(this.Add_ITEM, item);
  }

  updateItem(id: string, item: UpdatePostDTO): Observable<Post> {
    return this.httpClient.put<Post>(this.UPDATE_ITEM + id, item);
  }

  deleteItem(id: string) {
    return this.httpClient.delete(this.DELETE_ITEM + id);
  }

}
