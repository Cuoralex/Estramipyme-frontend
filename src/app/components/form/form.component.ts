import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  user: any = {};

  riskCount: number = 0;
  opportunityCount: number = 0;
  risks: Array<{ id: number, text: string }> = [];
  opportunities: Array<{ id: number, text: string }> = [];
isNaturalPerson: any;

  // Asegúrate de inyectar Router aquí
  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.user = user;
  }

  redirectToRegister() {
    this.router.navigate(['/inicio'], { fragment: 'register' });
  }
  
  addRisk(): void {
    this.riskCount++;
    this.risks.push({ id: this.riskCount, text: `Riesgo ${this.riskCount}` });
  }

  addOpportunity(): void {
    this.opportunityCount++;
    this.opportunities.push({ id: this.opportunityCount, text: `Oportunidad ${this.opportunityCount}` });
  }

  removeRisk(id: number): void {
    this.risks = this.risks.filter(risk => risk.id !== id);
  }

  removeOpportunity(id: number): void {
    this.opportunities = this.opportunities.filter(opportunity => opportunity.id !== id);
  }
}
