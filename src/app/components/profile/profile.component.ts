import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User | null = null; // Objeto completo del usuario
  user_type: string = ''; // Tipo de usuario (Jurídica/Natural)
  user_size_company: string = ''; // Tamaño de la empresa
  user_sector: string = ''; // Sector de la empresa

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    // Suscribirse al observable del usuario actual
    this.userService.currentUser.subscribe({
      next: (user) => {
        if (user) {
          this.user = user; // Asignar todo el objeto del usuario
          this.user_type = this.toString(user.typeUser);
          this.user_size_company = this.toString(user.sizeCompany);
          this.user_sector = this.toString(user.sector);
        }
      },
      error: (err) => {
        console.error('Error al obtener el usuario:', err);
      }
    });
  }

  /**
   * Convierte un valor mixto a cadena, manejando nulos y números.
   */
  private toString(value: string | number | null | undefined): string {
    if (value === null || value === undefined) {
      return 'No especificado';
    }
    return value.toString();
  }

  goHome(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
