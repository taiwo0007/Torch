import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import * as lottie from 'lottie-web';

@Component({
  selector: 'app-load-screen',
  templateUrl: './load-screen.component.html',
  styleUrls: ['./load-screen.component.css']
})
export class LoadScreenComponent implements AfterViewInit{
  @ViewChild('lottieContainer') private lottieContainer: ElementRef;


  ngAfterViewInit(): void {
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
