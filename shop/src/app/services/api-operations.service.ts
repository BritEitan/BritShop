import { Injectable } from '@angular/core';
import {HttpClient, HttpHandler} from '@angular/common/http';

// basic api utils
@Injectable({
  providedIn: 'root'
})
export class ApiOperationsService {

  private readonly BACKEND_URL = "http://localhost:3000/"

  constructor(private http: HttpClient) {
  }

  public get(path: string, params: any){
    return this.http.get(this.BACKEND_URL + path,{
      params
    })
  }

  public update(path: string, body: any){
    return this.http.put(this.BACKEND_URL + path, body)
  }

  public create(path: string, body: any){
    return this.http.post(this.BACKEND_URL + path, body)
  }

  public delete(path: string){
    return this.http.delete(this.BACKEND_URL + path)
  }
}
