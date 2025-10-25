import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CustomerModule } from "../customer/customer.module";
import { ProductModule } from "../product/product.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SalesOrderModule { 

  id!:number;
  orderDate!:Date;
  customer!:CustomerModule;
  products!:ProductModule[];
}