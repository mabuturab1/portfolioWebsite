import { AuthProcessService } from "ngx-auth-firebaseui";
import { mainContent, headerLinks, SocialMedia } from "./../interface";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
interface MapItemData {
  urlLabel: string;
  data: mainContent;
}
@Injectable({ providedIn: "root" })
export class SaveDataOnlineService {
  idToken: String;
  url = "https://portfolio-abuturab.firebaseio.com";
  uid: string = "";
  constructor(
    private http: HttpClient,
    private authProcessService: AuthProcessService
  ) {}
  isLoggedIn = false;
  async setUid(uid) {
    this.isLoggedIn = true;
    this.uid = uid;

    this.url =
      "https://portfolio-abuturab.firebaseio.com" + "/users/" + this.uid;
  }
  async setGeneral() {
    const id = await this.authProcessService.user.getIdToken();
    this.isLoggedIn = false;
    this.url =
      "https://portfolio-abuturab.firebaseio.com" + "/global" + this.uid;
  }
  async saveAllData(
    mapItems: Map<string, mainContent>,
    headerData: headerLinks[],
    socialMedia: SocialMedia
  ) {
    if (!this.isLoggedIn) return;
    const id = await this.authProcessService.user.getIdToken();

    let newData: MapItemData[] = [];
    console.log("saving data", mapItems);
    mapItems.forEach((val, key) => {
      newData.push({
        urlLabel: key,
        data: { ...val }
      });
    });
    this.http
      .put(this.url + "/allItems.json" + "?auth=" + id, newData)
      .pipe(
        map((data: MapItemData[]) => {
          console.log(data);
          return data;
        }),
        catchError(errorRes => {
          console.log(errorRes);
          return throwError(errorRes);
        })
      )
      .subscribe(res => console.log(res));
    this.http
      .put(this.url + "/headerData.json" + "?auth=" + id, headerData)
      .pipe(
        map((data: { [key: string]: headerLinks[] }) => {
          console.log(data);
          return data;
        }),
        catchError(errorRes => {
          console.log(errorRes);
          return throwError(errorRes);
        })
      )
      .subscribe();
    this.http
      .put(this.url + "/socialMedia.json" + "?auth=" + id, socialMedia)
      .pipe(
        map((data: { [key: string]: SocialMedia }) => {
          console.log(data);
          return data;
        }),
        catchError(errorRes => {
          console.log(errorRes);
          return throwError(errorRes);
        })
      )
      .subscribe();
  }
  async saveAllItems(mapItems: Map<String, mainContent>) {
    const id = await this.authProcessService.user.getIdToken();
    if (!this.isLoggedIn) return;
    let newData: any = [];
    console.log("saving data", mapItems);
    mapItems.forEach((val, key) => {
      newData.push({
        urlLabel: key,
        data: { ...val }
      });
    });
    this.http
      .put(this.url + "/allItems.json" + "?auth=" + id, newData)
      .pipe(
        map((data: { [key: string]: Map<string, mainContent> }) => {
          console.log(data);
          return data;
        }),
        catchError(errorRes => {
          console.log(errorRes);
          return throwError(errorRes);
        })
      )
      .subscribe();
  }
  async saveHeaderData(headerData: headerLinks[]) {
    if (!this.isLoggedIn) return;
    const id = await this.authProcessService.user.getIdToken();
    this.http
      .put(this.url + "/headerData.json" + "?auth=" + id, headerData)
      .pipe(
        map((data: { [key: string]: headerLinks[] }) => {
          console.log(data);
          return data;
        }),
        catchError(errorRes => {
          console.log(errorRes);
          return throwError(errorRes);
        })
      )
      .subscribe();
  }
  async saveSocialMedia(socialMedia: SocialMedia) {
    if (!this.isLoggedIn) return;
    const id = await this.authProcessService.user.getIdToken();
    this.http
      .put(this.url + "/socialMedia.json" + "?auth=" + id, socialMedia)
      .pipe(
        map((data: { [key: string]: SocialMedia }) => {
          console.log(data);
          return data;
        }),
        catchError(errorRes => {
          console.log(errorRes);
          return throwError(errorRes);
        })
      )
      .subscribe();
  }
  async fetchAllData(callback) {
    console.log("fetching all data");
    this.fetchAllItems(data => callback("allItems", data));
    this.fetchHeaderData(data => callback("headerData", data));
    this.fetchSocialMedia(data => callback("socialMedia", data));
  }
  async fetchAllItems(callback: (data: Map<string, mainContent>) => void) {
    const id = await this.authProcessService.user.getIdToken();
    this.http
      .get(this.url + "/allItems.json" + "?auth=" + id)
      .pipe(
        map((data: { urlLabel: string; data: mainContent }[]) => {
          let mapItems: Map<string, mainContent> = new Map();
          if (!data) {
            callback(null);
            return;
          }
          data.forEach(val => {
            console.log(val.urlLabel);
            console.log(val.data);
            mapItems.set(val.urlLabel, { ...val.data });
          });
          callback(mapItems);
        }),
        catchError(errorRes => {
          console.log(errorRes);
          return throwError(errorRes);
        })
      )
      .subscribe();
  }
  async fetchHeaderData(callback) {
    const id = await this.authProcessService.user.getIdToken();
    this.http
      .get(this.url + "/headerData.json" + "?auth=" + id)
      .pipe(
        map((data: { [key: string]: Map<string, mainContent> }) => {
          callback(data);
        }),
        catchError(errorRes => {
          console.log(errorRes);
          return throwError(errorRes);
        })
      )
      .subscribe();
  }
  async fetchSocialMedia(callback) {
    const id = await this.authProcessService.user.getIdToken();
    this.http
      .get(this.url + "/socialMedia.json" + "?auth=" + id)
      .pipe(
        map((data: { [key: string]: SocialMedia }) => {
          callback(data);
        }),
        catchError(errorRes => {
          console.log(errorRes);
          return throwError(errorRes);
        })
      )
      .subscribe();
  }
}
