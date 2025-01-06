// noinspection JSUnusedGlobalSymbols

import {ModuleWithProviders, NgModule, NgZone, Provider} from '@angular/core';
import {Squid, SquidOptions} from '@squidcloud/client';

@NgModule()
export class SquidModule {
  /** Initialize the Squid client module. */
  static forRoot(options: SquidOptions): ModuleWithProviders<SquidModule> {
    return {
      ngModule: SquidModule,
      providers: [
        {
          provide: Squid,
          useFactory: createSquidFactory(options),
          deps: [NgZone],
        },
      ],
    };
  }
}

/**  Provides a Squid instance as an Angular provider using the specified options. */
export function provideSquid(options: SquidOptions): Provider {
  return {
    provide: Squid,
    useFactory: createSquidFactory(options),
    deps: [NgZone],
  };
}

/**
 * Creates a factory function for initializing a Squid instance with the provided options.
 * Ensures that message notifications are wrapped within Angular's zone for proper change detection.
 */
export function createSquidFactory(options: SquidOptions): (ngZone: NgZone) => Squid {
  return (ngZone: NgZone) =>
    new Squid({
      ...options,
      messageNotificationWrapper: ngZone.run.bind(ngZone),
    });
}
