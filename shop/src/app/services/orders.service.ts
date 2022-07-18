import { Injectable } from '@angular/core';
import {ApiOperationsService} from "./api-operations.service";
import {AuthGuardService} from "./auth-guard.service";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  public apiOperationsService: ApiOperationsService
  constructor(apiOperationsService: ApiOperationsService,public authGuardService: AuthGuardService) {
    this.apiOperationsService = apiOperationsService
  }

  // transform order json and update
  update_order(id: string, shipping_address: any, user_info: any, shoppingBag: any[], total_price: number, payment_info: string) {
    return this.apiOperationsService.update('order', {
      _id: id,
      customer: user_info._id,
      products: shoppingBag.map(product => {
        return {
          product: product._id,
          price_at_sale: product.price,
          quantity: product.qty,
          total_price_at_sale: product.price * product.qty
        }
      }),
      shipping: shipping_address,
      total_price: total_price,
      payment_info: payment_info
    })
  }

  //  remove undefined filters and search
  search_orders(search_string: string,total_order_min: number|undefined, total_order_max: number|undefined, date_min: Date|undefined, date_max: Date|undefined, offset:number){
    let params: any = {search_string, total_order_min, total_order_max, date_min, date_max, offset, limit: 8}

    Object.keys(params).forEach(key => params[key] === undefined && delete params[key])

    return this.apiOperationsService.get('order/search-orders', params)
  }

  remove_order(id: string){
    return this.apiOperationsService.delete('order/' + id)
  }

  edit_order(id: string, order: any){
    return this.apiOperationsService.update('order/' + id, order)
  }

  get_order_data(id: string){
    return this.apiOperationsService.get('order/' + id, {})
  }

  get_customer_data(id: string){
    return this.apiOperationsService.get('customers/' + id, {})
  }
}
