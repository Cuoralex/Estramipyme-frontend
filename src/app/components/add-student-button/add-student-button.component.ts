import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-student-button',
  standalone: true,  // Esto indica que el componente es independiente
  imports: [CommonModule, ReactiveFormsModule],  // Importa CommonModule y ReactiveFormsModule aquí
  templateUrl: './add-student-button.component.html',
  styleUrls: ['./add-student-button.component.scss'],
})
export class AddStudentButtonComponent implements OnInit {
  showForm = false;  // Controla la visibilidad del formulario
  studentForm: FormGroup;  // Formulario reactivo para agregar estudiantes
  showErrorModal = false;  // Modal de error
  showSuccessModal = false;  // Modal de éxito
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Inicializa el formulario reactivo con los nuevos campos
    this.studentForm = this.fb.group({
      companyId: [null, Validators.required],  // 'null' en vez de '1'
      teacherId: [null, Validators.required],  // 'null' en vez de '1'
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],  // Validación de teléfono
    });
  }

  ngOnInit(): void {}

  // Función para crear un estudiante
  createStudent() {
    if (this.studentForm.valid) {
      const { companyId, teacherId, name, email, password, address, phone } = this.studentForm.value;

      // Realiza la solicitud HTTP para crear el estudiante
      this.http.post('http://localhost:8080/students', { companyId, teacherId, name, email, password, address, phone }).subscribe(
        (response) => {
          console.log('Estudiante creado exitosamente:', response);
          this.showSuccessModal = true;
          this.showForm = false;  // Oculta el formulario
          this.studentForm.reset();  // Resetea el formulario
        },
        (err) => {
          console.error('Error al crear estudiante:', err);
          this.showErrorModal = true;
          this.errorMessage = 'Hubo un error al crear el estudiante.';
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
