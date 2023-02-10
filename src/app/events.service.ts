import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { offEvent } from './models/offEvent.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(public httpClient: HttpClient) { }

  public getEventsData(): Observable<offEvent[]> {
    return this.httpClient.get<offEvent[]>('assets/data.json')
  }
}
