import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from "@angular/core";
import { SalesModule } from "../../module/sales/sales.module";
import { ProductService } from "../../service/product.service";
import { SalesService } from "../../service/sales.service";
import { Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";


import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-viewsales',
  templateUrl: './viewsales.component.html',
  styleUrls: ['./viewsales.component.css']
})
export class ViewsalesComponent implements OnInit {

  sales: SalesModule[] = [];
  groupedSales: { salesdate: string, totalprice: number }[] = [];
  faEdit = faEdit;
  faTrash = faTrash;
  faEye = faEye;

  @ViewChild('salesChart') salesChart!: ElementRef<HTMLCanvasElement>;
  barColors: string[] = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ];

  constructor(
    private productService: ProductService,
    private salesService: SalesService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any // Inject PLATFORM_ID
  ) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales() {
    this.salesService.getAllSales().subscribe({
      next: (res: SalesModule[]) => {
        this.sales = res;
        this.groupSalesByDate();
        // Only create chart if in the browser
        if (isPlatformBrowser(this.platformId)) {
          this.createBarChart();
        }
      },
      error: error => {
        console.error(error);
      }
    });
  }

  groupSalesByDate() {
    const salesMap: { [date: string]: number } = {};

    this.sales.forEach(sale => {
      const date = new Date(sale.salesdate).toISOString().split('T')[0];
      if (salesMap[date]) {
        salesMap[date] += sale.totalprice;
      } else {
        salesMap[date] = sale.totalprice;
      }
    });

    this.groupedSales = Object.entries(salesMap).map(([salesdate, totalprice]) => ({
      salesdate,
      totalprice
    }));
  }

  createBarChart() {
    const salesDates = this.groupedSales.map(group => group.salesdate);
    const totalPrices = this.groupedSales.map(group => group.totalprice);

    new Chart(this.salesChart.nativeElement, {
      type: 'bar',
      data: {
        labels: salesDates,
        datasets: [{
          label: 'Total Sales',
          data: totalPrices,
          backgroundColor: this.barColors.slice(0, salesDates.length),
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}