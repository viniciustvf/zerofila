import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public empresaNome: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    const empresaData = sessionStorage.getItem('empresa');

    if (empresaData) {
      try {
        const empresa = JSON.parse(empresaData); 
        this.empresaNome = empresa.name;
      } catch (error) {
        console.error('Erro ao recuperar os dados da empresa:', error);
      }
    }
  }

  abrirFilas(): void {
    this.router.navigate(['/company-queue-list']);
  }

  abrirEmpresa(): void {
    this.router.navigate(['/company-perfil-form']);
  }
}