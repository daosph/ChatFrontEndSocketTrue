import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/loginService/AuthService.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserResponse } from '../../../models/UserResponse ';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserModalComponent } from '../../user-modal/user-modal.component';

@Component({
  selector: 'app-login-to-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatDialogModule],
  templateUrl: './login-to-chat.component.html',
  styleUrls: ['./login-to-chat.component.css']
})
export class LoginToChatComponent {

  formUser = new FormGroup({
    user: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    
  });

  get user(){
    return this.formUser.get('user')
  }

  get password(){
    return this.formUser.get('password')
  }

  constructor(private authService: AuthService, private router: Router , private dialog: MatDialog) {}

  onSubmit(): void {
    if (this.formUser.valid) {
      const { user, password } = this.formUser.value;

      this.authService.login(user!, password!).subscribe({
        next: (response: UserResponse) => {
          console.log('Login successful:', response);
          this.router.navigate([`chat/${response.userId}/${response.role}`]);
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
    } else {
      console.error('Formulario inválido');
    }
  }

createUser():void{
  this.dialog.open(UserModalComponent, {
    width: '600px', 
    
  });
}

}

