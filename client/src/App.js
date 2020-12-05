import React, { Component } from 'react';
import Contract from './contracts/Advertisement.json';
import getWeb3 from './getWeb3';

import Ads from './components/Ads';
import ChangeAds from './components/ChangeAds';

import './App.css';

const ipfsClient = require('ipfs-api');
const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
}); // leaving out the arguments will default to these values

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
  };

  getAd = async () => {
    const { accounts, contract } = this.state;
    const result = await contract.methods.getAd().call({ from: accounts[0] });
    this.setState({ ad: result });
  };

  getAdCount = async () => {
    const { accounts, contract } = this.state;
    const result = await contract.methods
      .getAdCount()
      .call({ from: accounts[0] });
    this.setState({ adCount: result });
  };

  getBalance = async () => {
    const { web3, accounts, contract } = this.state;
    const result = await contract.methods
      .getBalanceOfContract()
      .call({ from: accounts[0] });
    this.setState({ contractBalance: web3.utils.fromWei(result, 'ether') });
  };

  // interact methods

  changeAd = async (e, link, nameLink, value, img) => {
    e.preventDefault();
    console.log('sono in changeAd');
    console.log(img);
    const { web3, accounts, contract } = this.state;
    var imgHash;
    console.log('prima di add');

    if (img) {
      try {
        const postResponse = await ipfs.add(img);
        console.log('postResponse', postResponse);
        imgHash = postResponse[0].hash;
        await contract.methods.changeAd(link, nameLink, imgHash).send({
          from: accounts[0],
          value: web3.utils.toWei(value, 'ether'),
          gas: 1000000,
        });
        this.setInitialState();
      } catch (e) {
        console.log('Error: ', e);
      }
    } else {
      alert('No files submitted. Please try again.');
      console.log('ERROR: No data to submit');
    }
  };

  withdraw = async (amount) => {
    console.log('sono in withdraw');
    const { web3, accounts, contract, contractBalance } = this.state;
    if (amount >= contractBalance) return;
    console.log('prima');
    await contract.methods
      .withdraw(web3.utils.toWei(amount, 'ether'))
      .send({ from: accounts[0] });
    this.getBalance();
    this.setState({ withdrawAmount: 0 });
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
              <h4>Current balance: {this.state.contractBalance} ETH</h4>
              <p>How much do you want to withdraw?</p>
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
