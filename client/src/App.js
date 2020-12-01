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
  };

  // get methods

  getCost = async () => {
    const { accounts, contract } = this.state;
    const result = await contract.methods.getCost().call({ from: accounts[0] });
    this.setState({ cost: result });
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
    const { accounts, contract } = this.state;
    const result = await contract.methods
      .getBalanceOfContract()
      .call({ from: accounts[0] });
    this.setState({ contractBalance: result });
    console.log(
      '🚀 ~ file: App.js ~ line 72 ~ App ~ getBalance= ~ contractBalance',
      this.state.contractBalance
    );
  };

  // interact methods

  changeAd = async (link, nameLink, value) => {
    const { accounts, contract } = this.state;
    await contract.methods
      .changeAd(link, nameLink)
      .send({ from: accounts[0], value: value });
  };

  withdraw = async (amount) => {
    const { web3, accounts, contract, contractBalance } = this.state;
    if (amount >= contractBalance) return;
    await contract.methods.withdraw(web3.toWei(amount, 'ether'));
    this.getBalance();
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="container">
        <div className="container2">
          <ChangeAds />
          <div className="manager">MANAGER</div>
        </div>
        <Ads ad={this.state.ad} />
      </div>
    );
  }
}

export default App;
