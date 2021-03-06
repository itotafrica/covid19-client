import {Component, OnDestroy, OnInit} from '@angular/core';
import L from 'leaflet';
import sweetAlert from 'sweetalert2';
import {ApiService} from '../../api.service';
import {Case} from '../../api.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styles: []
})
export class MapComponent implements OnInit, OnDestroy {
  lat: number;
  lng: number;
  data: Case[];
  loading: boolean;
  error = false;
  timer: any;

  constructor(private apiService: ApiService) {
  }

  load() {
    this.loading = true;
    this.apiService.getConfirmed()
      .subscribe(
        data => {
          this.data = data;
          this.loading = false;

          const map = L.map('map');
          navigator.geolocation.getCurrentPosition(
            position => {
              this.lat = position.coords.latitude;
              this.lng = position.coords.longitude;

              map.setView([this.lat, this.lng], 3);
              const marker = L.marker([this.lat, this.lng]).addTo(map);
              marker.bindPopup('Moi.');

              this.data.forEach(zone => {
                L.circle([zone.lat, zone.long], {
                  color: 'red',
                  fillColor: '#f03',
                  fillOpacity: 0.3,
                  radius: zone.active + zone.confirmed
                })
                  .bindPopup(`
              <h3>
                ${zone.countryRegion}
                <img alt="${zone.iso2}" class="h-10 w-10" src="https://www.countryflags.io/${zone.iso2}/flat/64.png"/>
              </h3>
              <b>Confirmés</b>: ${zone.confirmed}<br>
              <b>Guérisons</b>: ${zone.recovered}<br>
              <b>Morts</b>: ${zone.deaths}<br>
            `)
                  .addTo(map);
              });
            },
            e => {
              sweetAlert.fire('Error', 'Impossible de vous géolocaliser, Réessayez plus tard', 'warning');
              this.error = true;
            },
            {
              enableHighAccuracy: true
            }
          )
          ;
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
        },
        e => {
          sweetAlert.fire(
            'Oups',
            'Impossible de contacter le Serveur, Vérifiez votre connexion internet',
            'warning'
          );
          this.loading = false;
          this.error = true;
        }
      );
  }

  ngOnInit(): void {
    this.load();
    this.timer = setInterval(this.load, 300000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
