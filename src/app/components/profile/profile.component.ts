import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  user: User|null=null;
  user_type:string=""
  user_size_company:string=""
  user_sector:string=""
  user_book:string=""
  authService: any;

  constructor(private router:Router, private userService:UserService){}

  ngOnInit(): void {
    // Recuperar el usuario almacenado en localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  
    // Verificar si existe un email en el usuario almacenado
    if (storedUser.email) {
      // Llamar al servicio para obtener los datos del perfil
      this.authService.getProfile(storedUser.email).subscribe({
        next: (userData: User | null) => {
          // Asignar los datos recuperados al usuario
          this.user = userData;
  
          // Configurar los detalles del usuario
          this.setTypeUser(this.user);
          this.setSizeCompany(this.user);
          this.setSector(this.user);
          this.setBook(this.user);
        },
        error: () => {
          // Mostrar alerta en caso de error al cargar los datos
          alert('Failed to load user data');
        },
      });
    } else {
      // Manejar el caso en el que no hay un usuario almacenado en localStorage
      alert('No user found in localStorage');
    }
  }
  

  setTypeUser(user:User|null):void{
    if(user?.typeUser){
      if(user.typeUser===1 || user.typeUser==="1"){
        this.user_type="Natural"
      }
      if(user.typeUser===2 || user.typeUser==="2"){
        this.user_type="Jurídica"
      }
    }
  }

  setSizeCompany(user:User|null):void{
    if(user?.sizeCompany){
      if(user.sizeCompany===1 || user.sizeCompany==="1"){
        this.user_size_company="Micro"
      }
      if(user.sizeCompany===2 || user.sizeCompany==="2"){
        this.user_size_company="Pequeña"
      }
      if(user.sizeCompany===3 || user.sizeCompany==="3"){
        this.user_size_company="Mediana"
      }
      if(user.sizeCompany===4 || user.sizeCompany==="4"){
        this.user_size_company="Grande"
      }
    }
  }

  setSector(user:User|null):void{
    if(user?.sector){
      if(user.sector===1 || user.sector==="1"){
        this.user_sector="Agrícola"
      }
      if(user.sector===2 || user.sector==="2"){
        this.user_sector="Industrial"
      }
      if(user.sector===3 || user.sector==="3"){
        this.user_sector="Servicios"
      }
      if(user.sector===4 || user.sector==="4"){
        this.user_sector="Construcción"
      }
    }
  }

  setBook(user:User|null):void{
    if(user?.isBookDonwloaded!=null){
      if(user.isBookDonwloaded===true){
        this.user_book="Sí"
      }
      if(user.isBookDonwloaded===false){
        this.user_book="No"
      }
  }
  }

  goHome(){
    this.router.navigateByUrl("/dashboard")
  }

}
