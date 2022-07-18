import {Component, Input, OnInit} from '@angular/core';
import {ShoppingBagService} from "../services/shopping-bag.service";
import {ProductsService} from "../services/products.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  providers: [ProductsService]
})
export class ProductFormComponent implements OnInit {

  public product: any = undefined;
  @Input()
  public mode: string = 'VIEW'

  public category_data: any[] = []
  public brand_data: any[] = []

  constructor(private router: Router, public shoppingBagService: ShoppingBagService, private productsService: ProductsService, private route:ActivatedRoute) { }

  // select sub category when picking a category in edit\create
  public autoSelectFirstSubCategory(){
    this.product.sub_category = this.category_data.find(category => category.name == this.product.category).children[0]._id
  }

  // if not creating - get category by id, if not viewing - get category & brand data for form.
  // if creating -> add default vendor
  ngOnInit(): void {
    if (this.mode !== 'CREATE') {
      this.productsService.get_product_by_id(this.route.snapshot.params['id']).subscribe(result => this.product = result)
    }
    if (this.mode !== 'VIEW'){
      this.productsService.get_category_data().subscribe((result: any) => {
        this.category_data = result.items
      })
      this.productsService.get_brand_data().subscribe((result: any) => {
        this.brand_data = result.items
      })
      if(this.mode == 'CREATE'){
        this.product = {vendor: {$ref: 'vendors', $id: 'terminalx'}}
      }
    }
  }

  // get subcategories by category
  public getSubCategories(){
    if (this.product && this.product.category && this.product.category.length > 0){
      return this.category_data.find(value => value.name == this.product.category).children
    }
    return []
  }

  // if not viewing check that all fields are complete to enable button
  public isActionDisabled(){
    return this.mode !== 'VIEW' &&
      (this.product.title == undefined || this.product.image_url == undefined ||
        this.product.brand == undefined || this.product.price == undefined || this.product.category == undefined || this.product.sub_category == undefined
        || this.product.vendor == undefined)
  }

  // on view - add to cart
  // on edit - update product
  // on create - create
  public onClick(){
    if (this.mode == 'VIEW'){
      this.shoppingBagService.addProductToShoppingBag(this.product)
    }
    else if(this.mode == 'EDIT'){
      this.productsService.update_product(this.product).subscribe(result => {
        this.router.navigateByUrl('product/'+this.product._id)
      })
    }
    else{
      this.productsService.create_product(this.product).subscribe((result: any) => {
        this.router.navigateByUrl('product/'+result.insertedId)
        //this.router.navigateByUrl('product/'+result._id)
      })
    }
  }

}
