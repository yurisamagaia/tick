import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProdutoPage } from '../pages/produto/produto';
import { ProdutoDetalhePage } from '../pages/produto-detalhe/produto-detalhe';
import { EstacionamentoPage } from '../pages/estacionamento/estacionamento';
import { EstacionamentoDetalhePage } from '../pages/estacionamento-detalhe/estacionamento-detalhe';
import { ConfiguracaoPage } from '../pages/configuracao/configuracao';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { ControllerProvider } from '../providers/controller/controller';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProdutoPage,
    ProdutoDetalhePage,
    EstacionamentoPage,
    EstacionamentoDetalhePage,
    ConfiguracaoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProdutoPage,
    ProdutoDetalhePage,
    EstacionamentoPage,
    EstacionamentoDetalhePage,
    ConfiguracaoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ControllerProvider,
    SQLite
  ]
})
export class AppModule {}
