import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/assets/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getData(url: string) {
    return this.http.get(`${this.baseUrl}${url}`);
  }

  postData(url: string, data: any) {
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  deleteData(url: string, id: string) {
    return this.http.delete(`${this.baseUrl}${url}/${id}`);
  }

  updateData(url: string, data) {
    return this.http.patch(`${this.baseUrl}${url}/${data.id}`, data.payload);
  }
  getCalendarView(body: any): Observable<any> {
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

          const processText = (
            result: ReadableStreamReadResult<Uint8Array>
          ) => {
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
                  var jsonData = JSON.parse(match[1]);
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
