import {Component, Input, OnInit} from '@angular/core';
import {LoginService} from "../services/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ShoppingBagService} from "../services/shopping-bag.service";
import {AuthGuardService} from "../services/auth-guard.service";
import {OrdersService} from "../services/orders.service";
import {ProductsService} from "../services/products.service";

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

  public shipping: any =  {}

  @Input()
  public is_edit: boolean = false

  public user_info: any = {}

  public shoppingBag: any[] = []

  public paymentInfo: string = ""


  constructor(public authService: AuthGuardService,private loginService:LoginService, private router: Router, public shoppingBagService: ShoppingBagService, public orderService: OrdersService, private route:ActivatedRoute, private productService: ProductsService) {
  }

  ngOnInit(): void {
    // If edit mode get the order data & customer data from BE & Join to the products in bag data
    if (this.is_edit){
      this.orderService.get_order_data(this.route.snapshot.params['id']).subscribe((result: any) => {
        const order_details = result
        const bagData: any[] = []
        this.shipping = result.shipping
        this.paymentInfo = result.payment_info
        this.orderService.get_customer_data(result.customer).subscribe(result => {
          this.user_info = result
        })
        order_details.products.forEach((order_product: any) => {
          this.productService.get_product_by_id(order_product.product).subscribe((product_result: any) => {
            bagData.push({
              _id: product_result._id,
              qty: order_product.quantity,
              image_url: product_result.image_url,
              brand: product_result.brand,
              price: order_product.price_at_sale
            })
          })
        })
        this.shoppingBag = bagData
      })

    }
    else{
      this.user_info = this.authService.user_info
    }
  }

  // get items for the shopping bag from the shared service \ private prop when in edit mode
  getShoppingBag(){
    if (this.is_edit){
      return this.shoppingBag
    }
    else{
      return this.shoppingBagService.shoppingBag
    }
  }

  removeItem(id: string){
    if (this.is_edit) {
      this.shoppingBag.splice(this.shoppingBag.findIndex((value: any) => value._id = id),1)
    }
    else{
      this.shoppingBagService.removeItem(id)
    }
  }

  getTotalPrice(){
    let sum = 0
    this.shoppingBag.forEach((product: any) => sum+= (product.qty * product.price))
    return sum
  }


  public isSubmitDisabled(){
    return this.getShoppingBag().length == 0 || Object.keys(this.shipping).length == 0 || Object.keys(this.shipping).some((key: any)=> this.shipping[key] == undefined || this.shipping[key] == '')
  }

  // update order if edit mode
  public onSubmit(){
    if(this.is_edit){
      this.orderService.update_order(this.route.snapshot.params['id'], this.shipping, this.user_info,
        this.shoppingBag, this.getTotalPrice(), this.paymentInfo)
        .subscribe(result => {
          alert('Edit Order Successful')
          this.router.navigateByUrl('admin')
        })
    } else {
      this.shoppingBagService.create_order(this.shipping)
    }
  }
}
