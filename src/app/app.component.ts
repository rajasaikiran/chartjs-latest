import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto'
import { EventsService } from './events.service';
import { graphRecord, meetingEvent, offEvent } from './models/offEvent.model';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { finalize, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DatePipe]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'chart';
  private canvas: any
  @ViewChild('mychart') mychart!: ElementRef;
  private unsubscribe$ = new Subject();
  public userEventsData!: offEvent[];
  public userEvents: graphRecord[] = []
  public isLoading = true;
  private statusColor: string[] = [];

  constructor(public _events: EventsService, private _date: DatePipe) { }

  ngOnInit(): void {
    this.getEventsDetails()
  }

  private getEventsDetails() {
    this._events.getEventsData().pipe(
      tap({
        next: (data: offEvent[]) => {
          this.userEventsData = data
          console.log(this.userEventsData)
          this.userEventsData.forEach((offEvent: offEvent) => {
            let record: graphRecord = { x: ['2023-01-01', '2023-01-05'], y: offEvent.userName }
            offEvent.oofEvents?.forEach((event: meetingEvent) => {
              if (event.isAllDay) {
                this.statusColor.push("#90e0ef")
              }
              else {
                this.statusColor.push("#ee6c4d")
              }
            })
            this.userEvents.push(record)
          })
          this.chartInitialization()
        },
        error: (error) => console.log(error),
      }),
      finalize(() => this.isLoading = false),
      takeUntil(this.unsubscribe$)).subscribe();
  }

  private chartInitialization() {
    this.canvas = this.mychart.nativeElement;
    let ctx = this.canvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      options: {
        responsive: true,
        indexAxis: 'y',
        scales: {
          x: {
            ticks: {
              display: false
            },
            position: 'top',
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'dd MMM yyyy',
              }
            },
            min: '2023-01-01',
            max: '2023-01-31',
          },
          y: {

          },
        },
        plugins: {
          datalabels: {
            labels: {
              title: {
                display: true,
                textAlign: "start",
                color: "black",
                font:
                {
                  weight: "bolder"
                }
              },
            }
          },
          title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
          },
          tooltip: {
            callbacks: {
              title: (ctx) => {
                console.log(ctx);
              }
            },
          },
        },

      },
      plugins: [ChartDataLabels],
      data: {
        datasets: [
          {
            fill: true,
            data: this.userEvents,
            barThickness: 20,
            minBarLength: 20,
            backgroundColor: this.statusColor,
            borderColor: this.statusColor,
            borderWidth: 1,
            borderSkipped: false,
            borderRadius: 25,
            barPercentage: 0.5
          },
        ],
      },
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
