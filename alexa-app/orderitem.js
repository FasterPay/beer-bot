
class OrderItem {

  constructor(itemName, rate, quantity){
    this.setItemName(itemName);
    this.setQuantity(quantity);
    this.setAmount(rate, quantity);
  }

  getItemName(){
    return this.itemName;
  }

  setItemName(itemName){
    this.itemName = itemName;
  }

  getAmount(){
    return this.amount;
  }

  setAmount(rate, quantity){
    this.amount = (rate * quantity);
  }

  getQuantity(){
    return this.quantity;
  }

  setQuantity(quantity){
    this.quantity = quantity;
  }

}

module.exports = OrderItem
