import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CourseDetailComponent} from '../course/course-detail/course-detail.component';

const routes: Routes = [
  {path: 'course/:id', component: CourseDetailComponent},
  {path: 'lecture/:id', component: CourseDetailComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule {}
