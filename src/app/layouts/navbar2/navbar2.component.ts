import { Component } from '@angular/core';
import {
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { ThemeControllerComponent } from '../../components/theme-controller/theme-controller.component';

@Component({
  selector: 'app-navbar2',
  imports: [NgOptimizedImage, ThemeControllerComponent],
  templateUrl: './navbar2.component.html',
  styles: ``,
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        const [path, token] = config.src.split('?token=');
        return `https://firebasestorage.googleapis.com/v0/b/multimediart-f509c.appspot.com/o/assets%2F${encodeURIComponent(
          path
        )}?alt=media&token=${token}`;
      },
    },
  ],
})
export class Navbar2Component {}
