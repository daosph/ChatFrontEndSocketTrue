import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Rol } from '../../models/rol'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatInputModule, MatSelectModule, MatFormFieldModule,CommonModule,ReactiveFormsModule],
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
})
export class UserModalComponent implements OnInit {
  datos: Rol[] = []; 

  formPerson = new FormGroup({
    usuario: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    rol_id: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    private chatService: ChatService 
  ) {}

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles(): void {
    this.chatService.getRoles().subscribe({
      next: (roles: Rol[]) => {
        console.log('Roles obtenidos:', roles); 
        this.datos = roles; 
      },
      error: (err) => {
        console.error('Error al obtener los roles:', err);
      }
    });
  }

 
}
