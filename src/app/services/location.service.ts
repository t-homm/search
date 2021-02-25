import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of }  from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
    // private url = 'https://localhost:5001/api';
    private url = 'http://2006222e109f.ngrok.io/api';

    constructor(
        private http: HttpClient
    ) { }

    getLocation(lat,lng):Observable<Response>{
            let data = {
              lat:lat,
              lng:lng
            }
            return this.http.get<Response>(`${this.url}/location`,{params:data});
    }

    getLocationName(name):Observable<Response[]>{
        let data = {
            name:name
        }
        return this.http.get<Response[]>(`${this.url}/locationName`,{params:data});
    }
}
class Response{
    status:string;
    data:
    {
        id:number,
        latitude:number,
        longitude:number,
        name:string,
        address:string,
        tel:string

    }
}