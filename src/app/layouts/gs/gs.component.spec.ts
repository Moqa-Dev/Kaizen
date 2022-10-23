import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GSComponent } from './gs.component';

describe('GSComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        GSComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(GSComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Kaizen'`, () => {
    const fixture = TestBed.createComponent(GSComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Kaizen');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(GSComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('Kaizen app is running!');
  });
});
