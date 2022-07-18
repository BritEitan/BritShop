import { Component, OnInit } from '@angular/core';
import {LoginService} from "../services/login.service";
import {Router} from "@angular/router";
import {ProductsService} from "../services/products.service";
import {ShoppingBagService} from "../services/shopping-bag.service";
import {OrdersService} from "../services/orders.service";

@Component({
  selector: 'app-order-search',
  templateUrl: './order-search.component.html',
  styleUrls: ['./order-search.component.css']
})
export class OrderSearchComponent implements OnInit {

  // filters
  public search_string: string = ""
  public date_min: Date|undefined = undefined
  public date_max: Date|undefined = undefined
  public total_order_min: number|undefined = undefined
  public total_order_max: number|undefined = undefined

  // default pagination
  private offset: number = 0

  public total_pages = 0
  public current_page = 0

  // order list
  public order_results: any[] = []

  constructor(private loginService:LoginService, public router: Router, private orderService: OrdersService) {
  }

  ngOnInit(): void {
    this.submitSearch()
  }

  public submitSearch(){
    this.orderService.search_orders(this.search_string, this.total_order_min, this.total_order_max,this.date_min, this.date_max ,this.offset )
      .subscribe((response: any) => {
        this.order_results = response.items
        // refresh pagination data
        this.total_pages = Math.ceil(response.total_count / 8.00)
        this.current_page = (this.offset + 8) / 8
      })
  }

  public goToNextPage(){
    this.offset += 8
    this.submitSearch()
  }

  public goBack(){
    this.offset -= 8
    this.submitSearch()
  }

  public removeProduct(id: string){
    this.orderService.remove_order(id).subscribe(result => this.submitSearch())
  }

}
