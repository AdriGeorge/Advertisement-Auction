import React, { Component } from 'react';
import Contract from './contracts/Advertisement.json';
import getWeb3 from './getWeb3';

import Ads from './components/Ads';
import ChangeAds from './components/ChangeAds';

import './App.css';

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    cost: 0,
    ad: {},
    contractBalance: 0,
    adCount: 1,
    withdrawAmount: 0,
    owner: null,
  };
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Contract.networks[networkId];
      const instance = new web3.eth.Contract(
        Contract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        { web3, accounts, contract: instance },
        this.setInitialState
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  setInitialState = async () => {
    this.getAd();
    this.getBalance();
    this.getAdCount();
    this.getCost();
    this.getOwner();
  };

  // get methods

  getOwner = async () => {
    const { accounts, contract } = this.state;
    const result = await contract.methods
      .getOwner()
      .call({ from: accounts[0] });
    this.setState({ owner: result });
    console.log(this.state.owner);
  };

  getCost = async () => {
    const { web3, accounts, contract } = this.state;
    var result = await contract.methods.getCost().call({ from: accounts[0] });
    result = web3.utils.fromWei(result, 'ether');
    this.setState({ cost: parseFloat(result) });
    console.log(
      '🚀 ~ file: App.js ~ line 51 ~ App ~ getCost= ~ cost',
      this.state.cost
    );
  };

  getAd = async () => {
    const { accounts, contract } = this.state;
    const result = await contract.methods.getAd().call({ from: accounts[0] });
    this.setState({ ad: result });
    console.log(
      '🚀 ~ file: App.js ~ line 58 ~ App ~ getAd= ~ ad',
      this.state.ad
    );
  };

  getAdCount = async () => {
    const { accounts, contract } = this.state;
    const result = await contract.methods
      .getAdCount()
      .call({ from: accounts[0] });
    this.setState({ adCount: result });
    console.log(
      '🚀 ~ file: App.js ~ line 65 ~ App ~ getAdCount= ~ adCount',
      this.state.adCount
    );
  };

  getBalance = async () => {
    const { web3, accounts, contract } = this.state;
    const result = await contract.methods
      .getBalanceOfContract()
      .call({ from: accounts[0] });
    this.setState({ contractBalance: web3.utils.fromWei(result, 'ether') });
    console.log(
      '🚀 ~ file: App.js ~ line 72 ~ App ~ getBalance= ~ contractBalance',
      this.state.contractBalance
    );
  };

  // interact methods

  changeAd = async (e, link, nameLink, value) => {
    e.preventDefault();
    console.log('sono qua');
    const { web3, accounts, contract } = this.state;

    await contract.methods.changeAd(link, nameLink).send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
      gas: 1000000,
    });
    this.setInitialState();
  };

  withdraw = async (amount) => {
    const { web3, accounts, contract, contractBalance } = this.state;
    if (amount >= contractBalance) return;
    console.log('prima');
    await contract.methods
      .withdraw(web3.utils.toWei(amount, 'ether'))
      .send({ from: accounts[0] });
    this.getBalance();
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="container">
        <div className="container2">
          <ChangeAds changeAd={this.changeAd} cost={this.state.cost} />
          {this.state.owner === this.state.accounts[0] ? (
            <div className="manager">
              <p>
                <h4>Current balance: {this.state.contractBalance} ETH</h4> How
                much do you want to withdraw?
              </p>
              <input
                className="input-withdraw"
                type="number"
                step="0.1"
                min="0.1"
                max={this.state.contractBalance}
                id="amount"
                value={this.state.withdrawAmount}
                name="amount"
                onChange={(e) =>
                  this.setState({ withdrawAmount: e.target.value })
                }
              ></input>
              <button
                className="btn withdraw"
                onClick={() => this.withdraw(this.state.withdrawAmount)}
              >
                Withdraw
              </button>
            </div>
          ) : (
            <p>ciao</p>
          )}
        </div>
        <Ads ad={this.state.ad} />
      </div>
    );
  }
}

export default App;
