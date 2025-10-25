import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import { Router } from "@angular/router";



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      cell: [''],
      address: [''],
      dob: [''],
      gender: [''],
      role: ['']  // <-- Add this line!
    }, { validators: this.passwordMatchValidator });

  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const { name, email, password, cell, address, dob, gender, role } = this.registerForm.value;

    const userPayload = {
      name,
      email,
      password,
      cell,
      address,
      dob,  // Convert dob to Date or null
      gender,
      role  // Include role here
    };

    this.authService.register(userPayload).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! You can now log in.';
        this.errorMessage = null;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.successMessage = null;
        this.errorMessage = 'Registration failed. Please try again.';
        console.error(error);
      }
    });
  }




}