import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

class App extends Component {
  state = {loaded:false, cost:0, itemName:'example1', itemAddress:'', identifierNo:0};

  componentDidMount = async () => {
    try { //
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      // this.deployedNetwork = ItemManagerContract.networks[networkId];
      
      this.itemManager = new this.web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[this.networkId] && ItemManagerContract.networks[this.networkId].address,
      );

      this.item = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[this.networkId] && ItemContract.networks[this.networkId].address,
      );

      

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToPaymentEvent();
      this.setState({ loaded:true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  listenToPaymentEvent = () => {
    let self = this;
    this.itemManager.events.SupplyChainStep().on("data",async function(evt){
      if(evt.returnValues._step == 1) {
        let item = await self.itemManager.methods.items(evt.returnValues._itemIndex).call();
        console.log('payment incoming ',item);
        alert("Item " + item._identifier + " was paid, deliver it now!");
      }
      console.log('Default Event : ',evt);
    });
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]:value
    });
  }

  handleSubmit = async() => {
    const { cost, itemName } = this.state;
    console.log('itemManager',this.itemManager);
    let result = await this.itemManager.methods.createItem(itemName,cost).send({from : this.accounts[0]});
    let itemAddress = result.events.SupplyChainStep.returnValues._address;
    console.log(result);
    let msg = 'Send '+cost+' wei to '+itemAddress;
    console.log(msg);
    alert(msg);
  }

  topUp = async() => {
    const { itemAddress, cost } = this.state;
    await this.web3.eth.sendTransaction({to:itemAddress,value:cost,from:this.accounts[0],gas:300000})
    console.log('Balance Added');
  }

  check = async() => {
    const { identifierNo } = this.state;
    let self = this;
    let item = await self.itemManager.methods.items(identifierNo).call();
    if(item._item != '0x0000000000000000000000000000000000000000'){
      let identifier = item._identifier;
      if(item._step == 1){
        console.log(identifier+' Paid');
      }else{
        console.log(identifier+' Not Paid');
      }
    }else{
      console.log('Invalid Block');
    }
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        {/* <h1>Event Trigger / Supply Chain</h1> */}
        <h2>Items</h2>
        <h2>Add Items</h2>
        Cost in wei : <input type='text' name='cost' value={this.state.cost} onChange={this.handleInputChange}/>
        Item Identifier : <input type='text' name='itemName' value={this.state.itemName} onChange={this.handleInputChange}/>
        <button type='button' onClick={this.handleSubmit}>Create New Item</button><br/><br/>
        Item Address[For Add only] : <input type='text' name='itemAddress' value={this.state.itemAddress} onChange={this.handleInputChange}/>
        <button type='button' onClick={this.topUp}>TopUp</button><br/><br/>
        Check Paid : <input type='text' name='identifierNo' value={this.state.identifierNo} onChange={this.handleInputChange}/>
        <button type='button' onClick={this.check}>Check is Paid</button><br/><br/>

      </div>
    );
  }
}

export default App;
