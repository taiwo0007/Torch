import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-escooter-card',
  templateUrl: './escooter-card.component.html',
  styleUrls: ['./escooter-card.component.css']
})
export class EscooterCardComponent implements OnInit {
  @Input() escooterItem: any;

  constructor() { }

  ngOnInit(): void {
  }

}
