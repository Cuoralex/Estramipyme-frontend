import { Component, OnInit, signal, inject } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { DashboardService } from '../../services/dashboard.service';
import { User } from '../../models/user';
import { AddStudentButtonComponent } from "../../components/add-student-button/add-student-button.component";
import { AddTeacherButtonComponent } from "../../components/add-teacher-button/add-teacher-button.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss'],
  imports: [AddStudentButtonComponent, AddTeacherButtonComponent, NavbarComponent],
})
export class DashboardAdminComponent implements OnInit {
  pieChart: Chart | undefined;
  radarChart: Chart | undefined;
  pieChartType: Chart | undefined;
  barChartTotal: Chart | undefined;
  users = signal<User[]>([]);
  year = signal<string>('2024-');
  groupedUsersBySize: any;
  groupedUsersBySector: any;
  groupedUsersByType: any;
  totalCompanies: number = 0;

  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.getGroupedUsersBySize();
    this.getGroupedUsersBySector();
    this.getGroupedUsersByType();
    this.getTotalCompanies();
  }

  handleYearChange(event: Event) {
    this.year.set((event.target as HTMLInputElement).value);
    this.getGroupedUsersBySize();
  }

  // Obtener empresas por tamaño
  getGroupedUsersBySize() {
    this.dashboardService.getUsers().subscribe((users) => {
      const small = users.filter((user) => user.sizeCompany === 'Pequeña').length;
      const medium = users.filter((user) => user.sizeCompany === 'Mediana').length;
      const large = users.filter((user) => user.sizeCompany === 'Grande').length;

      this.groupedUsersBySize = [small, medium, large];
      this.initializePieChartSize();
    });
  }

  // Obtener empresas por sector
  getGroupedUsersBySector() {
    this.dashboardService.getUsers().subscribe((users) => {
      const primary = users.filter((user) => user.sector === 'Agrícola').length;
      const secondary = users.filter((user) => user.sector === 'Industrial').length;
      const tertiary = users.filter((user) => user.sector === 'Servicios').length;
      const quaternary = users.filter((user) => user.sector === 'Construcción').length;

      this.groupedUsersBySector = [primary, secondary, tertiary, quaternary];
      this.initializeRadarChart();
    });
  }

  // Obtener empresas por tipo de persona (Natural o Jurídica)
  getGroupedUsersByType() {
    this.dashboardService.getUsers().subscribe((users) => {
      const natural = users.filter((user) => user.typeUser === 'Natural').length;
      const juridica = users.filter((user) => user.typeUser === 'Jurídica').length;

      this.groupedUsersByType = [natural, juridica];
      this.initializePieChartType();
    });
  }

  // Obtener el total de empresas
  getTotalCompanies() {
    this.dashboardService.getUsers().subscribe((users) => {
      this.totalCompanies = users.length;
      this.initializeBarChartTotal();
    });
  }

  // Inicializar gráfico de Pastel para tamaño de empresas
  initializePieChartSize() {
    const ctx = document.getElementById('pieChartSize') as HTMLCanvasElement;
    this.pieChart = new Chart(ctx, {
      type: 'pie' as ChartType,
      data: {
        labels: ['Pequeña', 'Mediana', 'Grande'],
        datasets: [{
          label: 'Empresas registradas por tamaño',
          data: this.groupedUsersBySize,
          backgroundColor: ['rgb(255, 99, 132, 0.9)', 'rgb(54, 162, 235, 0.9)', 'rgb(255, 205, 86, 0.9)'],
          hoverOffset: 3,
        }],
      },
    });
  }

  // Inicializar gráfico de Radar para sector de empresas
  initializeRadarChart() {
    const ctx = document.getElementById('radarChart') as HTMLCanvasElement;
    this.radarChart = new Chart(ctx, {
      type: 'radar' as ChartType,
      data: {
        labels: ['Sector Agrícola', 'Sector Industrial', 'Sector Servicios', 'Sector Construcción'],
        datasets: [{
          label: 'Empresas registradas por sector',
          data: this.groupedUsersBySector,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 20,
            ticks: {
              stepSize: 5,
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }

  // Inicializar gráfico de Pastel para tipo de persona
  initializePieChartType() {
    const ctx = document.getElementById('pieChartType') as HTMLCanvasElement;
    this.pieChartType = new Chart(ctx, {
      type: 'pie' as ChartType,
      data: {
        labels: ['Natural', 'Jurídica'],
        datasets: [{
          label: 'Tipo de usuario registrado',
          data: this.groupedUsersByType,
          backgroundColor: ['rgb(153, 102, 255)', 'rgb(255, 159, 64)'],
          hoverOffset: 3,
        }],
      },
    });
  }
  initializeBarChartTotal() {
    const ctx = document.getElementById('barChartTotal') as HTMLCanvasElement;
    const maxScale = this.totalCompanies + 100; 
  
    this.barChartTotal = new Chart(ctx, {
      type: 'bar' as ChartType,
      data: {
        labels: ['Total de Empresas'],
        datasets: [{
          label: 'Número total de usuarios registrados',
          data: [this.totalCompanies],
          backgroundColor: 'rgb(75, 192, 192)',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,     
            ticks: {
              stepSize: 20,    
            },
          },
        },
        plugins: {
          legend: {
            display: false, 
          },
        },
      },
    });
  }
}
