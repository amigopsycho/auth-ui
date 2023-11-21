import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  isLoading: boolean = false; // Variable to control loading indicator visibility

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  login(): void {
    // Set loading to true during login request
    this.isLoading = true;

    // Perform login logic here
    const loginData = { username: this.username, password: this.password };

    this.http.post<any>('http://localhost:3000/login', loginData).subscribe(
      (response) => {
        // On successful login, navigate to the home page
        this.router.navigate(['/home']);

        // Store the token in a cookie
        this.cookieService.set('authToken', response.token);

        // Send login email
        this.sendLoginEmail();
      },
      (error) => {
        // Handle unsuccessful login
        console.error('Login failed', error);
      }
    ).add(() => {
      // Set loading to false after the request is complete (success or error)
      this.isLoading = false;
    });
  }

  private sendLoginEmail(): void {
    const emailData = {
      to: 'user-email@example.com', // Replace with the user's email
      subject: 'Login Attempt Notification',
      text: 'You have logged in successfully.',
    };



    // Send login email

    this.http.post<any>('http://localhost:3000/send-email', emailData).subscribe(
      (response) => {
        console.log('Login email sent:', response);
      },
      (error) => {
        console.error('Error sending login email', error);
      }
    );

  }


}
