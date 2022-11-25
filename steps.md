##
- ClientID ForgeApp Workshop: `YCgZJTw16ggjw0b3a4RnTNNcvEjOWeNo`
- ClientSecret ForgeApp Workshop: `934iR2HHPcSUb6n2`


## Create default app (with routing and css):
```powershell
ng new test-app --prefix daqs
? Would you like to add Angular routing? Yes
? Which stylesheet format would you like to use? CSS
```

## Add bootstrap:
See [documentation](https://getbootstrap.com/docs/5.2/components/accordion/).
```powershell
npm i bootstrap@5.2.2 --save
```

And add to the `styles.css`:
```css
@import "~bootstrap/dist/css/bootstrap.min.css";
```

## Start app
### Remove code in app.component
### Add some test to see working

## Add test component
Used to test principles of:
- bind data
- act on events and
- @Input()
- @Output()

```powershell
ng g c test
```

## Add app.component.html
```html
<PREFIX-test></PREFIX-test>
```

## Create button and label
```html
<button type="button">Press</button>
<div>Button pressed: </div>
```

### Add some custom and bootstrap style
```html
<button type="button" class="btn btn-success" style="width: 150px;">Press</button>
<div>Button pressed: </div>
```

## Add property title and show in html
In `test.component.ts`:
```ts
title: string = "Button press tester";
```

In `test.component.html`:
```html
<h2>Title: {{title}}</h2>
<button type="button" class="btn btn-success" >Press</button>
<div>Button pressed: </div>
```

## Count button presses
In `test.component.ts`:
```ts
  buttonClickCounter: number = 0;
  
  onButtonClicked(): void{
    this.buttonClickCounter++;
  }
```

In `test.component.html`:
```html
<button type="button" 
        class="btn btn-success" 
        style="width: 150px;"
        (click)="onButtonClicked()">Press</button>
<div>Button pressed: {{buttonClickCounter}}</div>
```

## Add multiplier text
### Add [(ngModel)]
In `test.component.html`:
```html
<div>Multiplier: 
    <input type="number" [(ngModel)]="multiplier" />
</div>
```

Note the error!!
```powershell
Error: src/app/test/test.component.html:3:26 - error NG8002: Can't bind to 'ngModel' since it isn't a known property of 'input'.
```

`ngModel` is defined in `FormsModule`, so we need to import it in the app.module.ts!

### Create getter / setter with backing field and default value
In `test.component.ts`: add setter with `console.log`
```ts
_multiplier: number = 1;

set multiplier(value: number) {
    console.log(value);
    this._multiplier= value;
}

get multiplier(): number{
    return this._multiplier;
}
```

## Show total
### Add getter for calculating totals
```ts
  get total(): number{
    return this._multiplier * this.buttonClickCounter;
  }
```
### Show totals calulation
```html
<div>{{multiplier}} x {{buttonClickCounter}} = {{total}}</div>
```

## Add @Input() as initial multiplier number
Add field and set in ngOnInit:
```ts
@Input() initalMultiplier: number = 0;

ngOnInit(): void {
    this.multiplier = this.initalMultiplier;
}
```

Set value from parent component `app.component.html`:
```html
<daqs-test [initalMultiplier]="5"></daqs-test>
```

## Add @Output() to display 'final' calulated value.
### Create Get Data button and event

```html
<button type="button" 
        class="btn btn-primary" 
        style="width: 150px;"
        (click)="onGetTotalClicked()">Get Total</button>
```

```ts
@Output() onGetTotal: EventEmitter<string> = new EventEmitter<string>();

onGetTotalClicked():void{
    this.onGetTotal.emit("Total is: " + this.total);
}
```

### Show in parent
```ts
  totalValue: string = "";

  onGetTotal(data: string):void{
    this.totalValue = data;
  }
```

```html
<div>The total is: {{totalValue}}</div>
```

## Hide 'The total is:' when not set
```ts
<div *ngIf="totalValue != ''">The total is: {{totalValue}}</div>
```



