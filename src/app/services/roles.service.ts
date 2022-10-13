import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {APP_CONFIG, AppConfig} from "../app-config/app-config.module";
import {Observable} from "rxjs";
import {ResultSet} from "../models/result-set";
import {Sort} from "@angular/material/sort";
import { Role } from '../models/api-models/Role';
import { UpdateRoleDTO } from '../models/api-models/dtos/UpdateRoleDTO';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private readonly BASE_URL: string;
  private readonly GET_ALL: string;
  private readonly GET_BY_ID: string;
  private readonly UPDATE_ITEM: string;
  private readonly DELETE_ITEM: string;
  private readonly Add_ITEM: string;
  private readonly SET_ROLE_USERS: string;
  private readonly SET_ROLE_PERMISSIONS: string;
  private readonly GET_ALL_PERMISSIONS: string;

  constructor(
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.BASE_URL = this.config.apiEndpoint;
    this.GET_ALL = this.BASE_URL + '/Roles';
    this.GET_BY_ID = this.GET_ALL + '/';
    this.UPDATE_ITEM = this.GET_ALL + '/';
    this.DELETE_ITEM = this.GET_ALL + '/';
    this.Add_ITEM = this.GET_ALL;
    this.SET_ROLE_USERS = this.BASE_URL + '/UpdateRoleUsers(roleId={roleId})';
    this.SET_ROLE_PERMISSIONS = this.BASE_URL + '/UpdateRolePermissions(roleId={roleId})';
    this.GET_ALL_PERMISSIONS = this.BASE_URL + '/GetAllPermissions';
  }

  getAll(top: number, skip: number, order?: Sort, filtersToApply?: any): Observable<ResultSet<Role>> {
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
        filterString += `(contains(role, '${filtersToApply.searchText}'))`;
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
    params = params.set('$expand', 'users');
    return this.httpClient.get<ResultSet<Role>>(this.GET_ALL, {params: params});
  }

  getForExport(order?: Sort, filtersToApply?: any): Observable<ResultSet<Role>> {
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
        filterString += `(contains(role, '${filtersToApply.searchText}'))`;
      }
    }
    if (filterString != '')
      params = params.set('$filter', filterString);
    else
      params = params.delete('$filter');

    if (order && order.direction != '') {
      params = params.set('$orderby', order.active.replace(/\./gi, '/') + ' ' + order.direction);
    } 
    params = params.set('$expand', 'users');
    return this.httpClient.get<ResultSet<Role>>(this.GET_ALL, {params: params});
  }

  getById(id: string): Observable<Role> {
    let params: HttpParams = new HttpParams();
    params = params.set('$expand', 'users');
    return this.httpClient.get<Role>(this.GET_BY_ID + id, {params: params});
  }

  AddItem(item: UpdateRoleDTO): Observable<Role> {
    return this.httpClient.post<Role>(this.Add_ITEM, item);
  }

  updateItem(id: string, item: UpdateRoleDTO): Observable<Role> {
    return this.httpClient.put<Role>(this.UPDATE_ITEM + id, item);
  }

  deleteItem(id: string) {
    return this.httpClient.delete(this.DELETE_ITEM + id);
  }

  
  geItemsForDropdown(): Observable<ResultSet<Role>> {
    let params: HttpParams = new HttpParams();
    params = params.set('$select', 'roleID,role');
    return this.httpClient.get<ResultSet<Role>>(this.GET_ALL, {params: params});
  }

  setRoleUsers(id: string, users: string[]){
    return this.httpClient.post(this.SET_ROLE_USERS.replace('{roleId}',id), users);
  }

  setRolePermissions(id: string, permissions: string[]){
    return this.httpClient.post(this.SET_ROLE_PERMISSIONS.replace('{roleId}',id), permissions);
  }

  getAllPermissions(){
    return this.httpClient.get<ResultSet<string>>(this.GET_ALL_PERMISSIONS);
  }
}
