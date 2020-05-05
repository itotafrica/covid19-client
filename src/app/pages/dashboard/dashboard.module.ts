import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {ComponentsModule} from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { AnimatedDigitComponent } from '../../components/animated/animated-digit.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


@NgModule({
  declarations: [
    DashboardComponent,
    AnimatedDigitComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ComponentsModule,
    TranslateModule,
    NgxSkeletonLoaderModule
  ]
})
export class DashboardModule {
}
