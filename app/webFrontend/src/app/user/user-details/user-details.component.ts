import {Component, OnInit} from '@angular/core';
import {IUser} from '../../../../../../shared/models/IUser';
import {UserDataService} from '../../shared/services/data.service';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../models/User';
import {TitleService} from '../../shared/services/title.service';
import {BackendService} from "../../shared/services/backend.service";
import {saveAs} from 'file-saver/FileSaver';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  userId: string;
  user: IUser;

  constructor(private route: ActivatedRoute,
              public userService: UserService,
              public userDataService: UserDataService,
              private titleService: TitleService) {
  }

  ngOnInit() {
    this.titleService.setTitle('User');
    this.route.params.subscribe(params => {
      this.userId = decodeURIComponent(params['id']);

      if (this.userId === 'undefined') {
        this.userId = this.userService.user._id;
      }
    });
    this.getUserData();
  }

  getEditLink() {
    let link = '/profile';

    if (!this.userService.isLoggedInUser(this.user)) {
      link += `/${this.user._id}`;
    }

    link += '/edit';

    return link;
  }

  async getUserDetailsExportLink(){
    const response = <Response> await this.userDataService.exportData();
    saveAs(response.body, 'MyUserData.json');
    // @Todo: ProfileImage
  }

  getUserData() {
    this.userDataService.readSingleItem(this.userId)
      .then((user: any) => {
        this.user = new User(user);
        this.titleService.setTitleCut(['User: ', this.user.profile.firstName]);
      })
      .catch((error: any) => {
      });
  }
}
