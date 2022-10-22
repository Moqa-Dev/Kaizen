import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoginService} from "../services/login.service";
import {catchError, finalize} from "rxjs/operators";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../components/snack-bar/snack-bar.component";
import {NotificationLevel} from "../models/enums/code-enums/notification-level";
import Utils from "../util/Utils";
import {ErrorDTO} from "../models/ErrorDTO";
import {ProgressBarService} from "../services/progress-bar.service";

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
    private progressBarService: ProgressBarService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.toLowerCase().indexOf('upload') == -1 && !(request.body instanceof FormData)) {
      request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
    }

    if (request.url.toLowerCase().indexOf('download') == -1)
      request = request.clone({headers: request.headers.set('Accept', 'application/json')});
    else
      request = request.clone({headers: request.headers.set('Accept', 'application/json').set('Accept', 'application/octet-stream')});

    if (this.loginService.getToken() != null)
      request = request.clone({headers: request.headers.set('Authorization', 'Bearer ' + this.loginService.getToken())});

    this.progressBarService.show(true);

    return next.handle(request).pipe(
      // @ts-ignore
      catchError((error: HttpErrorResponse) => {
        if (error)
          if (error.status == 404) {
            this.showNotification({Message: 'Not found', ErrorCode: 404}, NotificationLevel.ERROR);
          } else if (error.status == 401) {
            let errorDTO: ErrorDTO = new ErrorDTO();
            errorDTO.Message = 'Your session is expired, please login again';
            this.showNotification(errorDTO, NotificationLevel.ERROR);
            this.loginService.logout();
            this.router.navigate(['/admin/login']);
          }else if (error.status == 403) {
            let errorDTO: ErrorDTO = new ErrorDTO();
            errorDTO.Message = 'You are not Authorized to perform this Action!';
            this.showNotification(errorDTO, NotificationLevel.ERROR);
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.showNotification(error.error, NotificationLevel.ERROR);
          }
        this.progressBarService.show(false);
      }),
      finalize(() => {
        this.progressBarService.show(false);
      })
    );
  }

  showNotification(error: ErrorDTO, level: NotificationLevel) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      panelClass: [Utils.notificationLevel(level)],
      data: {
        errorCode: error.ErrorCode,
        message: error.Message
      }
    });
  }
}
