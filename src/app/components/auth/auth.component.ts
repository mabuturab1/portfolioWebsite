import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthProvider } from "ngx-auth-firebaseui";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"]
})
export class AuthComponent implements OnInit {
  providers = AuthProvider;
  constructor(private router: Router) {}

  ngOnInit() {}
  printUser(event) {
    console.log("Success", event);
    this.router.navigate(["/home"]);
  }
  printError(event) {
    console.error("Error occurred", event);
  }
}
