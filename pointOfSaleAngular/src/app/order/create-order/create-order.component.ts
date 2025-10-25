import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from '../../service/product.service';
import { CustomerService } from '../../service/customer.service';
import { OrderService } from '../../service/order.service';

import {
  faBox,
  faDollarSign,
  faImage,
  faPlus,
  faTags,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { CustomerModule } from '../../module/customer/customer.module';
import { ProductModule } from '../../module/product/product.module';
import { OrderModule } from '../../module/order/order.module';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {

  customers: CustomerModule[] = [];
  products: ProductModule[] = [];
  order: OrderModule = new OrderModule();
  formValue!: FormGroup;

  // FontAwesome icons
  faUser = faUser;
  faBox = faBox;
  faDollarSign = faDollarSign;
  faTags = faTags;
  faImage = faImage;
  faPlus = faPlus;

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadProducts();

    this.formValue = this.formBuilder.group({
      quantity: ['', [Validators.required, Validators.min(1)]],
      orderDate: ['', Validators.required],
      customer: [null, Validators.required],
      product: [null, Validators.required]
    });
  }

  loadCustomers() {
    this.customerService.getAllCustomer().subscribe({
      next: res => {
        this.customers = res;
      },
      error: error => {
        console.error('Error loading customers:', error);
      }
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: res => {
        this.products = res;
      },
      error: error => {
        console.error('Error loading products:', error);
      }
    });
  }

  createOrder() {
    if (this.formValue.invalid) return;

    this.order = {
      ...this.order,
      quantity: this.formValue.value.quantity,
      orderDate: this.formValue.value.orderDate,
      customer: this.formValue.value.customer,
      product: this.formValue.value.product
    };

    this.orderService.createOrder(this.order).subscribe({
      next: res => {
        console.log('Order created:', res);
        this.formValue.reset();
        this.router.navigate(['/vieworder']);
      },
      error: error => {
        console.error('Error creating order:', error);
      }
    });
  }
}
