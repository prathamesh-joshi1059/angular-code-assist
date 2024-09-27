// AI confidence score for this refactoring: 90.82%
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/assets/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = environment.apiUrl; // Make baseUrl private

  constructor(private http: HttpClient) {}

  getData(url: string): Observable<any> { // Specify return type
    return this.http.get<any>(`${this.baseUrl}${url}`); // Specify generic type
  }

  postData(url: string, data: unknown): Observable<any> { // Use unknown type for data
    return this.http.post<any>(`${this.baseUrl}${url}`, data); // Specify generic type
  }

  deleteData(url: string, id: string): Observable<any> { // Specify return type
    return this.http.delete<any>(`${this.baseUrl}${url}/${id}`); // Specify generic type
  }

  updateData(url: string, data: { id: string; payload: any }): Observable<any> { // Specify structure of data
    return this.http.patch<any>(`${this.baseUrl}${url}/${data.id}`, data.payload); // Specify generic type
  }

  getCalendarView(body: unknown): Observable<any> { // Use unknown type for body
    return new Observable((observer) => {
      fetch(`${this.baseUrl}calendar-view/default`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (!response.body) {
            observer.error(new Error('Response body is null'));
            return;
          }
          const reader = response.body.getReader();
          let buffer = '';

          const processText = (result: ReadableStreamReadResult<Uint8Array>) => {
            if (result.done) {
              observer.complete();
              return;
            }

            buffer += new TextDecoder().decode(result.value);
            const messages = buffer.split('\n\n');
            const lastMessage = messages.pop();
            buffer = lastMessage !== undefined ? lastMessage : '';

            messages.forEach((message) => {
              // console.log(message);
              if (message.trim()) {
                const match = message.match(/data:\s*(\{.*\})/);
                if (match) {
                  const jsonData = JSON.parse(match[1]); // Use const instead of var
                  observer.next(jsonData.data || jsonData);
                }
              }
            });

            reader.read().then(processText);
          };

          reader.read().then(processText);
        })
        .catch((error) => {
          observer.error(error);
        });

      return () => {};
    });
  }
}

/*
- Dynamic typing used in method parameters instead of strict types.
- Use of var instead of const or let.
- Unused return type in some methods.
*/