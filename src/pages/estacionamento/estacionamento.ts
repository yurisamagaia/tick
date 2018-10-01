import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, ItemSliding } from 'ionic-angular';
import { EstacionamentoDetalhePage } from '../estacionamento-detalhe/estacionamento-detalhe';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-estacionamento',
  templateUrl: 'estacionamento.html',
})
export class EstacionamentoPage {

  estacionamento: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private toastCtrl: ToastController, public events: Events) {
    events.subscribe('estacionamento', () => {
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
      db.executeSql('SELECT * FROM estacionamento ORDER BY nome ASC', <any>{}).then(res => {
        this.estacionamento = [];
        for(var i=0; i<res.rows.length; i++) {
          this.estacionamento.push({ id: res.rows.item(i).id, nome: res.rows.item(i).nome, valor: res.rows.item(i).valor, ativo: res.rows.item(i).ativo});
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
      db.executeSql('UPDATE estacionamento SET ativo=? WHERE id=?',[ativo, id]).then(res => {
        this.events.publish('estacionamento');
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
      db.executeSql('DELETE FROM estacionamento WHERE id=?', [id]).then(res => {
        this.events.publish('estacionamento');
        this.alerta('Registro deletado com sucesso');
      }).catch(e => {
        this.alerta(e);
      });
    }).catch(e => {
      this.alerta(e);
    });
  }
  
  adicionar() {
    this.navCtrl.push(EstacionamentoDetalhePage);
  }

  editar(id) {
    this.navCtrl.push(EstacionamentoDetalhePage, {id: id});
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
