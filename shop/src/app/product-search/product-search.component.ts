import {Component, Input, OnInit} from '@angular/core';
import {LoginService} from "../services/login.service";
import {Router} from "@angular/router";
import {ProductsService} from "../services/products.service";
import {ShoppingBagService} from "../services/shopping-bag.service";
import {WebSocketServer} from "ws";

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css'],
  providers: [ProductsService]
})
export class ProductSearchComponent implements OnInit {

  constructor(private loginService:LoginService, public router: Router, private productsService: ProductsService, public shoppingBagService: ShoppingBagService) {
  }
  @Input() admin_mode: boolean | undefined = false;

  // filters
  public search_string: string = ""
  public brand: string = ""
  public category: string = ""
  public sub_category: string = ""
  public price_min: number|undefined = undefined
  public price_max: number|undefined = undefined

  public product_results: any[] = []

  private offset: number = 0

  public total_pages = 0
  public current_page = 0

  public category_data: any[] = []
  public brand_data: any[] = []

  public topSellingItem: any = {}

  // show/hide top seliing item alert
  public showToast: boolean = true;


  ngOnInit(): void {
    // get default search results
    this.submitSearch()

    // get filters data
    this.productsService.get_category_data().subscribe((result: any) => {
      this.category_data = result.items
    })
    this.productsService.get_brand_data().subscribe((result: any) => {
      this.brand_data = result.items
    })

    // on enter preform search
    const filterElements = document.getElementById('body')
    if (filterElements !== null) {
      filterElements.addEventListener('keyup', function (this: any, evt: any) {
        if (evt.keyCode == 13) {
          this.offset = 0
          this.submitSearch()
        }
      }.bind(this))
    }

    this.configureWebSocket()
  }

  // configure websocket client
  configureWebSocket(){
    let ws = new WebSocket('ws://localhost:3000');
    ws.onmessage = (message: any) => {
        this.showToast = true
        this.topSellingItem = JSON.parse(message.data)
    }
  }

  public submitSearch(){
    this.productsService.search_products(this.search_string, this.brand.length > 0 ? this.brand : undefined
      , this.category.length > 0 ? this.category : undefined,
      this.sub_category.length > 0 ? this.sub_category : undefined, this.price_min, this.price_max, this.offset )
      .subscribe((response: any) => {
        this.product_results = response.items

        // handle pagination
        this.total_pages = Math.ceil(response.total_count / 8.00)
        this.current_page = (this.offset + 8) / 8
      })
  }

  public removeProduct(id: string){
    this.productsService.remove_product(id).subscribe(result => this.submitSearch())
  }

  public goToNextPage(){
    this.offset += 8
    this.submitSearch()
  }

  public goBack(){
    this.offset -= 8
    this.submitSearch()
  }

  // get sub categories by selected category
  public getSubCategories(){
    if (this.category.length > 0){
      return this.category_data.find(value => value.name == this.category).children
    }
    return []
  }


}
