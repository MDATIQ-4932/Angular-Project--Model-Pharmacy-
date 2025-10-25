import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";



@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'] // Fixed typo: changed 'styleUrl' to 'styleUrls'
})
export class InvoiceComponent implements OnInit {
  sale: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const saleData = params['sale'];
      if (saleData) {
        this.sale = JSON.parse(saleData);
        console.log('Sale data:', this.sale);
      } else {
        console.error('No sale data found');
      }
    });
  }
}