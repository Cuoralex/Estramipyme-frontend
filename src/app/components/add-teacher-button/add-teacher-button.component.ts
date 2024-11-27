import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-teacher-button',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-teacher-button.component.html',
  styleUrls: ['./add-teacher-button.component.scss'],
})
export class AddTeacherButtonComponent implements OnInit {
  showForm = false;
  teacherForm: FormGroup;
  showErrorModal = false;
  showSuccessModal = false;
  errorMessage = '';
  teacherName: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  // Función para crear un profesor
  createTeacher() {
    if (this.teacherForm.valid) {
      const { name, email, password } = this.teacherForm.value;

      // Realiza la solicitud HTTP para crear el profesor
      this.http.post('http://localhost:8080/teachers', { name, email, password }).subscribe(
        (response) => {
          console.log('Profesor creado exitosamente:', response);
          this.teacherName = name;
          this.showSuccessModal = true;
          this.showForm = false;
          this.teacherForm.reset();  // Resetea el formulario
        },
        (err) => {
          console.error('Error al crear profesor:', err);
          this.showErrorModal = true;
          this.errorMessage = 'Hubo un error al crear el profesor.';
        }
      );
    } else {
      this.showErrorModal = true;
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }

  // Cerrar modal de error
  closeErrorModal() {
    this.showErrorModal = false;
    this.errorMessage = '';
  }

  // Cerrar modal de éxito
  closeSuccessModal() {
    this.showSuccessModal = false;
  }
}
