import { ChatService } from "../../services/chat";
import { CommonModule } from '@angular/common';
import { Component } from "@angular/core";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,    // 👈 ¡ESTA LÍNEA ES LA QUE TE PIDE EL ERROR!
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent {
  userMessage: string = "";
  messages: any[] = [];
  isLoading: boolean = false;
  isLoggedIn: boolean = false;
  accessCode: string = "";
  showAnalysis: boolean = false;
  analysisText: string = "";
  recruiterEmail: string = "";

  constructor(private chatService: ChatService) {}

  doLogin() {
    this.chatService.login(this.accessCode).subscribe({
      next: () => this.isLoggedIn = true,
      error: () => alert("Código incorrecto")
    });
  }

  send() {
    const text = this.userMessage.trim();
    if (!text || this.isLoading) return;

    // Extraer solo las preguntas del usuario para el historial
    const history = this.messages
      .filter(m => m.sender === 'user')
      .map(m => m.text);

    this.messages.push({ sender: 'user', text });
    this.isLoading = true;
    this.userMessage = "";

    this.chatService.sendMessage(text, history).subscribe({
      next: (res: { response: string; }) => {
        // Reemplazamos \n por <br> para que el HTML lo entienda
        this.messages.push({ sender: 'assistant', text: res.response.replace(/\n/g, '<br>') });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.messages.push({ sender: 'assistant', text: "⚠️ Error de conexión." });
      }
    });
  }

  getAnalysis() {
    const questions = this.messages.filter(m => m.sender === 'user').map(m => m.text);
    this.isLoading = true;
    this.chatService.analyze(questions).subscribe((res: { response: string; }) => {
      this.analysisText = res.response.replace(/\n/g, '<br>');
      this.showAnalysis = true;
      this.isLoading = false;
    });
  }

  sendMail() {
    this.chatService.sendEmail(this.recruiterEmail, this.analysisText).subscribe(() => {
      alert("Email enviado con éxito 🚀");
      this.showAnalysis = false;
    });
  }
}