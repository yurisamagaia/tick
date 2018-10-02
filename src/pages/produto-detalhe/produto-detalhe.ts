import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { Produto } from '../../providers/controller/controller';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-produto-detalhe',
  templateUrl: 'produto-detalhe.html',
})
export class ProdutoDetalhePage {

  produto: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, private sqlite: SQLite, public events: Events) {
    if (this.navParams.data.id) {
      this.buscar(this.navParams.data.id);
    } else {
      this.produto = new Produto();
    }
  }

  buscar(id) {
    this.sqlite.create({
      name: 'ticketdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM produto WHERE id=?', [id]).then(res => {
        if(res.rows.length > 0) {
          this.produto = res.rows.item(0);
        }
      }).catch(e => {
        this.alerta(JSON.stringify(e));
      });
    }).catch(e => {
      this.alerta(JSON.stringify(e));
    });
  }

  salvar() {
    let data: any = this.produto;
    if(data.nome && data.valor && data.quantidade) {
      this.sqlite.create({
        name: 'ticketdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        if(data.id){
          db.executeSql('UPDATE produto SET nome=?, valor=?, quantidade=?, ativo=? WHERE id=?',[data.nome, data.valor, data.quantidade, data.ativo, data.id]).then(res => {
            this.events.publish('produto');
            this.alerta('Registro atualizado com sucesso');
            this.navCtrl.pop();
          }).catch(e => {
            this.alerta(JSON.stringify(e));
          });
        }else{
          db.executeSql('INSERT INTO produto VALUES(NULL,?,?,?,?)', [data.nome, data.valor, data.quantidade, data.ativo]).then(res => {
            this.events.publish('produto');
            this.alerta('Registro inserido com sucesso');
            this.navCtrl.pop();
          }).catch(e => {
            this.alerta(JSON.stringify(e));
          });
        }
      }).catch(e => {
        this.alerta(JSON.stringify(e));
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
