import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/.+@.+\..+/)]),
    password: new FormControl('', Validators.required)
  });

  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router, private userService: UserService) {}

  /**
   * Método llamado al enviar el formulario de inicio de sesión.
   */
  onSubmit() {
    this.login();
  }

  /**
   * Lógica para iniciar sesión.
   */
  login() {
    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');

    if (this.loginForm.valid) {
      const email = emailControl?.value ?? '';
      const password = passwordControl?.value ?? '';

      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response && response.token) {
            this.handleSuccessfulLogin(response.user, response.token, "/dashboard");
          } else {
            this.showMessage('Correo y/o contraseña incorrectos. Por favor, intenta nuevamente.', 'error');
            this.setInvalidClass(emailControl, passwordControl);
          }
        },
        error: (error) => {
          console.error('Error al intentar iniciar sesión:', error);
          this.showMessage('Ocurrió un error al intentar iniciar sesión. Por favor, intenta nuevamente.', 'error');
          this.setInvalidClass(emailControl, passwordControl);
        }
      });
    } else {
      this.handleInvalidForm(emailControl, passwordControl);
    }
  }

  /**
   * Lógica para manejar un inicio de sesión exitoso.
   * @param user Usuario autenticado.
   * @param token Token de autenticación.
   * @param redirectTo Ruta a redirigir después del inicio de sesión.
   */
  handleSuccessfulLogin(user: any, token: string, redirectTo: string) {
    console.log('Inicio de sesión exitoso:', user);
    localStorage.setItem('token', token); // Guardar el token en el almacenamiento local
    this.authService.isLoggedIn = true;
    this.userService.login(user, token); // Informar al servicio de usuario sobre el inicio de sesión
    this.router.navigateByUrl(redirectTo); // Redirigir al usuario
  }

  /**
   * Manejo del formulario inválido.
   */
  handleInvalidForm(emailControl: AbstractControl<string | null> | null, passwordControl: AbstractControl<string | null> | null) {
    this.showMessage('Formulario inválido. Por favor, revisa los campos.', 'error');
    this.setInvalidClass(emailControl, passwordControl);
  }

  /**
   * Marcar controles inválidos como tocados para mostrar mensajes de error.
   */
  setInvalidClass(emailControl: AbstractControl<string | null> | null, passwordControl: AbstractControl<string | null> | null) {
    if (emailControl?.invalid) {
      emailControl.markAsTouched();
    }

    if (passwordControl?.invalid) {
      passwordControl.markAsTouched();
    }
  }

  /**
   * Mostrar un mensaje en la interfaz.
   */
  showMessage(message: string, type: 'success' | 'error') {
    const messageDiv = document.getElementById(type === 'success' ? 'message' : 'error-message');
    if (messageDiv) {
      messageDiv.textContent = message;
      messageDiv.style.display = 'block';
      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 5000);
    }
  }

  /**
   * Verificar si la ruta actual es la de registro.
   */
  isRegisterRoute(): boolean {
    return this.router.url === "/register";
  }

  /**
   * Redirigir a la página de registro.
   */
  registrarse() {
    this.router.navigateByUrl("/register");
  }
}
