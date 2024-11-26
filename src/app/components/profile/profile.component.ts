import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../services/companies.service'; // Asegúrate de tener este servicio creado

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'], // Corregido: styleUrls en plural
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  user_type: string = '';
  user_size_company: string = '';
  user_sector: string = '';
  user_book: string = '';
  companyProfile: any = null;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private companiesService: CompanyService // Inyectar servicio de compañías
  ) {}

  ngOnInit(): void {
    // Recuperar el usuario almacenado en localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const companyId = this.route.snapshot.paramMap.get('id');

    // Cargar datos del usuario si existe
    if (storedUser.email) {
      this.userService.getCompanyProfile(storedUser.email).subscribe({
        next: (userData: User | null) => {
          this.user = userData;

          // Configurar los detalles del usuario
          this.setTypeUser(this.user);
          this.setSizeCompany(this.user);
          this.setSector(this.user);
          this.setBook(this.user);
        },
        error: () => {
          alert('Error al cargar los datos del usuario');
        },
      });
    } else {
      alert('No se encontró un usuario en el localStorage');
    }

    // Cargar perfil de la compañía si hay un ID válido
    if (companyId) {
      this.companiesService.getCompanyProfile(+companyId).subscribe({
        next: (data) => {
          this.companyProfile = data;
          this.errorMessage = null;
        },
        error: () => {
          this.errorMessage = 'No se pudo cargar el perfil de la compañía.';
        },
      });
    }
  }

  setTypeUser(user: User | null): void {
    if (user?.typeUser) {
      switch (user.typeUser) {
        case 1:
        case '1':
          this.user_type = 'Natural';
          break;
        case 2:
        case '2':
          this.user_type = 'Jurídica';
          break;
      }
    }
  }

  setSizeCompany(user: User | null): void {
    if (user?.sizeCompany) {
      switch (user.sizeCompany) {
        case 1:
        case '1':
          this.user_size_company = 'Micro';
          break;
        case 2:
        case '2':
          this.user_size_company = 'Pequeña';
          break;
        case 3:
        case '3':
          this.user_size_company = 'Mediana';
          break;
        case 4:
        case '4':
          this.user_size_company = 'Grande';
          break;
      }
    }
  }

  setSector(user: User | null): void {
    if (user?.sector) {
      switch (user.sector) {
        case 1:
        case '1':
          this.user_sector = 'Agrícola';
          break;
        case 2:
        case '2':
          this.user_sector = 'Industrial';
          break;
        case 3:
        case '3':
          this.user_sector = 'Servicios';
          break;
        case 4:
        case '4':
          this.user_sector = 'Construcción';
          break;
      }
    }
  }

  setBook(user: User | null): void {
    if (user?.isBookDonwloaded != null) {
      this.user_book = user.isBookDonwloaded ? 'Sí' : 'No';
    }
  }

  goHome(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
