import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EstacionamentoPage } from './estacionamento';

@NgModule({
  declarations: [
    EstacionamentoPage,
  ],
  imports: [
    IonicPageModule.forChild(EstacionamentoPage),
  ],
})
export class EstacionamentoPageModule {}
