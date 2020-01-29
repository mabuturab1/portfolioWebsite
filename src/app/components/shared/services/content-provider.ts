import { SaveDataOnlineService } from "./saveData";
import {
  singleItem,
  mainContent,
  headerLinks,
  SocialMedia
} from "./../interface";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class ContentProvider {
  constructor(private saveData: SaveDataOnlineService) {}
  itemsShow = new Subject<boolean>();
  navigateToRoute = new Subject<string>();
  private itemsToShow: singleItem[];
  allDataReceived = new Subject<boolean>();
  private socialMediaLinks: SocialMedia;
  private headerData: headerLinks[] = [];
  private mapItems: Map<string, mainContent> = new Map();
  private hasModelShown = false;
  initItems() {
    // this.itemsToShow = this.mapItems.get(this.headerData[0].urlLabel).items;
    // this.itemsShow.next(true);
  }
  getItems() {
    return this.itemsToShow;
  }
  getMainSectionData() {
    console.log(this.mapItems);
    return this.mapItems.get(this.headerData[0].urlLabel).items;
  }
  getWholeData() {
    return this.getCopy(this.mapItems);
  }
  getAllKeys() {
    return this.mapItems.keys;
  }
  getHeaderData() {
    let items: headerLinks[] = new Array(this.mapItems.keys.length);
    this.headerData.forEach(value => {
      items.push({ ...value });
    });
    return items;
  }
  getHeaderCopy(newMap: Array<{ label: string; popUp: string[] }>) {
    let newMapItems: Array<{ label: string; popUp: string[] }> = [];
    newMap.forEach(value => {
      newMapItems.push({ label: value.label, popUp: value.popUp.slice() });
    });
    return newMapItems;
  }
  getCopy(newMap: Map<string, mainContent>) {
    let newMapItems: Map<string, mainContent> = new Map();
    newMap.forEach((value, key) => {
      let itemList: singleItem[] = [];
      value.items.forEach(el => {
        itemList.push({ ...el });
      });

      newMapItems.set(key, {
        items: itemList
      });
    });
    return newMapItems;
  }
  setItemByUrl(urlName: string) {
    // console.log("Got url", urlName);
    // if (urlName === "home") {
    //   console.log(this.headerData[0].urlLabel);
    //   this.navigateToRoute.next(this.headerData[0].urlLabel);
    //   this.itemsToShow = this.mapItems.get(this.headerData[0].urlLabel).items;
    //   return;
    // }
    let item = this.headerData.find(val => {
      return val.urlName.toLowerCase().includes(urlName.toLowerCase());
    });
    this.itemsToShow = this.mapItems.get(item.urlLabel).items;
    this.itemsShow.next(true);
  }
  updateItems(newMapItems: Map<string, mainContent>) {
    this.mapItems = this.getCopy(newMapItems);

    this.saveAllItems();
    this.itemsShow.next(true);
  }
  processClickedItem(id: string) {
    if (this.mapItems.has(id)) {
      this.itemsToShow = this.mapItems.get(id).items;
      this.itemsShow.next(true);
    }
  }
  addNewPage(newData: headerLinks, newIndex: number) {
    let newHeaderData = this.getHeaderData();
    newHeaderData.splice(newIndex - 1, 0, newData);
    this.headerData = newHeaderData;
    this.mapItems.set(newData.urlLabel, {
      items: []
    });
    this.saveHeaderData();
    this.saveAllItems();
    console.log("header data afetr update", this.headerData);
    this.itemsShow.next(true);
  }
  updateCurrentPage(
    prevData: headerLinks,
    newData: headerLinks,
    newIndex: number
  ) {
    let newHeaderData = this.getHeaderData();
    let index = newHeaderData.findIndex(val => {
      return val.urlLabel === prevData.urlLabel;
    });
    newHeaderData.splice(index, 1);
    newHeaderData.splice(newIndex - 1, 0, newData);
    this.headerData = newHeaderData;
    let content = this.mapItems.get(prevData.urlLabel);
    this.mapItems.delete(prevData.urlLabel);
    this.mapItems.set(newData.urlLabel, content);
    console.log(this.mapItems, this.headerData);
    this.saveHeaderData();
    this.saveAllItems();
    this.itemsShow.next(true);
  }
  deleteHeadItem(index: number) {
    let id = this.headerData[index].urlLabel;
    this.mapItems.delete(id);
    this.headerData.splice(index, 1);
    this.saveHeaderData();
    this.saveAllItems();
    this.itemsShow.next(true);
  }
  deleteItemById(id: string, key: string) {
    let index = this.mapItems.get(key).items.findIndex(val => val.id === id);
    this.mapItems.get(key).items.splice(index, 1);
    this.saveHeaderData();
    this.saveAllItems();
    this.itemsShow.next(true);
  }
  setSocialMedia(socialMedia: SocialMedia) {
    this.socialMediaLinks = socialMedia;
    this.saveSocialMedia();
  }
  getSocialMedia() {
    return { ...this.socialMediaLinks };
  }
  saveAllData() {
    this.saveData.saveAllData(
      this.getWholeData(),
      this.getHeaderData(),
      this.getSocialMedia()
    );
  }
  saveAllItems() {
    this.saveData.saveAllItems(this.getWholeData());
  }
  saveHeaderData() {
    this.saveData.saveHeaderData(this.getHeaderData());
  }
  saveSocialMedia() {
    this.saveData.saveSocialMedia(this.getSocialMedia());
  }
  checkForCompleteData() {
    console.log(this.mapItems);
    console.log(this.headerData);
    console.log(this.socialMediaLinks);
    if (
      this.mapItems.keys.length >= 1 &&
      this.headerData.length >= 1 &&
      this.socialMediaLinks != null
    ) {
      this.allDataReceived.next(true);
    }
  }
  fetchAllData() {
    this.saveData.fetchAllData((responseName: string, data: any) => {
      if (responseName == "allItems") {
        if (!data) {
          this.saveAllItems();
          return;
        }
        this.mapItems = data;
        console.log("inside content provider", this.mapItems);
        this.itemsShow.next(true);
      } else if (responseName == "headerData") {
        if (!data) {
          this.saveHeaderData();
          return;
        }
        this.headerData = data;
        this.itemsShow.next(true);
      } else if (responseName == "socialMedia") {
        if (!data) {
          this.saveSocialMedia();
          return;
        }
        this.socialMediaLinks = data;
        this.itemsShow.next(true);
      }
    });
    this.checkForCompleteData();
  }
  fetchAllItems() {
    this.saveData.fetchAllItems(response => {
      this.mapItems = response;
      this.itemsShow.next(true);
    });
    this.checkForCompleteData();
  }
  fetchHeaderData() {
    this.saveData.fetchHeaderData(response => {
      this.headerData = response;
      this.itemsShow.next(true);
    });
    this.checkForCompleteData();
  }
  fetchSocialMedia() {
    this.saveData.fetchSocialMedia(response => {
      this.socialMediaLinks = response;
      this.itemsShow.next(true);
    });
    this.checkForCompleteData();
  }
}
