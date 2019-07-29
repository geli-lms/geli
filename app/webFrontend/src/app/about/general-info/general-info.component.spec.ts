import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {GeneralInfoComponent} from './general-info.component';
import {Contributor} from './contributor.model';
import {MaterialImportModule} from '../../shared/modules/material-import.module';

describe('GeneralInfoComponent', () => {
  let component: GeneralInfoComponent;
  let fixture: ComponentFixture<GeneralInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialImportModule
      ],
      declarations: [GeneralInfoComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compare contributors correct', () => {
    const testData = [
      { // Exactly the same
        a: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', Contributor.PRESENT),
        b: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', Contributor.PRESENT),
        res: 0
      },
      { // Firstname diff
        a: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', Contributor.PRESENT),
        b: new Contributor('FnX', 'Ln', '15SuSe', 'Tester', 'gh', Contributor.PRESENT),
        res: -1
      },
      { // Lastname diff
        a: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', Contributor.PRESENT),
        b: new Contributor('Fn', 'LnX', '15SuSe', 'Tester', 'gh', Contributor.PRESENT),
        res: -1
      },
      { // Position diff
        a: new Contributor('Fn', 'Ln', '15SuSe', 'AAAAAA', 'gh', Contributor.PRESENT),
        b: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', Contributor.PRESENT),
        res: 1
      },
      { // Github diff
        a: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'aa', Contributor.PRESENT),
        b: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', Contributor.PRESENT),
        res: 0
      },
      { // From diff | to present
        a: new Contributor('Fn', 'Ln', '14WiSe', 'Tester', 'gh', Contributor.PRESENT),
        b: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', Contributor.PRESENT),
        res: -1
      },
      { // From diff | to present | II
        a: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', Contributor.PRESENT),
        b: new Contributor('Fn', 'Ln', '14WiSe', 'Tester', 'gh', Contributor.PRESENT),
        res: 1
      },
      { // From same | to diff
        a: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', '16WiSe'),
        b: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', Contributor.PRESENT),
        res: 1
      },
      { // From same | to diff | II
        a: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', Contributor.PRESENT),
        b: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', '16SuSe'),
        res: -1
      },
      { // From same | to diff | both not present
        a: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', '16SuSe'),
        b: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', '16WiSe'),
        res: 1
      },
      { // Both diff
        a: new Contributor('Fn', 'Ln', '14SuSe', 'Tester', 'gh', '15SuSe'),
        b: new Contributor('Fn', 'Ln', '15SuSe', 'Tester', 'gh', '16WiSe'),
        res: 1
      },
    ];

    testData.forEach((value) => {
      expect(Contributor.compare(value.a, value.b)).toBe(value.res);
    });
  });
});
