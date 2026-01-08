import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {

  private apiUrl = "https://localhost:7155/api" ;
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  // Login para obtener el token
  login(code: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { code }).pipe(
      tap(res => this.token = res.token)
    );
  }

  // Enviar mensaje con historial y Token
  sendMessage(message: string, history: string[]): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.post<any>(`${this.apiUrl}/chat`, { message, history }, { headers });
  }

  // Solicitar Análisis
  analyze(questions: string[]): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
    return this.http.post<any>(`${this.apiUrl}/analyze`, { userQuestions: questions }, { headers });
  }

  // Enviar Reporte por Email
  sendEmail(email: string, content: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
    return this.http.post<any>(`${this.apiUrl}/send-email`, { recruiterEmail: email, reportContent: content }, { headers });
  }
}