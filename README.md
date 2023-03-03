# Angular For Squid Cloud

A library for integrating [Squid Cloud](https://squid.cloud) with an Angular application.

## Features

* Angular module and provider for initializing and injecting the Squid Client SDK

## Getting started

### Requirements

This project only supports the [actively supported versions of Angular as stated in the Angular documentation](https://angular.io/guide/releases#actively-supported-versions). Whilst other versions might be compatible they are not actively supported.

### Installation

Using npm:

```sh
npm install @squidcloud/angular
```

### Configure Squid Cloud

Create an **Application** using the [Squid Cloud Console](https://console.squid.cloud).
* Copy the **Application ID**
* Add the following to your Angular environment configuration:
```ts
export const environment = {
  // ...
  // Squid
  squidAppId: <YOUR_SQUID_CLOUD_APPLICATION_ID>,
  squidRegion: <YOUR_SQUID_CLOUD_REGION>,
  // ...
};
```
In the local environment, you can use the `local` region.
```ts
squidRegion: 'local',
```

Note: If you do not environments files in your Angular application, you can generate them using the `ng generate` command:
```sh
ng generate environments
```
* In your Angular root module, import the `SquidModule` and configure it with your Squid Cloud Application ID:
```ts
import { SquidModule } from '@squidcloud/angular';
// ...
@NgModule({
  // ...
 imports: [
  SquidModule.forRoot({
      appId: environment.squidAppId,
      region: environment.squidRegion,
   }),
],
// ...
```
* If you're using an existing application, just reuse the existing application's ID.

The above will provide a `Squid` instance that you can inject in different services and components of your application.

Alternatively, you can provide the Squid instance using a factory function:
* Import the `Squid` class and the Squid factory provider:
```ts
import { provideSquid } from '@squidcloud/angular';
import { Squid } from '@squidcloud/client';
```
* Add the `provideSquid` provider to your application's providers:
```ts
@NgModule({
  // ...
 providers: [
  {
     provide: Squid,
     useFactory: provideSquid({
       appId: environment.squidAppId,
       region: environment.squidRegion, 
     }),
    deps: [NgZone],
  },
],
// ...
```

The above configuration enables you to create more than one instance of `Squid` in the same Angular application.
For example, you can create two Squid instances in your Angular application:
```ts
export const usersSquidInjectionToken = new InjectionToken<Squid>('usersSquid');
export const billingSquidInjectionToken = new InjectionToken<Squid>('billingSquid');

@NgModule({
  // ...
 providers: [
  {
     provide: usersSquidInjectionToken,
     useFactory: provideSquid({
       appId: environment.squidAppId,
       region: environment.squidRegion, 
     }),
    deps: [NgZone],
  },
   {
     provide: billingSquidInjectionToken,
     useFactory: provideSquid({
       appId: environment.otherSquidAppId,
       region: environment.otherSquidRegion,
     }),
     deps: [NgZone],
   },
 ],
// ...
```

### Use Squid Client in your Angular Component
```ts
import { Component } from '@angular/core';
import { Squid } from '@squidcloud/client';

@Component({
  selector: 'my-component',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.css'],
})
export class MyComponent {
  constructor(private readonly squid: Squid) { }
  // ...
}
```

### Use Squid Client in your Angular Service
```ts
import { Injectable } from '@angular/core';
import { Squid } from '@squidcloud/client';

@Injectable({providedIn: 'root'})
export class MyService {
  constructor(private readonly squid: Squid) { }
  // ...
}
```

Alternatively, you can inject the `Squid` instance using an injection token in case it was provided using a token:
```ts
import { Injectable, Inject } from '@angular/core';
import { Squid } from '@squidcloud/client';
import { usersSquidInjectionToken } from './my.module';

@injectable({providedIn: 'root'})
export class MyService {
  constructor(@Inject(usersSquidInjectionToken) private readonly usersSquid: Squid) { }
  // ...
}
```

## API reference

Explore public API's available in the [Squid Cloud documentation](https://squid.cloud/docs).

---
