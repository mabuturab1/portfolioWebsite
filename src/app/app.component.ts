import { SaveDataOnlineService } from "./components/shared/services/saveData";
import { ScreenSizeService } from "./components/shared/services/screenSizeService";
import { CartItemsService } from "./components/shared/services/cartItems.service";
import { Subscription } from "rxjs";
import { AuthProcessService } from "ngx-auth-firebaseui";
import { ContentProvider } from "./components/shared/services/content-provider";
import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  title = "pizza";
  isAuthenticated = false;
  isMobile = false;
  isLoading = false;
  private subscription: Subscription;
  constructor(
    private contentProvider: ContentProvider,
    private authProcessService: AuthProcessService,
    private screenSizeService: ScreenSizeService,
    private saveDataService: SaveDataOnlineService
  ) {}
  ngOnInit() {
    if (window.innerWidth <= 580) {
      this.isMobile = true;
      this.screenSizeService.setIsMobile(true);
    } else {
      this.isMobile = false;
      this.screenSizeService.setIsMobile(false);
    }

    // this.contentProvider.initItems();
    console.log(this.authProcessService.user);
    if (this.authProcessService.user != null) {
      this.isAuthenticated = true;
      this.processAuthenticated(this.authProcessService.user);
    }
    this.subscription = this.authProcessService.user$.subscribe(user => {
      this.isAuthenticated = true;
      this.processAuthenticated(user);
    });
  }
  processAuthenticated(user) {
    if (user != null) {
      console.log(user);
      this.isAuthenticated = true;
      if (user.email != null && user.uid != null) {
        this.saveDataService.setUid(user.uid);
        this.contentProvider.fetchAllData();
      } else {
        this.saveDataService.setGeneral();
        this.contentProvider.fetchAllData();
      }
    } else {
      this.isAuthenticated = false;
      this.saveDataService.setGeneral();
      this.contentProvider.fetchAllData();
    }
  }

  toggleClicked() {}
  onResize(event: any) {
    if ((event.target as Window).innerWidth <= 580) {
      this.isMobile = true;
      this.screenSizeService.setIsMobile(true);
    } else {
      this.isMobile = false;
      this.screenSizeService.setIsMobile(false);
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
