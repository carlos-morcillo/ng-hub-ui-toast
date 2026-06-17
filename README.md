# ng-hub-ui-toast

> Angular 22 standalone toast notifications · part of the [ng-hub-ui](https://hubui.dev/) ecosystem

## Installation

```bash
npm install ng-hub-ui-toast
```

## Quick start

```typescript
// app.config.ts
import { provideToast } from 'ng-hub-ui-toast';

export const appConfig: ApplicationConfig = {
    providers: [provideToast({ progressBar: true })]
};

// any component
import { ToastService } from 'ng-hub-ui-toast';

@Component({ ... })
export class MyComponent {
    private toastr = inject(ToastService);
    save() { this.toastr.success('Saved!'); }
}
```

Full documentation: [hubui.dev/toast](https://hubui.dev/toast)
