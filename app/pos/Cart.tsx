import CartProducts from "./CartProducts";
import { useState } from "react";
import Payment from "./Payment";

const Cart = (props: any) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const { products, isOpen, openCart, closeCart, setProducts } = props;

  let total = { productQuantity: 0, totalPrice: 0 };
  products.map((i: any) => {
    total.productQuantity = total.productQuantity + i.quantity;
    total.totalPrice = total.totalPrice + i.price * i.quantity;
  });

  const handleCheckout = () => {
    if (total.productQuantity) {
      setShowCheckout(true);
    } else {
      alert("Add some product in the cart!");
    }
  };

  const handleToggleCart = (isOpen: boolean) => () =>
    isOpen ? closeCart() : openCart();

  return (
    <>
      {showCheckout ? <Payment setShowCheckout={setShowCheckout} price={total.totalPrice} /> : <></>}
      <div
        className={`sm:w-[450px] fixed top-0 w-full h-full bg-[#1b1a20] z-[100] transition-all duration-500 ${
          isOpen ? "right-0" : "-right-full sm:right-[-450px]"
        }`}
      >
        <button
          className={`absolute top-0  w-12 h-12 bg-[#1b1a20] text-white text-center leading-[50px] z-10 ${
            isOpen
              ? "bg-[#1b1a20]  left-0 sm:left-[-48px]"
              : "left-[-50px] sm:left-[-48px]"
          } hover:bg-black`}
          onClick={handleToggleCart(isOpen)}
        >
          {isOpen ? (
            <span>X</span>
          ) : (
            <div className="w-12 h-12 bg-[#1b1a20] p-2">
              <div
                className="w-7 h-7 relative bg-cover bg-center "
                style={{ backgroundImage: "url('/images/cart-icon.png')" }}
              ></div>
              <div className="absolute bottom-0 right-1 w-4 h-4 bg-white text-xs font-bold text-black rounded-full flex items-center justify-center">
                {total?.productQuantity}
              </div>
            </div>
          )}
        </button>

        <div className="h-full overflow-y-auto">
          <div className="text-white text-center py-12 flex justify-center">
            <div className="relative w-14 h-14 mb-2">
              <div
                className=" w-10 h-10 inline-block  bg-cover bg-center "
                style={{ backgroundImage: "url('/images/cart-icon.png')" }}
              ></div>
              <div className="absolute z-20 bottom-0 right-1 w-4 h-4 text-xs bg-white font-bold text-black rounded-full flex items-center justify-center">
                {total?.productQuantity}
              </div>
            </div>
            <span className="font-bold text-lg ml-4 mt-2">Cart</span>
          </div>

          <CartProducts products={products} setProducts={setProducts} />

          <div className="absolute bottom-0 w-full h-[200px] p-[5%] bg-[#1b1a20] cartFooterShadow">
            <p className="inline-block w-1/5 text-[#5b5a5e]">SUBTOTAL</p>
            <div className="inline-block w-4/5 text-right text-[#5b5a5e]">
              <p className="text-2xl text-secondary m-0">
                ${total?.totalPrice.toFixed(2)}
              </p>
            </div>
            <button
              className="w-full rounded-full bg-blue-600 text-white font-medium py-3  mt-10"
              onClick={handleCheckout}
              autoFocus
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
