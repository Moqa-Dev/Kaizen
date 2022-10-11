import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {APP_CONFIG, AppConfig} from "../app-config/app-config.module";
import {LoginUserDTO} from "../models/users-models/LoginUserDTO";
import {Observable} from "rxjs";
import {TokenDTO} from "../models/users-models/TokenDTO";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly BASE_URL: string;
  private readonly LOGIN_URL: string;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.BASE_URL = this.config.apiEndpoint;
    this.LOGIN_URL = this.BASE_URL + '/Login';
  }

  login(user: LoginUserDTO): Observable<TokenDTO> {
    return this.httpClient.post(this.LOGIN_URL, user);
  }

  isLoggedIn(): boolean {
    return this.getToken() != null;
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('pageSize');
    this.router.navigate(['login']);
  }
}
