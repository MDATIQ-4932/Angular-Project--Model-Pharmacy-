import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, map, Observable } from "rxjs";
import { UserModule } from "../module/user/user.module";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";
import { AuthResponse } from "../guard/authresponse";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8085/api';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private userRoleSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public userRole$: Observable<string | null> = this.userRoleSubject.asObservable();

  private currentUserSubject: BehaviorSubject<UserModule | null> = new BehaviorSubject<UserModule | null>(null);
  public currentUser$: Observable<UserModule | null> = this.currentUserSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize user role from localStorage (browser only)
    if (this.isBrowser()) {
      const storedRole = localStorage.getItem('userRole');
      this.userRoleSubject.next(storedRole);
    }
  }

  // 🔒 Check if platform is browser
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // 🔧 LocalStorage helpers
  private setItem(key: string, value: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, value);
    }
  }

  private getItem(key: string): string | null {
    return this.isBrowser() ? localStorage.getItem(key) : null;
  }

  private removeItem(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }

  // ✅ LOGIN
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, { email, password }, { headers: this.headers })
      .pipe(
        map((response: AuthResponse) => {
          if (this.isBrowser() && response.token) {
            this.setItem('authToken', response.token);
            const decodedToken = this.decodeToken(response.token);

            this.setItem('userRole', decodedToken.role);
            this.userRoleSubject.next(decodedToken.role);

            this.currentUserSubject.next(decodedToken.user); // decodedToken.user must match User shape
            this.setItem('userProfile', JSON.stringify(decodedToken.user)); // optional
          }
          return response;
        })
      );
  }

  // ✅ REGISTER
  register(user: {
    name: string;
    email: string;
    password: string;
    cell: string;
    address: string;
    dob: Date;
    gender: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, user, { headers: this.headers }).pipe(
      map((response: AuthResponse) => {
        if (this.isBrowser() && response.token) {
          this.setItem('authToken', response.token);
        }
        return response;
      })
    );
  }

  // ✅ GET TOKEN
  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('authToken') : null;
  }

  // ✅ DECODE TOKEN
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Token decoding failed:', e);
      return null;
    }
  }

  // ✅ GET USER ROLE
  getUserRole(): string | null {
    return this.getItem('userRole');
  }

  // ✅ ROLE CHECKERS
  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isAdminOrPharmacist(): boolean {
    const role = this.getUserRole();
    return role === 'ADMIN' || role === 'PHARMACIST';
  }

  isPharmacist(): boolean {
    return this.getUserRole() === 'PHARMACIST';
  }

  isUser(): boolean {
    return this.getUserRole() === 'USER';
  }

  // ✅ TOKEN EXPIRY CHECK
  isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken || !decodedToken.exp) return true;
    const expiry = decodedToken.exp * 1000; // to milliseconds
    return Date.now() > expiry;
  }

  // ✅ GET USER FROM STORAGE
  getUserProfileFromStorage(): UserModule | null {
    const userProfileJson = this.getItem('userProfile');
    return userProfileJson ? JSON.parse(userProfileJson) : null;
  }

  // ✅ CHECK LOGGED IN
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      return true;
    }
    this.logout(); // auto logout if expired
    return false;
  }

  // ✅ LOGOUT
  logout(): void {
    if (this.isBrowser()) {
      this.removeItem('authToken');
      this.removeItem('userRole');
      this.removeItem('userProfile');
    }
    this.userRoleSubject.next(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ✅ HAS ROLE
  hasRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }


}