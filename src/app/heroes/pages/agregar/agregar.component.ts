import { Component, OnInit } from '@angular/core';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img {
      width: 100%;
      border-radius: 5px;
    }
  `
  ]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  heroe: Heroe = {
    superhero: '',
    publisher: Publisher.DCComics,
    alter_ego: '',
    first_appearance: '',
    characters: '',
    alt_img: ''
  }
  constructor(private heroesService: HeroesService,
              private activateRoute: ActivatedRoute,
              private route: Router) { }

  ngOnInit(): void {

    if(!this.route.url.includes('editar')) {
      return;
    }
      
    this.activateRoute.params
      .pipe(
        switchMap( ({id}) => this.heroesService.getHeroePorId(id))
      )
      .subscribe(heroe => this.heroe = heroe
      );
  }

  guardar() {
    if(this.heroe.superhero.trim().length === 0) {
      return;
    }

    if(this.heroe.id) {
      this.heroesService.actualizarHeroe(this.heroe)
        .subscribe(heroe => console.log('Actualizando', heroe)
        )
    } else {
      this.heroesService.agregarHeroe(this.heroe)
        .subscribe(heroe => {
          this.route.navigate(['/heroes/editar', heroe.id]);
      })
    }
  }

  borrar() {
    this.heroesService.borrarHeroe(this.heroe.id!)
      .subscribe( resp => {
        this.route.navigate(['/heroes']);
      })
  }

}
