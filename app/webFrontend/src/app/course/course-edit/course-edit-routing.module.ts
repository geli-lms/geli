import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CourseEditComponent} from './course-edit.component';
import {AuthGuardService} from '../../shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CourseEditComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']}
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CourseEditRoutingModule {
}
