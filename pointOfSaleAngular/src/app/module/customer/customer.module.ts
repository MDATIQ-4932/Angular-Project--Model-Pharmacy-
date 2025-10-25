import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";




@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})


export class CustomerModule { 
  id!:number;
  name!:string;
  cell!:number;
  address!:string;
}