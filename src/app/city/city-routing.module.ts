import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityComponent } from './city.component';

const routes: Routes = [
  {
    path: '', component: CityComponent, children: [
      { path: '', loadChildren: () => import('./city-home/city-home.module').then(m => m.CityHomeModule) },
      { path: 'introduccion', loadChildren: () => import('./city-introduction/city-introduction.module').then(m => m.CityIntroductionModule) },
      { path: 'historia', loadChildren: () => import('./city-history/city-history.module').then(m => m.CityHistoryModule) },
      { path: 'argumentacion', loadChildren: () => import('./city-argument/city-argument.module').then(m => m.CityArgumentModule) },
      { path: 'contenido', loadChildren: () => import('./city-content/city-content.module').then(m => m.CityContentModule) },
      { path: 'objetivo', loadChildren: () => import('./city-objective/city-objective.module').then(m => m.CityObjectiveModule) },
      { path: 'recursos', loadChildren: () => import('./city-resources/city-resources.module').then(m => m.CityResourcesModule) },
      { path: 'configuracion', loadChildren: () => import('./city-configuration/city-configuration.module').then(m => m.CityConfigurationModule) },
      { path: 'cuestionario', loadChildren: () => import('./city-quizzes/city-quizzes.module').then(m => m.CityQuizzesModule) },
      { path: 'proyecto', loadChildren: () => import('./city-project/city-project.module').then(m => m.CityProjectModule) },
      { path: 'club-lectores', loadChildren: () => import('./city-lectures-club/city-lectures-club.module').then(m => m.CityLecturesClubModule) },
      { path: 'clubhouse', loadChildren: () => import('./city-clubhouse/city-clubhouse.module').then(m => m.CityClubhouseModule) },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class CityRoutingModule { }
