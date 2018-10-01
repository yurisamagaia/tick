import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EstacionamentoDetalhePage } from './estacionamento-detalhe';

@NgModule({
  declarations: [
    EstacionamentoDetalhePage,
  ],
  imports: [
    IonicPageModule.forChild(EstacionamentoDetalhePage),
  ],
})
export class EstacionamentoDetalhePageModule {}
