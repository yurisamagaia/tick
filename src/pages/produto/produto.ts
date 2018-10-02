import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, ItemSliding } from 'ionic-angular';
import { ProdutoDetalhePage } from '../produto-detalhe/produto-detalhe';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-produto',
  templateUrl: 'produto.html',
})
export class ProdutoPage {

  venda: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private toastCtrl: ToastController, public events: Events) {
    events.subscribe('produto', () => {
      this.buscar();
    });
  }

  ionViewDidLoad() {
    this.buscar();
  }

  buscar() {
    this.sqlite.create({
      name: 'ticketdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM produto ORDER BY nome ASC', <any>{}).then(res => {
        this.venda = [];
        for(var i=0; i<res.rows.length; i++) {
          this.venda.push({ id: res.rows.item(i).id, nome: res.rows.item(i).nome, valor: res.rows.item(i).valor, ativo: res.rows.item(i).ativo});
        }
      }).catch(e => {
        this.alerta(e);
      });
    }).catch(e => {
      this.alerta(e);
    });
  }

  atualizar(item: ItemSliding, id, ativo) {
    (ativo === 'true' ? ativo = 'false' : ativo = 'true');
    this.sqlite.create({
      name: 'ticketdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('UPDATE produto SET ativo=? WHERE id=?',[ativo, id]).then(res => {
        this.events.publish('produto');
        this.alerta('Registro atualizado com sucesso');
      }).catch(e => {
        this.alerta(e);
      });
    }).catch(e => {
      this.alerta(e);
    });
  }

  deletar(id) {
    this.sqlite.create({
      name: 'ticketdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM produto WHERE id=?', [id]).then(res => {
        this.events.publish('produto');
        this.alerta('Registro deletado com sucesso');
      }).catch(e => {
        this.alerta(e);
      });
    }).catch(e => {
      this.alerta(e);
    });
  }

  adicionar() {
    this.navCtrl.push(ProdutoDetalhePage);
  }

  editar(id) {
    this.navCtrl.push(ProdutoDetalhePage, {id: id});
  }

  alerta(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  }
