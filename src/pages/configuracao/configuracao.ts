import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-configuracao',
  templateUrl: 'configuracao.html',
})
export class ConfiguracaoPage {

  configuracao: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, private alertCtrl: AlertController, private sqlite: SQLite) {
  }

  ionViewDidLoad() {
    this.buscar();
  }

  buscar() {
    this.sqlite.create({
      name: 'ticketdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM configuracao ORDER BY id DESC', []).then(res => {
        if(res.rows.length > 0) {
          this.configuracao = res.rows.item(0);
        }
        console.log(JSON.stringify(this.configuracao));
      }).catch(e => {
        this.alerta(e);
      });
    }).catch(e => {
      this.alerta(e);
    });
  }

  salvar() {
    let data: any = this.configuracao;
    this.sqlite.create({
      name: 'ticketdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      if(data.senha_antiga || data.senha_nova || data.senha_confirma) {
        if(data.senha_antiga && data.senha_nova && data.senha_confirma) {
          if(data.senha_antiga === this.configuracao.senha_adm) {
            db.executeSql('UPDATE configuracao SET senha_adm=? WHERE id=?',[data.senha_adm, data.id]).then(res => {
              this.alerta('Registro atualizado com sucesso');
              this.buscar();
            }).catch(e => {
              this.alerta(JSON.stringify(e));
            });
          }else{
            this.alerta('Senha antiga não confere');
          }
        }else{
          this.alerta('Prencha todos os campos de senha');
        }
      }
      if(data.id) {
        db.executeSql('UPDATE configuracao SET evento=?, impressao_ticket=?, segunda_via=?, placa=?, observacoes=?, operador=?, vendas=?, estacionamento=?, totais=?, dinheiro=?, cartao=? WHERE id=?',[data.evento, data.impressao_ticket, data.segunda_via, data.placa, data.observacoes, data.operador, data.vendas, data.estacionamento, data.totais, data.dinheiro, data.cartao, data.id]).then(res => {
          this.alerta('Registro atualizado com sucesso');
          this.buscar();
        }).catch(e => {
          this.alerta(JSON.stringify(e));
        });
      }else{
        db.executeSql('INSERT INTO configuracao VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?,?,?)', [data.evento, data.impressao_ticket, data.segunda_via, data.placa, data.observacoes, data.operador, data.vendas, data.estacionamento, data.totais, data.dinheiro, data.cartao, data.senha_adm, data.senha_root]).then(res => {
          this.alerta('Registro inserido com sucesso');
        }).catch(e => {
          this.alerta(JSON.stringify(e));
        });
      }
    }).catch(e => {
      this.alerta(e);
    });
  }

  alterarSenha() {
    let alert = this.alertCtrl.create({
      title: 'Recuperar Senha',
      inputs: [{
          name: 'senha_antiga',
          placeholder: 'Senha Antiga',
          type: 'password'
        },{
          name: 'senha_nova',
          placeholder: 'Senha Nova',
          type: 'password'
        },{
          name: 'senha_confirma',
          placeholder: 'Confirmar Senha Nova',
          type: 'password'
        }],
      buttons: [{
          text: 'Cancelar',
          role: 'cancel'
        },{
          text: 'Alterar',
          handler: data => {
            this.sqlite.create({
              name: 'ticketdb.db',
              location: 'default'
            }).then((db: SQLiteObject) => {
              if(data.senha_antiga || data.senha_nova || data.senha_confirma) {
                if(data.senha_antiga && data.senha_nova && data.senha_confirma) {
                  if(data.senha_nova === data.senha_confirma){
                    if(data.senha_antiga === this.configuracao.senha_adm) {
                      db.executeSql('UPDATE configuracao SET senha_adm=? WHERE id=?',[data.senha_nova, this.configuracao.id]).then(res => {
                        this.alerta('Senha atualizada com sucesso');
                        this.buscar();
                      }).catch(e => {
                        this.alerta(JSON.stringify(e));
                      });
                    }else{
                      this.alerta('Senha antiga não confere');
                      this.alterarSenha();
                    }
                  }else{
                    this.alerta('Senhas não conferem');
                    this.alterarSenha();
                  }
                }else{
                  this.alerta('Prencha todos os campos');
                  this.alterarSenha();
                }
              }
            }).catch(e => {
              this.alerta(JSON.stringify(e));
            });
          }
        }]
    });
    alert.present();
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
