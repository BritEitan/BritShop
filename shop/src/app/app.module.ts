import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { SellerDetailsComponent } from './seller-details/seller-details.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { StatsPageComponent } from './stats-page/stats-page.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ShopHomeComponent } from './shop-home/shop-home.component';
import { BrowseProductsComponent } from './browse-products/browse-products.component';
import { LoginFormComponent } from './login-form/login-form.component';
import {LoginService} from "./services/login.service";
import {ApiOperationsService} from "./services/api-operations.service";
import {FormsModule} from "@angular/forms";
import {AuthGuardService} from "./services/auth-guard.service";
import {ShoppingBagService} from "./services/shopping-bag.service";
import { SafePipe } from './safe.pipe';
import {AdminAuthGuardService} from "./services/admin-auth-guard.service";
import { OrderSearchComponent } from './order-search/order-search.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CreateProductComponent } from './create-product/create-product.component';


@NgModule({
  declarations: [
    AppComponent,
    ProductSearchComponent,
    ProductFormComponent,
    SellerDetailsComponent,
    OrderFormComponent,
    StatsPageComponent,
    AdminHomeComponent,
    ShopHomeComponent,
    BrowseProductsComponent,
    LoginFormComponent,
    SafePipe,
    OrderSearchComponent,
    EditOrderComponent,
    EditProductComponent,
    CreateProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  // Static "singleton" services
  providers: [AuthGuardService,AdminAuthGuardService,ApiOperationsService, LoginService, ShoppingBagService],
  bootstrap: [AppComponent]
})
export class AppModule { }
