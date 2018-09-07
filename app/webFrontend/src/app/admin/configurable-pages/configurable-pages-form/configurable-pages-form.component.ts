import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IConfig} from '../../../../../../../shared/models/IConfig';
import {ConfigService} from '../../../shared/services/data.service';
import {MarkdownService} from '../../../shared/services/markdown.service';
import {errorCodes} from '../../../../../../../api/src/config/errorCodes';
import {SnackBarService} from '../../../shared/services/snack-bar.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserRoleDropdownComponent} from '../../user-role-dropdown/user-role-dropdown.component';
import {PathErrorStateMatcher} from './path-error-state-matcher';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PageService} from '../../../shared/services/data/page.service';
import {IPage} from '../../../../../../../shared/models/IPage';
import {Page} from '../../../models/Page';
import {isUndefined} from 'util';

@Component({
  selector: 'app-configurable-pages-form',
  templateUrl: './configurable-pages-form.component.html',
  styleUrls: ['./configurable-pages-form.component.scss']
})
export class ConfigurablePagesFormComponent implements OnInit {
  pageForm: FormGroup;
  selectedRole: string;

  config: IConfig;
  text: string;
  @Input() type: string;
  @Input() headingType: string;
  @Input() page: IPage;
  @Output() save: EventEmitter<any>;
  @Output() cancel: EventEmitter<any>;

  private additionalOptions: string[] = ['public'];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private mdService: MarkdownService,
              private snackBar: SnackBarService,
              private formBuilder: FormBuilder,
              private service: ConfigService,
              private pageService: PageService) {
    this.text = '';
    this.save = new EventEmitter<any>();
    this.cancel = new EventEmitter<any>();
  }

  ngOnInit() {
    if (!this.page) {
      this.page = new Page();
    }

    this.generateForm();
    this.text = this.page.content;
    if (this.page._id) {
      this.pageForm.patchValue({
        path: this.page.path,
        language: this.page.language,
        accessLevel: this.page.accessLevel,
        title: this.page.title,
        content: this.page.content
      });
    }
  }

  async loadConfig() {
    try {
      this.config = <IConfig><any> await this.service.readSingleItem(this.type);
      this.text = this.config.value;
    } catch (error) {
      this.text = '';
    }
  }

  async onSave(markdown: string) {
    /*
    try {
      await this.service.updateItem({_id: this.type, data: markdown});
      this.snackBar.open(this.headingType + ' saved');
    } catch (err) {
      this.snackBar.open(errorCodes.save.couldNotSaveLegalnotice.text);
    }
    void this.loadConfig();
    */

    this.page = {
      ...this.pageForm.value,
      content: markdown
    };

    if (!this.page._id) {
      try {
        this.page = await this.pageService.createItem(this.page);
        this.save.emit(this.page);
        const debug = 0;
      } catch (error) {
        this.snackBar.open(error);
      }
    }
  }

  onCancel() {
    this.cancel.emit(this.page);
  }

  generateForm() {
    this.pageForm = this.formBuilder.group({
      path: ['', Validators.compose([Validators.required, this.validatePathExists.bind(this), this.validatePathComplex.bind(this)])],
      language: ['de', Validators.required],
      title: [''],
      content: ['']
    });
  }

  validatePathExists(control: FormControl) {
    const pathValue: string = control.value;

    const routerConfig = this.router.config;
    const filteredConfig = routerConfig.filter((route) => {
      if (route.path === pathValue) {
        return true;
      }
      return false;
    });

    if (pathValue.length > 0 && filteredConfig.length > 0) {
      return {pathExists: true};
    }

    return null;
  }

  validatePathComplex(control: FormControl) {
    const pathValue: string = control.value;

    if (pathValue.indexOf('/') !== -1) {
      return {complexPath: true};
    }

    return null;
  }
}
