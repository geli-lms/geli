import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable()
export class ThemeService {
  private renderer: Renderer2;
  themes: string[]= ['default', 'night', 'auto'];

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setTheme(theme: string) {
    this.renderer.removeClass(document.body, 'nightTheme');
    switch (theme) {
      case 'night':
        this.renderer.addClass(document.body, 'nightTheme');
        break;
      case 'auto':
        const time = new Date();
        if (time.getHours() >= 22 && time.getHours() <= 6) {
          this.renderer.addClass(document.body, 'nightTheme');
        }
        break;
      default :
        break;
    }
  }
}
