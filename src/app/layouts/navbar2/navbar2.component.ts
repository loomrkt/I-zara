import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ThemeControllerComponent} from "../../components/theme-controller/theme-controller.component";

@Component({
  selector: 'app-navbar2',
    imports: [
        NgOptimizedImage,
        ThemeControllerComponent
    ],
  templateUrl: './navbar2.component.html',
  styles: ``
})
export class Navbar2Component {

}
