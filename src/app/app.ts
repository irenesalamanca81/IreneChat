import { Component } from '@angular/core';
import { ChatComponent } from './components/chat/chat';

@Component({
  selector: 'app-root',
  standalone: true,
  // 🔽 CAMBIA ESTO: Quita RouterOutlet e incluye ChatComponent
  imports: [ChatComponent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'IreneChat';
}