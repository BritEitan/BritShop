import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../services/products.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-seller-details',
  templateUrl: './seller-details.component.html',
  styleUrls: ['./seller-details.component.css'],
  providers: [ProductsService]
})
export class SellerDetailsComponent implements OnInit {

  constructor(private productService: ProductsService, private route:ActivatedRoute) { }

  public vendor: any = undefined

  ngOnInit(): void {
    // get all vendors and filter by the id from route
    this.productService.get_vendor_data().subscribe((results: any) => {
      this.vendor = results.items.filter((item: any) => item._id == this.route.snapshot.params['id'])[0]
    })
  }
}
