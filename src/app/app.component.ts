import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { HomePage } from '../pages/home/home';
import { ProdutoPage } from '../pages/produto/produto';
import { EstacionamentoPage } from '../pages/estacionamento/estacionamento';
import { ConfiguracaoPage } from '../pages/configuracao/configuracao';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, icon: string, pass: boolean}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private sqlite: SQLite, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.initializeApp();

    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home', pass: false },
      { title: 'Produtos', component: ProdutoPage, icon: 'cart', pass: true },
      { title: 'Estacionamento', component: EstacionamentoPage, icon: 'car', pass: true },
      { title: 'Configurações', component: ConfiguracaoPage, icon: 'settings', pass: true }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.tables();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {

    this.sqlite.create({
      name: 'ticketdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM configuracao ORDER BY id DESC', []).then(res => {
        if(res.rows.length > 0) {
          if(page.pass === true) {
            if((page.component === ConfiguracaoPage) || (page.component === ProdutoPage && res.rows.item(0).vendas === 'false') || (page.component === EstacionamentoPage && res.rows.item(0).estacionamento === 'false')) {
              let alert = this.alertCtrl.create({
                title: 'Senha de acesso',
                inputs: [{
                  name: 'senha',
                  placeholder: 'Senha de acesso',
                  type: 'password'
                }],
                buttons: [{
                  text: 'Cancelar',
                  role: 'cancel'
                },{
                  text: 'Confirmar',
                  handler: data => {
                    if(data.senha === res.rows.item(0).senha_adm || data.senha === res.rows.item(0).senha_root){
                      this.nav.setRoot(page.component);
                    }else{
                      this.alerta('Senha não confere');
                      this.openPage(page);
                    }
                  }
                }]
              });
              alert.present();
            }else{
              this.nav.setRoot(page.component);
            }
          }else{
            this.nav.setRoot(page.component);
          }
        }else{
          this.alerta('Erro no BD, nenhum registro encontrado');
        }
      }).catch(e => {
        this.alerta(JSON.stringify(e));
      });
    }).catch(e => {
      this.alerta(JSON.stringify(e));
    });
  }

  alerta(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  tables() {
    this.sqlite.create({
      name: 'ticketdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      //db.executeSql('DROP TABLE IF EXISTS estacionamento', <any>{}).then(res => console.log('Tabela Deletada')).catch(e => console.log(e));
      db.executeSql("CREATE TABLE IF NOT EXISTS produto(id INTEGER PRIMARY KEY, nome TEXT, valor NUMERIC, quantidade INTEGER, ativo TEXT)", <any>{}).then(res => console.log('Tabela criada')).catch(e => console.log(e));
      db.executeSql("CREATE TABLE IF NOT EXISTS estacionamento(id INTEGER PRIMARY KEY, nome TEXT, valor NUMERIC, ativo TEXT)", <any>{}).then(res => console.log('Tabela criada')).catch(e => console.log(e));
      db.executeSql("CREATE TABLE IF NOT EXISTS configuracao(id INTEGER PRIMARY KEY, evento TEXT, impressao_ticket TEXT, segunda_via TEXT, placa TEXT, observacoes TEXT, operador TEXT, vendas TEXT, estacionamento TEXT, totais TEXT, dinheiro TEXT, cartao TEXT, senha_adm TEXT, senha_root TEXT)", <any>{}).then(res => console.log('Tabela criada')).catch(e => console.log(e));
    }).catch(e => {
      console.log(e);
    });
  }
}
