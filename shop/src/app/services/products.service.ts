import { Injectable } from '@angular/core';
import {ApiOperationsService} from "./api-operations.service";
import {AuthGuardService} from "./auth-guard.service";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public apiOperationsService: ApiOperationsService
  constructor(apiOperationsService: ApiOperationsService,public authGuardService: AuthGuardService) {
    this.apiOperationsService = apiOperationsService
  }


  //  remove undefined filters and search
  search_products(search_string: string, brand: string|undefined, category:string|undefined, sub_category: string|undefined, price_min: number|undefined, price_max: number|undefined, offset:number){
    let params: any = {search_string, category, sub_category, brand, price_min, price_max, offset, limit: 8}

    Object.keys(params).forEach(key => params[key] === undefined && delete params[key])

    return this.apiOperationsService.get('product/search-products', params)
  }

  remove_product(id: string){
    return this.apiOperationsService.delete('product/' + id)
  }

  get_product_by_id(id: string){
    return this.apiOperationsService.get('product/' + id, undefined)
  }

  create_product(product: any){
    return this.apiOperationsService.create('product', product)
  }

  update_product(product: any){
    return this.apiOperationsService.update('product', product)
  }


  get_category_data(){
    return this.apiOperationsService.get('metadata/categories', {})
  }

  get_brand_data(){
    return this.apiOperationsService.get('metadata/brands', {})
  }

  get_vendor_data(){
    return this.apiOperationsService.get('metadata/vendors', {})
  }

}
