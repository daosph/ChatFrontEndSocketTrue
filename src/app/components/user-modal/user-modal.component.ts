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
import { formulario } from '../../models/formulario';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';  // Importar MatSnackBar

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatInputModule, MatSelectModule, MatFormFieldModule, CommonModule, ReactiveFormsModule],
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
})
export class UserModalComponent implements OnInit {
  datos: Rol[] = []; 
  formulario: formulario = { 
    user: '',
    password: '',
    name: '',
    lastName: '',
    telephone: '',
    rol: 0 
  };
   
  formPerson = new FormGroup({
    user: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    telephone: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    rol_id: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    private chatService: ChatService,
    private snackBar: MatSnackBar  // Inyectar MatSnackBar
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

  enviarFormulario() {
    console.log('Formulario antes de enviar:', this.formPerson.value); // ✅ Verifica los valores
    
    if (this.formPerson.valid) {
      this.formulario = {
        user: this.formPerson.value.user ?? '',
        password: this.formPerson.value.password ?? '',
        name: this.formPerson.value.name ?? '',
        lastName: this.formPerson.value.lastName ?? '',
        telephone: this.formPerson.value.telephone ?? '',
        rol: this.formPerson.value.rol_id !== null && this.formPerson.value.rol_id !== undefined 
            ? +this.formPerson.value.rol_id 
            : 0
      };
    
      this.chatService.postFormulario(this.formulario).subscribe({
        next: (respuesta) => {
          console.log('✅ Respuesta del servidor:', respuesta);
          // Verifica la respuesta
          const mensaje = respuesta === 'Usuario registrado exitosamente' 
            ? 'Registro exitoso' 
            : 'Error al registrar el usuario';
    
          this.snackBar.open(mensaje, 'Cerrar', {
            duration: 3000,
            panelClass: respuesta === 'Usuario registrado exitosamente' ? ['snack-success'] : ['snack-error'],
          });
          
          // If the registration is successful, close the dialog
          if (respuesta === 'Usuario registrado exitosamente') {
            this.dialogRef.close(); // Close the modal
          }
        },
        error: (err) => {
          console.error('❌ Error en el registro:', err);
          this.snackBar.open('Error al registrar el usuario', 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-error'],
          });
        }
      });
    } else {
      console.error('❌ El formulario no es válido:', this.formPerson.errors);
    }
  }
  }
  

