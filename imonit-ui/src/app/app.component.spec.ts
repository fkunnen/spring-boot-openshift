import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {By} from "@angular/platform-browser";

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  it('when email is filled in status is valid', () => {
    const status = fixture.debugElement.query(By.css('#status')).nativeElement;
    component.email.setValue('test@test.com');
    fixture.detectChanges();
    expect(status.textContent).toBe('VALID');
  });

  it('when email is invalid status is invalid', () => {
    const status = fixture.debugElement.query(By.css('#status')).nativeElement;
    component.email.setValue('test@@test.com');
    fixture.detectChanges();
    expect(status.textContent).toBe('INVALID');
  });
});
