# Angular For Squid Cloud

A library for integrating [Squid Cloud](https://squid.cloud) with an Angular application.

## Features

* Angular module and provider for initializing and injecting the Squid Client SDK

## Getting started

### Requirements

This project only supports the [actively supported versions of Angular as stated in the Angular documentation](https://angular.io/guide/releases#actively-supported-versions). Whilst other versions might be compatible they are not actively supported.

### Installation

Using npm:

```
npm install @squidcloud/angular
```

### Configure Squid Cloud

Create an **Application** using the [Squid Cloud Console](https://console.squid.cloud).
* In your Angular root module, import the `SquidModule` and configure it with your Squid Cloud application ID and region:
```typescript
import { SquidModule } from '@squidcloud/angular';
// ...
@NgModule({
  // ...
  imports: [
    SquidModule.forRoot({
      appId: <YOUR_APP_ID>,
      region: <YOUR SQUID REGION>,
    }),
  ],
// ...
```
When running against a local Squid instance, you can use the `Local` region.
* If you're using an existing application, just reuse the existing application's ID.

The above will provide a `Squid` instance that you can inject in different services and components of your application.

Alternatively, you can provide the Squid instance using a factory function:
* Import the `Squid` class and the Squid factory provider:
```typescript
import { provideSquid } from '@squidcloud/angular';
import { Squid } from '@squidcloud/client';
```
* Add the `provideSquid` provider to your application's providers:
```typescript
@NgModule({
  // ...
 providers: [
  {
     provide: Squid,
     useFactory: provideSquid({
       appId: <YOUR_APP_ID>,
       region: <YOUR SQUID REGION>, 
     }),
    deps: [NgZone],
  },
],
// ...
```

The above configuration enables you to create more than one instance of `Squid` in the same Angular application.
For example, you can create two Squid instances in your Angular application:
```typescript
export const usersSquidInjectionToken = new InjectionToken<Squid>('usersSquid');
export const billingSquidInjectionToken = new InjectionToken<Squid>('billingSquid');

@NgModule({
  // ...
 providers: [
  {
     provide: usersSquidInjectionToken,
     useFactory: provideSquid({
       appId: <YOUR_APP_ID>,
       region: <YOUR SQUID REGION>,
     }),
    deps: [NgZone],
  },
   {
     provide: billingSquidInjectionToken,
     useFactory: provideSquid({
       appId: <YOUR_APP_ID>,
       region: <YOUR SQUID REGION>,
     }),
     deps: [NgZone],
   },
 ],
// ...
```

### Use Squid Client in your Angular Component
```typescript
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
```typescript
import { Injectable } from '@angular/core';
import { Squid } from '@squidcloud/client';

@Injectable({providedIn: 'root'})
export class MyService {
  constructor(private readonly squid: Squid) { }
  // ...
}
```

Alternatively, you can inject the `Squid` instance using an injection token in case it was provided using a token:
```typescript
import { Injectable, Inject } from '@angular/core';
import { Squid } from '@squidcloud/client';
import { usersSquidInjectionToken } from './my.module';

@injectable({providedIn: 'root'})
export class MyService {
  constructor(@Inject(usersSquidInjectionToken) private readonly usersSquid: Squid) { }
  // ...
}
```

A full working example of a component using Squid:

```typescript
import {Component} from '@angular/core';
import {Squid} from '@squidcloud/client';
import {map} from 'rxjs';

// Define your type
type User = { id: string, email: string, age: number };

@Component({
  selector: 'my-component',
  template: `
    <ul>
      <li *ngFor="let user of users | async">
        {{ user.email }}
      </li>
    </ul>
    <br/>
    <button (click)="createNewUser()">Create user</button>`,
})
export class MyComponent {
  // Subscribe to data
  users = this.squid
    .collection<User>('Users')
    .query()
    .where('age', '>', 18)
    .snapshots()
    .pipe(
      map((users) => users.map((user) => user.data()))
    );

  constructor(private readonly squid: Squid) {
  }

  // Insert data
  async createNewUser(): Promise<void> {
    const userId = crypto.randomUUID();
    const email = `${userId}@gmail.com`;
    await this.squid.collection<User>('Users').doc(userId).insert({
      id: userId,
      email,
      age: Math.floor(Math.random() * 100)
    });
  }
}
```

## API reference

Explore public APIs available in the [Squid Cloud documentation](https://squid.cloud/docs).
---
