import {InjectionToken, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {environment} from "../../environments/environment";

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
  apiEndpoint: string;
}

export const APP_DI_CONFIG: AppConfig = {
  apiEndpoint: environment.apiEndpoint
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {provide: APP_CONFIG, useValue: APP_DI_CONFIG}
  ]
})
export class AppConfigModule { }
