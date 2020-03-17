pragma solidity ^0.6;

import './Ownable.sol';
import './Item.sol';

contract ItemManager is Ownable {

    enum supplyChainState{created, paid, delivered}

    event supplyChainStep(uint _itemIndex, uint _step, address _itemAddress);

    struct S_Item{
        Item item;
        string _identiier;
        uint _itemPrice;
        ItemManager.supplyChainState _state;
    }

    mapping(uint => S_Item) public items;
    uint itemIndex;

    function createItem(string memory identifier, uint itemPrice) public onlyOwner{
        Item item = new Item(this,itemPrice,itemIndex);
        items[itemIndex].item = item;
        items[itemIndex]._identiier = identifier;
        items[itemIndex]._itemPrice = itemPrice;
        items[itemIndex]._state = supplyChainState.created;
        emit supplyChainStep(itemIndex,uint(items[itemIndex]._state),address(item));
        itemIndex++;
    }

    function triggerPayment(uint _itemIndex) public payable{
        require(items[_itemIndex]._itemPrice == msg.value,'Only full payments accepted');
        require(items[_itemIndex]._state == supplyChainState.created,'Item is further in the chain');
        items[itemIndex]._state = supplyChainState.paid;
        emit supplyChainStep(itemIndex,uint(items[_itemIndex]._state),address(items[_itemIndex].item));
    }

    function triggerDelivery(uint _itemIndex) public onlyOwner{
        require(items[_itemIndex]._state == supplyChainState.paid,'Item is further in the chain');
        items[_itemIndex]._state = supplyChainState.delivered;
        emit supplyChainStep(_itemIndex,uint(items[_itemIndex]._state),address(items[_itemIndex].item));
    }
}