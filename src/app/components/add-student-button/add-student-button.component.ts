import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-student-button',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-student-button.component.html',
  styleUrls: ['./add-student-button.component.scss']
})
export class AddStudentButtonComponent implements OnInit {
  showForm = false;
  studentForm: FormGroup;
  assignForm: FormGroup;
  studentFound = false;
  studentId: number | null = null;
  studentName: string | null = null;
  studentEmail: string | null = null;
  showErrorModal = false;
  showSuccessModal = false;
  errorMessage = '';
  showAssignSection = false;
  assignedProfessor: string | null = null;
  assignedCompany: string | null = null;
  professors: any[] = [];
  companies: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.studentForm = this.fb.group({
      id: [''],
      email: ['', Validators.email]
    });

    this.assignForm = this.fb.group({
      professor: ['', Validators.required],
      company: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Cargar profesores y compañías al iniciar el componente
    this.loadProfessors();
    this.loadCompanies();
  }

  // Obtener la lista de profesores
  loadProfessors() {
    this.http.get<any[]>('http://localhost:8080/teachers').subscribe(
      (data) => {
        this.professors = data;
      },
      (err) => {
        console.error('Error al cargar profesores', err);
      }
    );
  }

  // Obtener la lista de compañías
  loadCompanies() {
    this.http.get<any[]>('http://localhost:8080/companies').subscribe(
      (data) => {
        this.companies = data;
      },
      (err) => {
        console.error('Error al cargar compañías', err);
      }
    );
  }

  // Buscar estudiante por ID o email
  searchStudent() {
    const id = this.studentForm.get('id')?.value;
    const email = this.studentForm.get('email')?.value;

    if (!id && !email) {
      this.showErrorModal = true;
      this.errorMessage = 'Debe ingresar un ID o un correo de estudiante.';
      return;
    }

    const searchCriteria = id ? `id=${id}` : `email=${email}`;

    this.http.get<any[]>(`http://localhost:8080/students?${searchCriteria}`).subscribe(
      (students) => {
        if (students.length === 0) {
          this.showErrorModal = true;
          this.errorMessage = 'No existe el estudiante.';
          this.studentFound = false;
          this.studentId = null;
          this.studentName = null;
          this.studentEmail = null;
          this.showAssignSection = false;
        } else {
          const student = students[0];
          this.studentFound = true;
          this.studentId = student.id;
          this.studentName = student.name;
          this.studentEmail = student.email;
          this.showAssignSection = true;
        }
      },
      (err) => {
        this.showErrorModal = true;
        this.errorMessage = 'Error al buscar el estudiante.';
        console.error(err);
      }
    );
  }

  // Asignar estudiante a profesor y compañía
  assignToProfessorAndCompany() {
    if (this.assignForm.valid && this.studentId !== null) {
      const { professor, company } = this.assignForm.value;

      // Verificar los datos antes de enviar
      console.log('Asignando estudiante:', this.studentId);
      console.log('Profesor:', professor);
      console.log('Compañía:', company);

      // Realizar la solicitud para asignar el estudiante usando PUT en lugar de PATCH
      this.http.put(`http://localhost:8080/students/${this.studentId}`, { professor, company }).subscribe(
        (response) => {
          console.log('Asignación exitosa:', response);
          this.showSuccessModal = true;
          this.assignedProfessor = professor;
          this.assignedCompany = company;
          this.showAssignSection = false;
          this.studentForm.reset();
          this.assignForm.reset();
        },
        (err) => {
          this.showErrorModal = true;
          this.errorMessage = 'Error al asignar al estudiante.';
          console.error('Error al asignar:', err);
        }
      );
    }
  }

  closeErrorModal() {
    this.showErrorModal = false;
    this.errorMessage = '';
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
}
