import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShopHomeComponent} from "./shop-home/shop-home.component";
import {AdminHomeComponent} from "./admin-home/admin-home.component";
import {StatsPageComponent} from "./stats-page/stats-page.component";
import {ProductSearchComponent} from "./product-search/product-search.component";
import {OrderFormComponent} from "./order-form/order-form.component";
import {BrowseProductsComponent} from "./browse-products/browse-products.component";
import {ProductFormComponent} from "./product-form/product-form.component";
import {SellerDetailsComponent} from "./seller-details/seller-details.component";
import {LoginFormComponent} from "./login-form/login-form.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {AdminAuthGuardService} from "./services/admin-auth-guard.service";
import {EditOrderComponent} from "./edit-order/edit-order.component";
import {CreateProductComponent} from "./create-product/create-product.component";
import {EditProductComponent} from "./edit-product/edit-product.component";

const routes: Routes = [  { path: '', component: BrowseProductsComponent, canActivate: [AuthGuardService] },
  { path: 'admin', component: AdminHomeComponent, canActivate: [AuthGuardService, AdminAuthGuardService] },
  { path: 'stats', component: StatsPageComponent, canActivate: [AuthGuardService, AdminAuthGuardService] },
  { path: 'order-form', component: OrderFormComponent, canActivate: [AuthGuardService] },
  {path: 'product/:id', component: ProductFormComponent, canActivate: [AuthGuardService]},
  {path: 'admin/product/create', component: CreateProductComponent, canActivate: [AuthGuardService, AdminAuthGuardService]},
  {path: 'admin/product/:id/edit', component: EditProductComponent, canActivate: [AuthGuardService, AdminAuthGuardService]},
  {path: 'admin/order/:id', component: EditOrderComponent, canActivate: [AuthGuardService, AdminAuthGuardService]},
  {path: 'seller/:id', component: SellerDetailsComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: LoginFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
