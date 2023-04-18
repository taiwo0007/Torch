import {Component, Input} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.css'],
  animations: [
      trigger('showHided', [
          state('show', style({
            opacity: 1,
            transform: 'translateY(0) !important'
          })),
        state('hide', style({
          opacity: 0,
          transform: 'translateY(-20px) !important'
        })),
          transition('show => hide', animate('200ms ease-out')),
          transition('hide => show', animate('200ms ease-in')),

      ])
  ]
})
export class AlertMessageComponent {

  @Input() message:String;
  @Input() isError:boolean;
  @Input() isNotice:boolean;
  @Input() isSuccess:boolean;
  @Input() isAlert:boolean;
  @Input() boldText: any;



}
