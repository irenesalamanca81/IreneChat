import { Component, Inject } from '@angular/core';
import { ChatService } from '../../services/chat';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

interface ChatResponse {
  response: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class ChatComponent {

  userMessage: string = "";
  messages: Message[] = [];
  isLoading: boolean = false;

  constructor(@Inject(ChatService) private chatService: ChatService) {}

  send() {
    const text = this.userMessage.trim();
    if (!text || this.isLoading) return;

    this.messages.push({ sender: 'user', text });
    this.isLoading = true;
    this.userMessage = "";

    this.chatService.sendMessage(text).subscribe({
      next: (res: ChatResponse) => {
        this.messages.push({ sender: 'assistant', text: res.response });
        this.isLoading = false;
      },
      error: () => {
        this.messages.push({
          sender: 'assistant',
          text: "⚠️ Ha ocurrido un error, inténtalo de nuevo."
        });
        this.isLoading = false;
      }
    });
  }
}
