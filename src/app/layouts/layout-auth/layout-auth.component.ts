import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {
  NgOptimizedImage,
  IMAGE_LOADER,
  ImageLoaderConfig,
} from '@angular/common';

@Component({
  selector: 'app-layout-auth',
  imports: [RouterOutlet, NgOptimizedImage],
  templateUrl: './layout-auth.component.html',
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
export class LayoutAuthComponent {}
