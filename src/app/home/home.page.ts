import { Component,ViewChild,ElementRef,OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
    @ViewChild('map', { static: true }) mapElement: ElementRef;

    shops:Shop[];
    selectedShop:Shop;

    latitude: number = 35.651509516118466;
    longitude: number = 140.03762950048184;

  constructor() {
    this.shops = [
      {id:1,latitude:35.651509516118466,longitude:140.03762950048184,name:"イオンタワー",address:"千葉県千葉市美浜区中瀬1丁目5番地1",tel:"0432126110"},
      {id:2,latitude:35.65036272477391,longitude:140.04009889994245,name:"イオンタワーアネックス",address:"千葉県千葉市美浜区中瀬1丁目4",tel:"0432126003"},
      {id:3,latitude:35.654971926994044,longitude:140.0293380306287,name:"イオンモール幕張新都心",address:"千葉県千葉市美浜区中瀬一丁目5番地1",tel:"0433517500"},
      {id:4,latitude:35.68757955674779,longitude: 139.7183371330307,name:"まいばすけっと四谷4丁目",address:"東京都新宿区四谷４丁目1−１ 細井ビル",tel:"0353623908"},
      {id:5,latitude:35.671990,longitude:140.040341,name:"ミニストップ メイプルイン幕張",address:"千葉県千葉市花見川区幕張本郷１丁目１２−１",tel:"0432760602"},
      {id:6,latitude:35.652048,longitude:140.049376,name:"イオン幕張",address:"〒261-0021 千葉県千葉市美浜区ひび野１−３",tel:"0433505511"},     
    ]
  }

  ngOnInit(){
      this.loadMap();
  }

  async getLocation() {
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude =position.coords.longitude;
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
}
class Shop{
    id:number;
    latitude:number;
    longitude:number;
    name:string;
    address:string;
    tel:string;
}
