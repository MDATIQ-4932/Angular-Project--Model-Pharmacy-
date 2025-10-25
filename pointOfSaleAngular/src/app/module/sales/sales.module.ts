import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ProductModule } from "../product/product.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SalesModule {
  id!: number;
  customername!: string;
  salesdate!: Date;
  totalprice!: number;
  quantity!:number;
  discount!:number;
  product!: ProductModule[];
  
}