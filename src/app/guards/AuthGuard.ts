import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {LoginService} from "../services/login.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    public loginService: LoginService,
    public router: Router)
  {}

  canActivate(): boolean {
    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }
}
