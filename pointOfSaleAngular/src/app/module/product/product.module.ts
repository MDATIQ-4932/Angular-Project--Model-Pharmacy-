import { NgModule } from "@angular/core";
import { BranchModule } from "../branch/branch.module";
import { CategoryModule } from "../category/category.module";
import { CommonModule } from "@angular/common";
import { SupplierModule } from "../supplier/supplier.module";




@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})


export class ProductModule {
  id!: number; // Use `!` to indicate that it will be defined
  name!: string;
  photo?: string; // URL or base64 string
  stock!: number;
  unitprice!: number;
  quantity!: number;
  manufactureDate!:Date;
  expiryDate!:string;
  // discount!:number;
  categories!: CategoryModule[];
  supplier!: SupplierModule;
  branch!: BranchModule;
}