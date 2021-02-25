import { Component,ViewChild,ElementRef,OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { LocationService } from '../services/location.service';

const { Geolocation } = Plugins;

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
    @ViewChild('map', { static: true }) mapElement: ElementRef;
 
    searchShopName:string = "";
    shops:Shop[];
    selectedShop:Shop;
    selectedShops:Shop[];

    latitude: number = 35.651509516118466;
    longitude: number = 140.03762950048184;

    constructor(private locationService:LocationService) {

  }

  async ngOnInit(){
      this.locationService.getLocation(this.latitude, this.longitude).subscribe((res:any) => {
        this.shops = res.data;
        this.loadMap();
      });
      
    }

  async getLocation() {
      await Geolocation.getCurrentPosition()
        .then((resp) => {
            this.latitude = resp.coords.latitude;
            this.longitude = resp.coords.longitude;
        })
        .catch((error) => {
            console.log('Error getting location',error);
        });

      this.locationService.getLocation(this.latitude,this.longitude).subscribe((res:any) => {
        this.shops = res.data;
      });
  }

  async loadMap() {
      let mapOptions = {
      　center: new google.maps.LatLng(this.latitude, this.longitude),
      　zoom: 15,
      　mapTypeId: google.maps.MapTypeId.ROADMAP,
      };
      //上記設定で地図を表示
      var map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      //現在地にマーカーを表示
      new google.maps.Marker({
          position:new google.maps.LatLng(this.latitude, this.longitude),
          map:map,
      });

      //店舗マーカーを表示
      for (let i = 0; i < this.shops.length; i++) {
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(this.shops[i].latitude, this.shops[i].longitude),
          map: map,
          title: this.shops[i].name,
          icon: {
            fillColor: "#db2edb",
            fillOpacity: 0.8,
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            strokeColor: "#db2edb",
            strokeWeight: 1.0 //枠の透過率
          },
          label: {
            text: 'A',
            color: '#FFFFFF',
            fontSize: '20px' //文字のサイズ
          }
        });

      //店舗をクリックしたら
      google.maps.event.addListener(marker, 'click', (function clickEventFunc(event) {
         var latLng = event.latLng.toString().replace("(","").replace(")","").replace(" ","").split(",");
         var clickLat = latLng[0];
         var clickLng = latLng[1];
      
         const clickShop = this.shops.filter(shops => shops.latitude == clickLat || shops.longitude == clickLng);
         
         this.selectedShop = {
             id:clickShop[0].id,
             name:clickShop[0].name,
             address:clickShop[0].address,
             tel:clickShop[0].tel
         }
      
       }).bind(this));       
    };
  }
  async check(){
    await this.getLocation();
    this.loadMap();
  }

  search(searchForm){
      //初期化
      this.selectedShops = [];

      var name =searchForm.value.searchShopName;
      this.locationService.getLocationName(name).subscribe((res:any) => {
          this.selectedShops = res.data;
          this.shops = res.data;
          this.latitude = this.selectedShops[0].latitude;
          this.longitude = this.selectedShops[0].longitude;
          this.loadMap();
      
      });

  }
}
class Shop{
    id:number;
    latitude:number;
    longitude:number;
    name:string;
    address:string;
    tel:string;
}
