import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class ControllerProvider {

  estacionamento: any = [];
  totalIncome = 0;
  totalExpense = 0;
  balance = 0;

  constructor(private sqlite: SQLite) {
    console.log('Hello ControllerProvider Provider');
  }

  getData() {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: 'ticketdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        
        db.executeSql('SELECT * FROM estacionamento ORDER BY id DESC', <any>{}).then(res => {
          this.estacionamento = [];
          for(var i=0; i<res.rows.length; i++) {
            this.estacionamento.push({ id: res.rows.item(i).id, nome: res.rows.item(i).nome, valor: res.rows.item(i).valor, ativo: res.rows.item(i).ativo});
          }
          resolve(this.estacionamento);
        }).catch(e => reject(e));

        /*db.executeSql('SELECT SUM(amount) AS totalIncome FROM expense WHERE type="Income"', <any>{}).then(res => {
          if(res.rows.length>0) {
            this.totalIncome = parseInt(res.rows.item(0).totalIncome);
            this.balance = this.totalIncome-this.totalExpense;;
          }
        }).catch(e => console.log(e));*/

      }).catch(e => reject(e));
    });
  }

  estacionamentoSave(data) {
    this.sqlite.create({
      name: 'ticketdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS estacionamento(id INTEGER PRIMARY KEY, nome TEXT, valor TEXT, ativo TEXT)', <any>{}).then(res => console.log('Tabela criada')).catch(e => console.log(e));
      db.executeSql('INSERT INTO estacionamento VALUES(NULL,?,?,?)', [data.nome, data.valor, data.ativo]).then(res => {
        //return res;
        console.log(JSON.stringify(res));
      }).catch(e => {
        //return e;
        console.log(JSON.stringify(e));
      });
    }).catch(e => {
      return e;
    });
  }

  getCurrentData(id) {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: 'ticketdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM estacionamento WHERE id=?', [id]).then(res => {
          //this.estacionamento = [];
          if(res.rows.length > 0) {
            //console.log(JSON.stringify(res.rows.item(0)))
            resolve(res.rows.item(0));
            /*this.data.rowid = res.rows.item(0).rowid;
            this.data.date = res.rows.item(0).date;
            this.data.type = res.rows.item(0).type;
            this.data.description = res.rows.item(0).description;
            this.data.amount = res.rows.item(0).amount;*/
          }
        }).catch(e => {
          reject(e);
        });
      }).catch(e => {
        reject(e);
      });
    });
  }
}

export class Estacionamento {
  nome: string;
  valor: number;
  ativo: boolean;
}

/*
getCurrentData(rowid) {
  this.sqlite.create({
    name: 'ticketdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('SELECT * FROM estacionamento WHERE id=?', [rowid]).then(res => {
      if(res.rows.length > 0) {
        this.data.rowid = res.rows.item(0).rowid;
        this.data.date = res.rows.item(0).date;
        this.data.type = res.rows.item(0).type;
        this.data.description = res.rows.item(0).description;
        this.data.amount = res.rows.item(0).amount;
      }
    }).catch(e => {
      this.toast.show(e, '5000', 'center').subscribe( toast => { console.log(toast); });
    });
  }).catch(e => {
    this.toast.show(e, '5000', 'center').subscribe( toast => { console.log(toast); });
  });
}

updateData() {
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('UPDATE expense SET date=?,type=?,description=?,amount=? WHERE rowid=?',[this.data.date,this.data.type,this.data.description,this.data.amount,this.data.rowid])
      .then(res => {
        this.toast.show('Data updated', '5000', 'center').subscribe( toast => { this.navCtrl.popToRoot(); });
      }).catch(e => {
        this.toast.show(e, '5000', 'center').subscribe( toast => { console.log(toast); });
      });
  }).catch(e => {
    this.toast.show(e, '5000', 'center').subscribe( toast => { console.log(toast); });
  });
}
*/