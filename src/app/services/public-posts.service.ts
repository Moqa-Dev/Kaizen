import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {APP_CONFIG, AppConfig} from "../app-config/app-config.module";
import {Observable} from "rxjs";
import {ResultSet} from "../models/result-set";
import {Sort} from "@angular/material/sort";
import { Post } from '../models/api-models/Post';
import { UpdatePostDTO } from '../models/api-models/dtos/UpdatePostDTO';
import { PublicPostDto } from '../models/api-models/PublicPostDto';

@Injectable({
  providedIn: 'root'
})
export class PublicPostsService {

  private readonly BASE_URL: string;
  private readonly GET_ALL: string;

  constructor(
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.BASE_URL = this.config.apiEndpoint;
    this.GET_ALL = this.BASE_URL + '/GetPublicPosts';
  }

  getAll(page: number): Observable<PublicPostDto[]> {
    let top = 3;
    let skip = top*page;
    let params: HttpParams = new HttpParams();
    params = params.set('$count', 'true');
    params = params.set('$top', top.toString());
    params = params.set('$skip', skip.toString());
    return this.httpClient.get<PublicPostDto[]>(this.GET_ALL, {params: params});
  }
}
