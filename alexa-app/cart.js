
const OrderItem = require("./orderitem.js");

class Cart {

  constructor(cart){
    if(cart) {
      this.items = cart.items;
      this.totalPrice = this.calculateTotal();
    }
  }

  addItem(item){
    if(!this.items){
      this.items = [];
    }
    this.items.push(item)
    this.totalPrice = this.calculateTotal(this.items);
  }

  getItems(){
    return this.items;
  }

  calculateTotal(items){
    var totalPrice = 0;
    for(var i=0; i <= items.length -1; i++){
      totalPrice = totalPrice + items[i].getAmount();
    }
    this.totalPrice = totalPrice;
    return totalPrice;
  }

  getTotalPrice(){
    return this.totalPrice;
  }

}


module.exports = Cart
