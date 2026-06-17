# ng-hub-ui-toast

> Notificaciones toast para Angular 22 standalone · parte del ecosistema [ng-hub-ui](https://hubui.dev/)

## Instalación

```bash
npm install ng-hub-ui-toast
```

## Inicio rápido

```typescript
// app.config.ts
import { provideToast } from 'ng-hub-ui-toast';

export const appConfig: ApplicationConfig = {
    providers: [provideToast({ progressBar: true })]
};

// cualquier componente
import { ToastService } from 'ng-hub-ui-toast';

@Component({ ... })
export class MyComponent {
    private toastr = inject(ToastService);
    save() { this.toastr.success('¡Guardado!'); }
}
```

Documentación completa: [hubui.dev/toast](https://hubui.dev/toast)
