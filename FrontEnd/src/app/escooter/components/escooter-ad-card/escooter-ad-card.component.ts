import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-escooter-ad-card',
  templateUrl: './escooter-ad-card.component.html',
  styleUrls: ['./escooter-ad-card.component.css']
})
export class EscooterAdCardComponent {
  @Input() escooterItem: any;
}
