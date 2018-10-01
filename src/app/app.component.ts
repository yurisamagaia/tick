import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { HomePage } from '../pages/home/home';
import { EstacionamentoPage } from '../pages/estacionamento/estacionamento';
import { ConfiguracaoPage } from '../pages/configuracao/configuracao';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private sqlite: SQLite) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Estacionamento', component: EstacionamentoPage },
      { title: 'Configurações', component: ConfiguracaoPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.tables();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  tables() {
    this.sqlite.create({
      name: 'ticketdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      //db.executeSql('DROP TABLE IF EXISTS estacionamento', <any>{}).then(res => console.log('Tabela Deletada')).catch(e => console.log(e));
      db.executeSql("CREATE TABLE IF NOT EXISTS estacionamento(id INTEGER PRIMARY KEY, nome TEXT, valor NUMERIC, ativo TEXT)", <any>{}).then(res => console.log('Tabela criada')).catch(e => console.log(e));
      db.executeSql("CREATE TABLE IF NOT EXISTS configuracao(id INTEGER PRIMARY KEY, evento TEXT, impressao_ticket TEXT, segunda_via TEXT, placa TEXT, observacoes TEXT, operador TEXT, vendas TEXT, estacionamento TEXT, totais TEXT, dinheiro TEXT, cartao TEXT, senha_adm TEXT, senha_root TEXT)", <any>{}).then(res => console.log('Tabela criada')).catch(e => console.log(e));
    }).catch(e => {
      console.log(e);
    });
  }
}
