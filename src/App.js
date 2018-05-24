import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import bolao from './bolao';

class App extends Component {
  state = {
      gerente: '',
      jogadores: [],
      total: '',
      aposta: ''
    };

    async componentDidMount() {
      const gerente = await bolao.methods.getGerente().call();
      const jogadores = await bolao.methods.getJogadores().call();
          const total = await web3.eth.getBalance(bolao.options.address);

      this.setState({ gerente, jogadores, total });
    }
    onSubmit = async event => {
     event.preventDefault();

     const accounts = await web3.eth.getAccounts();

     this.setState({ mensagem: 'Aguardando a confirmação da transação...' });

     await bolao.methods.entrar().send({
       from: accounts[0],
       value: web3.utils.toWei(this.state.aposta, 'ether')
     });

     this.setState({ mensagem: 'Você está dentro do bolão!' });
   };


  render() {
    //console.log(web3.version);
    //web3.eth.getAccounts().then(console.log);

    return (
      <div>
        <h2>Contrato do Bolão!</h2>
        <p>
          Este contrato é gerenciado por {this.state.gerente}.
        </p>
        <p>
          O contrato tem atualmente {this.state.jogadores.length} pessoa(s),
          competindo por {web3.utils.fromWei(this.state.total, 'ether')} ether!
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Quer tentar a sorte?</h4>
          <div>
            <label>Quantidade de ether apostada </label>
            <input
              value={this.state.aposta}
              onChange={event => this.setState({ aposta: event.target.value })}
            />
          </div>
          <button>Entrar no bolão</button>
        </form>

        <hr />

        <h1>{this.state.mensagem}</h1>

      </div>

    );
  }
}

export default App;
