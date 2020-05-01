import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  QueryList,
  OnDestroy
} from '@angular/core';
import {Article, Dashboard, Case, CongoCase} from 'src/app/api.model';
import {ApiService} from 'src/app/api.service';
import sweetAlert from 'sweetalert2';
import {DomSanitizer} from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  loading: boolean;
  data: Dashboard;
  error = false;
  drc: CongoCase[];
  articles: Article[];
  timer: any;
  title = 'Animated Count';

  nums: Array<number> = [25, 76, 48];


  @ViewChild('oneItem', {static: true}) oneItem: any;
  @ViewChildren('count') count: QueryList<any>;

  constructor(
    private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    public translate: TranslateService,
    private elRef: ElementRef
  ) {}


  get updatedAt() {
    return (new Date(this.data.lastUpdate)).toLocaleString('fr-FR');
  }

  loadArticles() {
    this.apiService.getArticles()
      .subscribe(data => {
        this.articles = data;
        this.articles.forEach(a => {
          if (a.type === 'video') {
            a.link = this.domSanitizer.bypassSecurityTrustResourceUrl(a.link) as string;
          }
        });
      });
  }


  loadDRC() {
    let totalConfirmed = 0;
    let totalRecovered = 0;
    let totalDeaths = 0;

    this.loading = true;
    this.apiService.getCongoCase()
      .subscribe(data => {
        this.drc = data;

        this.drc.forEach((region) => {
          totalConfirmed += Number(region.confirmed);
          totalRecovered += Number(region.recovered);
          totalDeaths += Number(region.deaths);
        });

        this.drc.push({
          confirmed: totalConfirmed.toString(),
          recovered: totalRecovered.toString(),
          deaths: totalDeaths.toString(),
          region: 'Total'
        });

      });
  }

  load() {
    this.loading = true;
    this.apiService.getDashboard()
      .subscribe(
        data => {
          this.data = data;
          this.loading = false;
        },
        e => {
          sweetAlert.fire(
            'Oups',
            'Impossible de contacter le Serveur, Vérifiez votre connexion internet',
            'error'
          );
          this.loading = false;
          this.error = true;
        }
      );
  }

  ngOnInit(): void {

    let worltotalConfirmed = 0;
    let worldtotalRecovered = 0;
    let worldtotalDeaths = 0;

    this.apiService.getDashboard()
      .subscribe(
        data => {
          this.data = data;
          worltotalConfirmed=this.data.confirmed.value;
          worldtotalRecovered=this.data.recovered.value;
          worldtotalDeaths=this.data.deaths.value;
          console.log(this.data.recovered)
        });

    let totalConfirmed = 0;
    let totalRecovered = 0;
    let totalDeaths = 0;
    this.apiService.getCongoCase()
      .subscribe(data => {
        this.drc = data;

        this.drc.forEach((region) => {
          totalConfirmed += Number(region.confirmed);
          totalRecovered += Number(region.recovered);
          totalDeaths += Number(region.deaths);
        });

      });

    this.loadDRC();
    this.load();
    this.loadArticles();
    this.timer = setInterval(this.load, 300000);



    setTimeout(function() {

      document.getElementById('item-loading-chart').style.display = 'none';
      document.getElementById('item-loading-chart-world').style.display = 'none';
      let configDRC = {
        data: {
          datasets: [{
            data: [
              totalConfirmed,
              totalRecovered,
              totalDeaths,
            ],
            backgroundColor: [
              '#ff00008f',
              '#48bb788f',
              '#0000008f',
            ],
            label: 'Situation de la RDC'
          }],
          labels: [
            'Cas confirmés',
            'Guérisons',
            'Morts'
          ]
        },
        options: {
          responsive: true,
          legend: {
            position: 'left',
          },
          scale: {
            ticks: {
              beginAtZero: true
            },
            reverse: false
          },
          animation: {
            animateRotate: false,
            animateScale: true
          }
        }
      };
      let configWorld = {
        data: {
          datasets: [{
            data: [
              worltotalConfirmed,
              worldtotalRecovered,
              worldtotalDeaths
            ],
            backgroundColor: [
              '#ff00008f',
              '#48bb788f',
              '#0000008f',
            ],
            label: 'Situation du Monde'
          }],
          labels: [
            'Cas confirmés',
            'Guérisons',
            'Morts'
          ]
        },
        options: {
          responsive: true,
          legend: {
            position: 'left',
          },
          scale: {
            ticks: {
              beginAtZero: true
            },
            reverse: false
          },
          animation: {
            animateRotate: false,
            animateScale: true
          }
        }
      };

      new Chart.PolarArea(document.getElementById('canvas'), configDRC);

      new Chart.PolarArea(document.getElementById('canvas-world'), configWorld);
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  ngAfterViewInit() {

  }

  animateCount() {
    const thisElement = this;

    const single = this.oneItem.nativeElement.innerHTML;

    this.counterFunc(single, this.oneItem, 300000);

    this.count.forEach(item => {
      thisElement.counterFunc(item.nativeElement.innerHTML, item, 300000);
    });
  }

  counterFunc(end: number, element: any, duration: number) {
    let range;
    let current: number;
    let step;
    let timer;

    range = end - 0;
    current = 0;
    step = Math.abs(Math.floor(duration / range));

    timer = setInterval(() => {
      current += 1;
      element.nativeElement.textContent = current;
      if (current === end) {
        clearInterval(timer);
      }
    }, step);
  }
}
