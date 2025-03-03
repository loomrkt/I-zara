import { Component } from '@angular/core';

@Component({
  selector: 'app-liste',
  imports: [
  ],
  templateUrl: './liste.component.html',
  styles: ``
})
export class ListeComponent {
  liste = [
    {
      id: 1,
      titre: 'item 1',
      fichier: 'https://via.placeholder.com/150',
      estimation:7
    },
    {
      id: 2,
      titre: 'item 2',
      fichier: 'https://via.placeholder.com/150',
      estimation:7
    }
  ]
}
