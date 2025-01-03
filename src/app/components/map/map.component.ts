import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import Geocoder from 'leaflet-control-geocoder';
import { LocationService } from 'src/app/services/location.service';
import { Order } from 'src/app/shared/models/order';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges {

  findLocTransl = this.translateSrv.instant('FIND_LOCATION');

  @Input() order!: Order;
  @Input() readonly = false;
  private readonly MARKER_ZOOM_LEVEL = 16;
  private readonly MARKER_ICON = L.icon({
    iconUrl: 'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });
  private readonly DEFAULT_LATLNG: L.LatLngTuple = [54.39, 18.57];

  @ViewChild('map', { static: true }) mapRef!: ElementRef;
  map!: L.Map;
  currentMarker!: L.Marker;

  constructor(
    private locationService: LocationService,
    private http: HttpClient,
    private translateSrv: TranslateService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    setTimeout(() => {
      if (!this.order) return;
      this.initializeMap();

      if (this.readonly && this.addressLatLng) {
        this.showLocationOnReadonlyMode();
      }
    }, 500);
  }

  showLocationOnReadonlyMode() {
    const m = this.map;
    this.setMarker(this.addressLatLng);
    m.setView(this.addressLatLng, this.MARKER_ZOOM_LEVEL);

    m.dragging.disable();
    m.touchZoom.disable();
    m.doubleClickZoom.disable();
    m.scrollWheelZoom.disable();
    m.boxZoom.disable();
    m.keyboard.disable();
    m.off('click');
    m.tap?.disable();
    this.currentMarker.dragging?.disable();
  }

  initializeMap() {
    if (this.map) return;
  
    this.map = L.map(this.mapRef.nativeElement, {
      attributionControl: false
    }).setView(this.DEFAULT_LATLNG, 8);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  
    const GeocoderControl = new Geocoder();
    GeocoderControl.on('markgeocode', (e: any) => {
      const latlng = e.geocode.center;
      this.setMarker(latlng);      
      this.map.setView(latlng, this.MARKER_ZOOM_LEVEL);
    });
  
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.setMarker(e.latlng);
    });
  }
  
  reverseGeocode(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const address = response.address;
        let conciseAddress = '';
        
        if (address.city) {
          conciseAddress += address.city + ', ';
        }
        if (address.village) {
          conciseAddress += address.village + ', ';
        }
        if (address.road) {
          conciseAddress += 'ul. ' + address.road + ' ';
        }
        if (address.house_number) {
          conciseAddress += address.house_number + ', ';
        }
        if (address.postcode) {
          conciseAddress += address.postcode + ', ';
        }
        conciseAddress = conciseAddress.slice(0, -2);
  
        return conciseAddress;
      })
    );
  }
  

  findMyLocation() {
    this.locationService.getCurrentLocation().subscribe({
      next: (latlng: L.LatLngExpression) => {
        this.map.setView(latlng, this.MARKER_ZOOM_LEVEL)
        this.setMarker(latlng)
      }
    })
  }

  setMarker(latlng: L.LatLngExpression) {
    this.addressLatLng = latlng as L.LatLng;
    if (this.currentMarker) {
      this.currentMarker.setLatLng(latlng);
      return;
    }

    this.currentMarker = L.marker(latlng, {
      draggable: true,
      icon: this.MARKER_ICON
    }).addTo(this.map);

    this.currentMarker.on('dragend', () => {
      this.addressLatLng = this.currentMarker.getLatLng();
    })
  }

  set addressLatLng(latlng: L.LatLng) {
    if (!latlng.lat.toFixed) return;

    latlng.lat = parseFloat(latlng.lat.toFixed(8));
    latlng.lng = parseFloat(latlng.lng.toFixed(8));
    this.order.addressLatLng = latlng;
    console.log(this.order.addressLatLng);

    this.reverseGeocode(latlng.lat, latlng.lng).subscribe((address: any) => {
      this.order.address = address;
    });
  }

  get addressLatLng() {
    return this.order.addressLatLng!;
  }

  get address() {
    return this.order.address!;
  }
}
