import { Component, Inject } from '@angular/core';
import { ChatService } from '../../services/chat';
import { NgFor, NgIf } from '@angular/common';
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
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class ChatComponent {

  userMessage: string = "";
  messages: Message[] = [];

  constructor(@Inject(ChatService) private chatService: ChatService) {}

  send() {
    const text = this.userMessage.trim();
    if (!text) return;

    this.messages.push({ sender: 'user', text });

    this.chatService.sendMessage(text).subscribe((res: ChatResponse) => {
      this.messages.push({ sender: 'assistant', text: res.response });
    });

    this.userMessage = "";
  }
}
