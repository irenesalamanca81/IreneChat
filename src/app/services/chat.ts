import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatResponse {
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = "https://thickheadedly-nonascendent-shandi.ngrok-free.dev/api/chat";

  constructor(private http: HttpClient) {}
sendMessage(message: string): Observable<ChatResponse> {
  return this.http.post<ChatResponse>(
    this.apiUrl,
    { message },
    {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      }
    }
  );
}


}
