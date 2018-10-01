import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { Estacionamento } from '../../providers/controller/controller';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-estacionamento-detalhe',
  templateUrl: 'estacionamento-detalhe.html',
})
export class EstacionamentoDetalhePage {

  estacionamento: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, private sqlite: SQLite, public events: Events) {
    if (this.navParams.data.id) {
      this.buscar(this.navParams.data.id);
    } else {
      this.estacionamento = new Estacionamento();
    }
  }

  buscar(id) {
    this.sqlite.create({
      name: 'ticketdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM estacionamento WHERE id=?', [id]).then(res => {
        if(res.rows.length > 0) {
          this.estacionamento = res.rows.item(0);
        }
      }).catch(e => {
        this.alerta(e);
      });
    }).catch(e => {
      this.alerta(e);
    });
  }

  salvar() {
    let data: any = this.estacionamento;
    if(data.nome && data.valor) {
      this.sqlite.create({
        name: 'ticketdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        if(data.id){
          db.executeSql('UPDATE estacionamento SET nome=?,valor=?,ativo=? WHERE id=?',[data.nome, data.valor, data.ativo, data.id]).then(res => {
            this.events.publish('estacionamento');
            this.alerta('Registro atualizado com sucesso');
            this.navCtrl.pop();
          }).catch(e => {
            this.alerta(e);
          });
        }else{
          db.executeSql('INSERT INTO estacionamento VALUES(NULL,?,?,?)', [data.nome, data.valor, data.ativo]).then(res => {
            this.events.publish('estacionamento');
            this.alerta('Registro inserido com sucesso');
            this.navCtrl.pop();
          }).catch(e => {
            this.alerta(e);
          });
        }
      }).catch(e => {
        this.alerta(e);
      });
    }else{
      this.alerta('Preencha todos os campos');
    }
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

