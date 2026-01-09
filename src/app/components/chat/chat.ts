import { ChatService } from "../../services/chat";
import { CommonModule } from '@angular/common';
import { Component, OnInit } from "@angular/core"; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent implements OnInit { 
  userMessage: string = "";
  messages: any[] = [];
  isLoading: boolean = false;
  isLoggedIn: boolean = false;
  accessCode: string = "";
  showAnalysis: boolean = false;
  analysisText: string = "";
  recruiterEmail: string = "";

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadExternalConfig();
  }


loadExternalConfig() {
    fetch('/ui-settings.json')
      .then(res => res.json())
      .then(config => {
        const root = document.documentElement;
        if (config.theme) {
          root.style.setProperty('--primary-color', config.theme.primaryColor);
          root.style.setProperty('--border-radius', config.theme.borderRadius);
          root.style.setProperty('--input-font-size', config.theme.mobileInputFontSize);
          root.style.setProperty('--overlay-bg', config.theme.overlayOpacity ? `rgba(255,255,255,${config.theme.overlayOpacity})` : 'rgba(255,255,255,0.98)');
        }
        if (config.layout) {
          root.style.setProperty('--chat-max-width', config.layout.maxWidth);
        }
      })
      .catch(err => console.error("Error cargando JSON:", err));
  }

  doLogin() {
    this.chatService.login(this.accessCode).subscribe({
      next: () => this.isLoggedIn = true,
      error: () => alert("Código incorrecto")
    });
  }

  send() {
    const text = this.userMessage.trim();
    if (!text || this.isLoading) return;

    const history = this.messages
      .filter(m => m.sender === 'user')
      .map(m => m.text);

    this.messages.push({ sender: 'user', text });
    this.isLoading = true;
    this.userMessage = "";

    this.chatService.sendMessage(text, history).subscribe({
      next: (res: { response: string; }) => {
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