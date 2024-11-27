import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Test } from '../../models/test';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  currentStep = 1;
  totalSteps = 3;

  user: User | null = null;
  isFormSubmitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private testService: TestService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      section1: this.fb.group({
        field1: ['', Validators.required],
        field2: ['', Validators.required],
        field3: ['', Validators.required],
      }),
      section2: this.fb.group({
        field4: ['', Validators.required],
        field5: ['', Validators.required],
        field6: ['', Validators.required],
      }),
      section3: this.fb.group({
        field7: ['', Validators.required],
        field8: ['', Validators.required],
        field9: ['', Validators.required],
      }),
    });
    //Para referenciar a la empresa que está haciendo el test
    this.userService.currentUser.subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitForm() {
    if (this.form.valid) {
      console.log('Formulario válido, enviando test...');
      const testDetails: Test = {
        id_empresa: this.user!.id as string,
        pregunta1: this.form.get('section1.field1')!.value,
        pregunta2: this.form.get('section1.field2')!.value,
        pregunta3: this.form.get('section1.field3')!.value,
        pregunta4: this.form.get('section2.field4')!.value,
        pregunta5: this.form.get('section2.field5')!.value,
        pregunta6: this.form.get('section2.field6')!.value,
        pregunta7: this.form.get('section3.field7')!.value,
        pregunta8: this.form.get('section3.field8')!.value,
        pregunta9: this.form.get('section3.field9')!.value,
      };

      console.log('Datos del test:', testDetails);

      this.testService.registerTest(testDetails).subscribe({
        next: (response) => {
          console.log('Test registrado con éxito:', response);
          this.testService.updateisTestDone(this.user).subscribe({
            next: () => {
              console.log('Estado actualizado con éxito');
              this.isFormSubmitted = true;
              this.user!.isTestDone = true;
            },
            error: (error) => {
              console.error('Error actualizando estado:', error);
            },
          });
        },
        error: (error) => {
          console.error('Error registrando test:', error);
        },
      });
    } else {
      console.log('Formulario inválido:', this.form.errors);
    }
  }

  goHome() {
    this.router.navigateByUrl('/dashboard');
  }
}
