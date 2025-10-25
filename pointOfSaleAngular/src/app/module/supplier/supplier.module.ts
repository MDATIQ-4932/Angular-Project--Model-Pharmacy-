import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";




@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class SupplierModule { 

  id!:number;
  name!:string;
  email!:string;
  cell!:number;
  address!:string;

}