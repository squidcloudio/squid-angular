import { ModuleWithProviders, NgModule, NgZone } from '@angular/core';
import { Squid, SquidOptions } from '@squidcloud/client';

@NgModule()
export class SquidModule {
  /** Initialize the Squid client module. */
  static forRoot(options: SquidOptions): ModuleWithProviders<SquidModule> {
    return {
      ngModule: SquidModule,
      providers: [
        {
          provide: Squid,
          useFactory: provideSquid(options),
          deps: [NgZone],
        },
      ],
    };
  }
}

export function provideSquid(options: SquidOptions): (ngZone: NgZone) => Squid {
  return (ngZone: NgZone) =>
    new Squid({
      ...options,
      messageNotificationWrapper: ngZone.run.bind(ngZone),
    });
}
