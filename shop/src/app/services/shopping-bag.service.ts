import { Injectable } from '@angular/core';
import {ApiOperationsService} from "./api-operations.service";
import {AuthGuardService} from "./auth-guard.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ShoppingBagService {

  public apiOperationsService: ApiOperationsService

  // shared shopping bag object
  public shoppingBag: any[] = []

  constructor(apiOperationsService: ApiOperationsService,public authGuardService: AuthGuardService, private router: Router) {
    this.apiOperationsService = apiOperationsService
  }

  create_order(shipping_address: any){
    this.apiOperationsService.create('order', {
      customer: this.authGuardService.user_info._id,
      products: this.shoppingBag.map(product => {return {
        product: product._id, price_at_sale: product.price, quantity: product.qty, total_price_at_sale: product.price * product.qty
      }}),
      shipping: shipping_address,
      total_price: this.getTotalPrice(),
      payment_info: this.authGuardService.user_info.payment_method
    }).subscribe(result => {
      alert('Order Successful')
      this.router.navigateByUrl('')
      this.shoppingBag = []
    })
  }

  // get sum of bag
  getTotalPrice(){
    let sum = 0
    this.shoppingBag.forEach(product => sum+= (product.qty * product.price))
    return sum
  }

  // add product to the global shopping bag object
  addProductToShoppingBag(product: any){
    if (!this.shoppingBag.some(productInBag => productInBag._id === product._id)){
      product.qty = 1
      this.shoppingBag.push(product)
    }
  }
  removeItem(id: string){
    this.shoppingBag.splice(this.shoppingBag.findIndex(value => value._id = id),1)
  }
}
