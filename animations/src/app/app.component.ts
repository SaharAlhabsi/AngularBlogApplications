import { Component } from '@angular/core';
// anamations into component 
import { trigger, state, style, transition, animate } from '@angular/animations'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // add animations array here
  animations: [
    trigger('homeAnim', [
      // states to switch between
      state('small', style({
        transform: 'scale(1)',
        backgroundColor: 'blue',
      })),
      state('large', style({
        transform: 'scale(1.2)',
      })),
      // Direction, animate with druation and easing type
      transition('small <=> large', animate('300ms ease-in')),
    ]),
    trigger('otherButton', [
      state('small', style([{
        transform: 'scale(1)',
      }])),
      state('large', style([{
        transform: 'scale3d(2.5, 1.2, 0.3)',
        backgroundColor: '#00FF00', 
      }])),
      transition('small <=> large', animate('500ms ease-in')),
    ]),
    trigger('buttonAnim', [
      state('small', style([{
        transform: 'scale(1)',
      }])),
      state('large', style([{
        transform: 'rotateY(150deg)',
        backgroundColor: '#00FF00', 
      }])),
      transition('small <=> large', animate('500ms ease-in')),
    ])
  ]
})
export class AppComponent {
  public title = 'Hover Over Me';
  public otherTitle = 'Make Your...'
  // change attribute value of animation
  public state: string = 'small'; 
  public otherState: string = 'small'; 
  public clickCount: number = 0; 
  public buttonstate: string = 'small';

  stateAnim() {
    // ternary operator to
    // toggle between states
    this.state = (this.state === 'small' ? 'large' : 'small');
  }

  otherAnim() {
    this.otherState = (this.otherState === 'small' ? 'large' : 'small');
    if (this.otherState === 'small') {
      this.otherTitle = 'Make Your...'; 
    } else {
      this.otherTitle = '...Money Strech!';
    }
  }

  buttonAnim() {
    this.buttonstate = (this.buttonstate === 'small' ? 'large' : 'small');
  }

  processData() {
    this.clickCount++; 
    this.title = 'You have clicked me '
  }
}
