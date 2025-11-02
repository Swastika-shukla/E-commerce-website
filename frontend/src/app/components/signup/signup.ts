import { AfterViewInit, Component } from '@angular/core';
import { User } from '../../../Models/User';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-signup',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'] // ✅ corrected from styleUrl to styleUrls
})
export class Signup implements AfterViewInit {
  signupForm: FormGroup;
  signupSuccess: boolean = false;
  signupFailed: boolean = false;
  errorMessage: string = '';

  constructor(private loginservice: LoginService) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        // Validators.minLength(6),
        Validators.pattern(/.*\d.*/) // Must contain at least one number
      ]),
      confirmPassword: new FormControl('', Validators.required),
      termsAccepted: new FormControl(false, Validators.requiredTrue)
    });
  }

  signupmodal(): void {
    const modal = document.getElementById('signupModal');
    if (modal) {
      const bsModal = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
      bsModal.hide();
    }
  }

  onSubmit(): void {
    this.errorMessage= '';
    if (!this.signupForm.valid) {
      this.signupFailed = true;
      this.signupSuccess = false;
      console.log("Form is invalid. Please fill all required fields correctly.");
      return;
    }

    const formValues = this.signupForm.value;

    if (formValues.password !== formValues.confirmPassword) {
      this.signupFailed = true;
      this.signupSuccess = false;
      this.errorMessage = "Passwords do not match."; 
      return;
    }

    const newUser: User = {
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      
    };

    this.loginservice.registerUser(newUser).subscribe({
      next: (response) => {
        console.log('User successfully registered:', response);
        this.signupSuccess = true;
        this.signupFailed = false;
        this.errorMessage = '';
        
        // Auto-login after successful signup
        if (response.token && response.user) {
          this.loginservice.setLoginStatus(
            true, 
            response.user.id, 
            response.user.name, 
            response.user.email, 
            response.token
          );
        }

        // Close the modal after 2 seconds
        setTimeout(() => {
          this.signupmodal();
        }, 1000);
      },
      error: (err) => {
        console.error('Signup failed:', err);
        this.signupSuccess = false;
        this.signupFailed = true;
        
        // Show specific error message
        if (err.error && err.error.errors) {
          this.errorMessage = err.error.errors.map((e: any) => e.message).join(', ');
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Signup failed. Please try again.';
        }
        console.log('Error message:', this.errorMessage);
      }
    });
  }
  ngAfterViewInit(): void {
    const modalElement = document.getElementById('signupModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.resetForm();
      });
    }
  }

  resetForm(): void {
    this.signupForm.reset();
    this.signupSuccess = false;
    this.signupFailed = false;
    this.errorMessage = '';

    }
    }
