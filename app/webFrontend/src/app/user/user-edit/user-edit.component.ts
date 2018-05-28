import {ChangeDetectorRef, Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {SnackBarService} from '../../shared/services/snack-bar.service';
import {UserDataService} from '../../shared/services/data.service';
import {IUser} from '../../../../../../shared/models/IUser';
import {UserService} from '../../shared/services/user.service';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {DialogService} from '../../shared/services/dialog.service';
import {TitleService} from '../../shared/services/title.service';
import {ThemeService} from '../../shared/services/theme.service';
import {emailValidator} from '../../shared/validators/validators';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {

    id: string;
    user: IUser;
    userForm: FormGroup;
    passwordPatternText: string;
    changePassword = false;
    themes: string[];

    constructor(private router: Router,
                private route: ActivatedRoute,
                private userService: UserService,
                private userDataService: UserDataService,
                private showProgress: ShowProgressService,
                private formBuilder: FormBuilder,
                public dialogService: DialogService,
                public snackBar: SnackBarService,
                private titleService: TitleService,
                private cdRef: ChangeDetectorRef,
                private themeService: ThemeService) {
        this.generateForm();
    }

    showPwFields() {
        if (this.user) {
            return this.userService.user._id === this.user._id;
        }
        return false;
    }

    ngOnInit() {
        this.titleService.setTitle('Edit User');
        this.route.params.subscribe(params => {
            this.id = decodeURIComponent(params['id']);
            if (this.id === 'undefined') {
                this.id = this.userService.user._id;
            }
        });
        this.themes = this.themeService.themes;
        this.getUserData();
    }

    ngOnDestroy() {
        this.cdRef.detach();
    }

    async getUserData() {
        try {
            const user = await this.userDataService.readSingleItem(this.id);
            this.user = <any>user;
            this.userForm.patchValue({
                profile: {
                    firstName: this.user.profile.firstName,
                    lastName: this.user.profile.lastName,
                    theme: (this.themes.indexOf(this.user.profile.theme) !== -1 ? this.user.profile.theme : 'default'),
                },
                email: this.user.email,
            });
            this.titleService.setTitleCut(['Edit User: ', this.user.profile.firstName]);
        } catch (err) {
            console.error(err);
            this.snackBar.open(err.error.message);
        }

        if (this.user.profile.picture) {
            this.userService.updateProfilePicture(this.user.profile.picture.path);
        }

        this.cdRef.detectChanges();
    }

    async onSubmit() {
        this.user = this.prepareSaveUser();
        await this.updateUser();
    }

    onCancel() {
        this.navigateBack();
    }

    prepareSaveUser(): IUser {
        const userFormModel = this.userForm.value;

        if (this.user.profile.picture) {
            userFormModel.profile['picture'] = this.user.profile.picture;
        }

        const saveIUser: IUser = {...this.user, ...userFormModel};

        saveIUser['currentPassword'] = this.user.password;

        return saveIUser;
    }

    async updateUser() {
        this.showProgress.toggleLoadingGlobal(true);
        try {
            const user = await this.userDataService.updateItem(this.user);
            this.snackBar.open('Profile successfully updated.');

            if (this.userService.isLoggedInUser(user)) {
                this.userService.setUser(user);
                this.userService.updateProfilePicture(user.profile.picture.path);
            }

            this.navigateBack();
        } catch (err) {
            this.snackBar.open(err.error.message);
        }
        this.showProgress.toggleLoadingGlobal(false);
    }

    generateForm() {
        this.userForm = this.formBuilder.group({
            profile: this.formBuilder.group({
                firstName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(64)])],
                lastName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(64)])],
                theme: [''],
            }),
            username: [''],
            email: ['', emailValidator],
            currentPassword: ['']
        });
    }

    async resetPassword() {
        const confirm = await this.dialogService.confirmUpdate('property', 'password', this.user.email).toPromise();
        if (!confirm) {
            return false;
        }
        this.user.password = this.generatePass(12);
        this.showProgress.toggleLoadingGlobal(true);
        try {
            await this.userDataService.updateItem(this.user);
            this.dialogService.info(
                'Password successfully updated',
                'Password for user ' + this.user.email + ' was updated to: \'' + this.user.password + '\''
            );
        } catch (err) {
            this.snackBar.open(err.error.message);
        }
        this.showProgress.toggleLoadingGlobal(false);
    }

    async openAddPictureDialog() {
        const response = await this.dialogService.upload(this.user).toPromise();

        if (response && response.success && response.user) {
            if (this.userService.isLoggedInUser(response.user)) {
                this.user = response.user;
                this.userService.setUser(response.user);
            }
        }
        this.getUserData();
    }

    private navigateBack() {
        // if (this.userService.isLoggedInUser(this.user)) {
        //   this.router.navigate(['/profile']);
        // } else {
        //   this.router.navigate(['/profile', this.user._id]);
        // }
    }

    private generatePass(length: number): string {
        let pass = '';
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?/$%&()[]{}';

        for (let i = 0; i < length; i++) {
            pass += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }

        return pass;
    }

    async openChangePasswordDialog() {
        const response = await this.dialogService.changePassword(this.user).toPromise();
    }
}
