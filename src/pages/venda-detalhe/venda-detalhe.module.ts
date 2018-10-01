import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendaDetalhePage } from './venda-detalhe';

@NgModule({
  declarations: [
    VendaDetalhePage,
  ],
  imports: [
    IonicPageModule.forChild(VendaDetalhePage),
  ],
})
export class VendaDetalhePageModule {}
