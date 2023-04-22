import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import * as lottie from 'lottie-web';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-load-screen',
  templateUrl: './load-screen.component.html',
  styleUrls: ['./load-screen.component.css'],
  animations: [
    trigger('showHided', [
      state('show', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('hide', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      transition('show => hide', animate('700ms ease-in-out')),
      transition('hide => show', animate('700ms 700ms ease-in-out')),

    ])
  ]
})
export class LoadScreenComponent implements AfterViewInit{
  @ViewChild('lottieContainer') public lottieContainer: ElementRef;
    isLongLoad: boolean = false;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    }


  ngAfterViewInit(): void {

    setTimeout(()=> {
      this.isLongLoad = true
    }, 4000)


    // @ts-ignore
    const animation = lottie.loadAnimation({
      container: this.lottieContainer.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/images/website/loading.json' // path to your JSON animation file
    });
  }

}
