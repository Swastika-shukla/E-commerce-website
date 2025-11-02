import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login';
declare var bootstrap: any;

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] // ✅ corrected from styleUrl to styleUrls
})
export class Login implements AfterViewInit{
  loginForm: FormGroup;
  loginSuccess: boolean = false;
  loginFailed: boolean = false;
  errorMessage: string = '';

  constructor(private loginservice: LoginService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }
  loginmodal(): void {
    const modal = document.getElementById('loginModal');
    if (modal) {
      const bsModal = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
      bsModal.hide();
      this.loginForm.reset();
      this.loginSuccess = false;
      this.loginFailed = false;
      this.errorMessage = '';
    }
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      console.log("Form is invalid. Please fill in all required fields.");
      this.loginSuccess = false;
      this.loginFailed = true;
      return;
    }

    const { email, password } = this.loginForm.value;
    console.log("Attempting login with:", email);

    this.loginservice.loginUser(email, password).subscribe({
      next: (response) => {
        console.log("Login successful:", response);
        this.loginSuccess = true;
        this.loginFailed = false;
        

        // Handle new API response format
        const userId = response.user?.id || response.userId;
        const userName = response.user?.name || response.name;
        const userEmail = response.user?.email || email;
        const token = response.token;

        this.loginservice.setLoginStatus(
          true,
          userId,
          userName,
          userEmail,
          token
        );
        
        console.log('User logged in:', { userId, userName, userEmail });

        // Close the modal after 2 seconds
        setTimeout(() => {
          this.loginmodal();
        }, 1000);
      },
      error: (err) => {
  console.error("Login failed:", err);
  this.loginSuccess = false;
  this.loginFailed = true;

  // Handle different error formats
  if (err.error) {
    if (err.error.message) {
      this.errorMessage = err.error.message;
    } else if (typeof err.error === 'string') {
      this.errorMessage = err.error;
    } else if (err.error.error) {
      this.errorMessage = err.error.error;
    } else {
      this.errorMessage = 'Unexpected error occurred.';
    }
  } else if (err.message) {
    this.errorMessage = err.message;
  } else {
    this.errorMessage = 'Login failed. Please try again.';
  }

  console.log('Error message:', this.errorMessage);
}
    });
  }
  ngAfterViewInit(): void {
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.resetForm();
      });
    }
  }

  resetForm(): void {
    this.loginForm.reset();
    this.loginSuccess = false;
    this.loginFailed = false;
    this.errorMessage = '';

    }
}
