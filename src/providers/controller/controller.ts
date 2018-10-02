import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class ControllerProvider {

  constructor(private sqlite: SQLite) { }

}

export class Estacionamento {
  nome: string;
  valor: number;
  ativo: boolean;
}

export class Produto {
  nome: string;
  valor: number;
  quantidade: number;
  ativo: boolean;
}
