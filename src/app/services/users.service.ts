import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {APP_CONFIG, AppConfig} from "../app-config/app-config.module";
import {RegisterUserDTO} from "../models/users-models/RegisterUserDTO";
import {Observable} from "rxjs";
import {UserDTO} from "../models/users-models/UserDTO";
import {ResultSet} from "../models/result-set";
import {UpdatePasswordDTO} from "../models/users-models/UpdatePasswordDTO";
import {Sort} from "@angular/material/sort";
import {UpdateUserDTO} from "../models/users-models/UpdateUserDTO";
import { ResetPasswordDTO } from '../models/users-models/ResetPasswordDTO';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly BASE_URL: string;
  private readonly ADD_USER_URL: string;
  private readonly GET_USERS: string;
  private readonly GET_USER: string;
  private readonly GET_CURRENT_USER: string;
  private readonly UPDATE_USER: string;
  private readonly UPDATE_PASSWORD: string;
  private readonly DELETE_USER: string;
  private readonly GET_USER_Permissions: string;
  private readonly RESET_PASSWORD: string;
  private readonly SET_USER_DATA: string;
  private readonly SET_USER_ROLES: string;

  constructor(
    public httpClient: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.BASE_URL = this.config.apiEndpoint;
    this.ADD_USER_URL = this.BASE_URL + '/Register';
    this.GET_USERS = this.BASE_URL + '/Users';
    this.GET_USER = this.GET_USERS + '/';
    this.GET_CURRENT_USER = this.BASE_URL + '/GetUserData';
    this.UPDATE_USER = this.BASE_URL + '/UpdateUserProfile';
    this.UPDATE_PASSWORD = this.BASE_URL + '/UpdatePassword';
    this.DELETE_USER = this.GET_USERS + '/';
    this.GET_USER_Permissions = this.BASE_URL + "/GetUserPermissions";
    this.RESET_PASSWORD = this.BASE_URL + '/UpdateUserPassword(userId={userId})';
    this.SET_USER_DATA = this.BASE_URL + '/EditUserData(userId={userId})';
    this.SET_USER_ROLES = this.BASE_URL + '/UpdateUserRoles(userId={userId})';
  }

  addUser(user: RegisterUserDTO): Observable<RegisterUserDTO> {
    return this.httpClient.post<RegisterUserDTO>(this.ADD_USER_URL, user);
  }

  getUsers(top: number, skip: number, order?: Sort, filtersToApply?: any): Observable<ResultSet<UserDTO>> {
    let params: HttpParams = new HttpParams();
    if (order && order.direction != '') {
      params = params.set('$orderby', order.active.replace(/\./gi, '/') + ' ' + order.direction);
    }
    params = params.set('$count', 'true');
    params = params.set('$top', top.toString());
    params = params.set('$skip', skip.toString());
    if (filtersToApply != null) {
      let filterString = '';
      if (filtersToApply.searchText != '') {
        filterString += `(contains(username, '${filtersToApply.searchText}') or contains(email, '${filtersToApply.searchText}'))`;
      }
      if (filterString != '')
        params = params.set('$filter', filterString);
      else
        params = params.delete('$filter');
    }
    return this.httpClient.get<ResultSet<UserDTO>>(this.GET_USERS, {params: params});
  }

  getUserById(id: string): Observable<UserDTO> {
    return this.httpClient.get<UserDTO>(this.GET_USER + id);
  }

  getUsersCount(): Observable<ResultSet<UserDTO>> {
    let params: HttpParams = new HttpParams();
    params = params.set('$top', '1');
    params = params.set('$skip', '0');
    params = params.set('$count', 'true');
    params = params.set('$select', 'username');
    return this.httpClient.get<ResultSet<UserDTO>>(this.GET_USERS, {params: params});
  }

  getCurrentUser(): Observable<UserDTO> {
    return this.httpClient.get<UserDTO>(this.GET_CURRENT_USER);
  }

  updateUser(updateUser: UpdateUserDTO): Observable<UserDTO> {
    return this.httpClient.post<UserDTO>(this.UPDATE_USER, updateUser);
  }

  updatePassword(updatePassword: UpdatePasswordDTO) {
    return this.httpClient.post(this.UPDATE_PASSWORD, updatePassword);
  }

  deleteUser(id: string) {
    return this.httpClient.delete(this.DELETE_USER + id);
  }
  
  getUserPermissions(): Observable<ResultSet<string>>{
    return this.httpClient.get<ResultSet<string>>(this.GET_USER_Permissions);
  }
  
  resetPassword(id: string, resetPassword: ResetPasswordDTO){
    return this.httpClient.post(this.RESET_PASSWORD.replace('{userId}',id), resetPassword);
  }

  setUserData(id: string, updateUser: UpdateUserDTO){
    return this.httpClient.post(this.SET_USER_DATA.replace('{userId}',id), updateUser);
  }

  setUserRoles(id: string, roles: string[]){
    return this.httpClient.post(this.SET_USER_ROLES.replace('{userId}',id), roles);
  }
  
  geItemsForDropdown(): Observable<ResultSet<UserDTO>> {
    let params: HttpParams = new HttpParams();
    params = params.set('$select', 'userID,username');
    return this.httpClient.get<ResultSet<UserDTO>>(this.GET_USERS, {params: params});
  }

}
