import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import {
  faUser, faCalendarAlt, faBox, faSortNumericDown,
  faDollarSign, faWarehouse, faTrash, faPlus,
  faCartPlus, faSave, faTags
} from "@fortawesome/free-solid-svg-icons";

import { ProductModule } from "../../module/product/product.module";
import { SalesModule } from "../../module/sales/sales.module";
import { CategoryModule } from "../../module/category/category.module";
import { ProductService } from "../../service/product.service";
import { SalesService } from "../../service/sales.service";
import { CategoryService } from "../../service/category.service";

@Component({
  selector: 'app-createsales',
  templateUrl: './createsales.component.html',
  styleUrls: ['./createsales.component.css']
})
export class CreatesalesComponent implements OnInit, OnDestroy {
  products: ProductModule[] = [];
  categories: CategoryModule[] = [];
  salesForm!: FormGroup;
  sale: SalesModule = new SalesModule();
  subscriptions = new Subscription();
  filteredProductsList: ProductModule[][] = [];

  // Icons
  faUser = faUser;
  faCalendarAlt = faCalendarAlt;
  faBox = faBox;
  faSortNumericDown = faSortNumericDown;
  faDollarSign = faDollarSign;
  faWarehouse = faWarehouse;
  faTrash = faTrash;
  faPlus = faPlus;
  faCartPlus = faCartPlus;
  faSave = faSave;
  faTags = faTags;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private salesService: SalesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadDhanmondiBranchProducts();
    this.initSalesForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initSalesForm() {
    const today = new Date().toISOString().substr(0, 10);
    this.salesForm = this.fb.group({
      customername: ['', Validators.required],
      salesdate: [today, Validators.required],
      products: this.fb.array([]),
      totalprice: [{ value: '', disabled: true }],
      discount: [0, Validators.required],
    });

    this.addProductRow();

    this.subscriptions.add(
      this.productsArray.valueChanges.pipe(debounceTime(300))
        .subscribe(() => this.calculateTotalPrice())
    );
  }

  get productsArray(): FormArray {
    return this.salesForm.get('products') as FormArray;
  }

  loadCategories() {
    this.categoryService.getAllCategory().subscribe({
      next: res => this.categories = res,
      error: err => console.error(err),
    });
  }

  loadDhanmondiBranchProducts() {
    this.productService.getAllDhanmondiBrancesProduct().subscribe({
      next: res => this.products = res,
      error: err => console.error(err),
    });
  }

  onCategoryChange(index: number) {
    const category = this.productsArray.at(index).get('category')?.value;
    if (!category?.categoryname) return;

    this.productService.findProductByCategoryName('Pharacetamol').subscribe({
      next: products => {
        console.log('Fetched products:', products);
        const filtered = products.filter(p => p.branch?.branchName === 'Dhanmondi');
        this.filteredProductsList[index] = filtered;

        this.productsArray.at(index).patchValue({
          name: '',
          unitprice: '',
          stock: '',
          quantity: { value: 0, disabled: true },
          expiryDate: '',
        });
      },
      error: err => console.error(err),
    });
  }

  getFilteredProducts(index: number): ProductModule[] {
    return this.filteredProductsList[index] || [];
  }

  addProductRow() {
    const idx = this.productsArray.length;
    const row = this.fb.group({
      id: [0],
      category: ['', Validators.required],
      name: ['', Validators.required],
      quantity: [{ value: 0, disabled: true }, Validators.required],
      unitprice: [{ value: 0, disabled: true }],
      stock: [{ value: 0, disabled: true }],
      expiryDate: ['']
    });

    row.get('name')?.valueChanges.subscribe(name => {
      const prod = this.getFilteredProducts(idx).find(p => p.name === name);
      if (prod) {
        row.patchValue({
          id: prod.id,
          unitprice: prod.unitprice,
          stock: prod.stock,
          expiryDate: prod.expiryDate
        });
        row.get('quantity')?.enable();
      }
    });

    this.productsArray.push(row);
  }

  removeProductRow(i: number) {
    this.productsArray.removeAt(i);
    this.filteredProductsList.splice(i, 1);
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    let total = 0;
    this.productsArray.controls.forEach(c => {
      const { quantity, unitprice } = c.value;
      total += (quantity || 0) * (unitprice || 0);
    });
    this.salesForm.patchValue({ totalprice: total });
  }

  createSales() {
    this.calculateTotalPrice();
    this.salesForm.get('totalprice')?.enable();

    const expired = this.salesForm.value.products.filter((pr: any) =>
      pr.expiryDate && new Date(pr.expiryDate) < new Date()
    );

    if (expired.length) {
      alert(`Cannot sell expired products:\n${expired.map((p: any) => p.name).join(', ')}`);
      this.salesForm.get('totalprice')?.disable();
      return;
    }

    this.sale = {
      ...this.salesForm.value,
      product: this.salesForm.value.products.map((pr: any) => {
        const original = this.products.find(p => p.id === pr.id);
        if (original) {
          original.stock -= pr.quantity;
          return { ...original, quantity: pr.quantity };
        }
        return null;
      }).filter(Boolean) as any
    };

    this.salesService.createSales(this.sale).subscribe({
      next: () => {
        this.sale.product.forEach((p: any) =>
          this.productService.updateProducts(p).subscribe({
            next: () => console.log(`Updated stock for product ${p.id}`),
            error: e => console.error(e)
          })
        );
        this.router.navigate(['invoice'], { queryParams: { sale: JSON.stringify(this.sale) } });
      },
      error: e => console.error(e),
    });
  }
}
