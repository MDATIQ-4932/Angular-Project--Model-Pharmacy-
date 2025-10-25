import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CustomerModule } from "../module/customer/customer.module";
import { Injectable } from "@angular/core";



@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  baseUrl: string = "http://localhost:8085/api/customer/"


  constructor(private httpClient: HttpClient) { }

  getAllCustomer(): Observable<CustomerModule[]> {
    return this.httpClient.get<CustomerModule[]>(this.baseUrl);
  }

 

  createCustomer(customerData: any): Observable<any> {
    return this.httpClient.post(this.baseUrl+"save", customerData);
  }

  deleteCustomer(id: number): Observable<any> {

    return this.httpClient.delete(this.baseUrl+ "delete/"+ id);
  }

  updateCustomers(id: number, customer: CustomerModule): Observable<any> {
    return this.httpClient.put<any>(this.baseUrl + "update/" + id, customer); 
  }



  getById(id: number): Observable<any> {

    return this.httpClient.get(this.baseUrl + id);
  }


}