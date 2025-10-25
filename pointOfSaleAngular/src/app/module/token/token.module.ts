

import { NgModule } from "@angular/core";
import { UserModule } from "../user/user.module";
import { CommonModule } from "@angular/common";


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})


export class TokenModule {
    // Add the token properties here, e.g.
    id!: number;
    token!: string;
    user!: UserModule;
 }