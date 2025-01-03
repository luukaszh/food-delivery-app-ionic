import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailService {

  constructor(private http: HttpClient) {}

  /**
   * Funkcja do wysyłania e-maili
   * @param email Adres odbiorcy
   * @param subject Temat wiadomości
   * @param text Treść wiadomości
   * @returns Observable z odpowiedzią API
   */
  sendEmail(email: string, subject: string, text: string): Observable<any> {
    const payload = { email, subject, text };
    return this.http.post(baseURL + '/send-email', payload);
  }
}
