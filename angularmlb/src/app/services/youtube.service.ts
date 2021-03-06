import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class YoutubeService {
  public dataUrl: string; 

  constructor(private http: Http) { }
  // get data
  getData() { 
    // http get request
    this.dataUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=baseball,latest,news&key=YourKey';
    return this.http.get(this.dataUrl)
                    .map(data => data.json()); 
  }
}
