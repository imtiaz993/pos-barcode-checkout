import CartProducts from "./CartProducts";

const Cart = (props: any) => {
  const { products, isOpen, openCart, closeCart, setProducts } = props;

  let total = { productQuantity: 0, totalPrice: 0 };
  products.map((i: any) => {
    total.productQuantity = total.productQuantity + i.quantity;
    total.totalPrice = total.totalPrice + i.price * i.quantity;
  });

  const handleCheckout = () => {
    if (total.productQuantity) {
      alert(`Checkout - Subtotal: ${total.totalPrice}`);
    } else {
      alert("Add some product in the cart!");
    }
  };

  const handleToggleCart = (isOpen: boolean) => () =>
    isOpen ? closeCart() : openCart();

  return (
    <div
      className={`fixed top-0 w-full h-full bg-primary z-[100] transition-all ${
        isOpen ? "right-0" : "-right-full"
      }`}
    >
      <button
        className={`absolute top-0  w-12 h-12 bg-primary text-white text-center leading-[50px] z-10 ${
          isOpen ? "bg-black left-0" : "left-[-50px]"
        } hover:brightness-90`}
        onClick={handleToggleCart(isOpen)}
      >
        {isOpen ? (
          <span>X</span>
        ) : (
          <div
            className="relative w-12 h-12 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/cart-icon.png')" }}
          >
            <div className="absolute bottom-0 right-1 w-4 h-4 bg-secondary text-xs font-bold text-black rounded-full flex items-center justify-center">
              {total?.productQuantity}
            </div>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="h-full overflow-y-auto">
          <div className="text-white text-center py-12">
            <div
              className="relative inline-block w-14 h-14 bg-cover bg-center mb-2"
              style={{ backgroundImage: "url('/images/cart-icon.png')" }}
            >
              <div className="absolute bottom-0 right-1 w-4 h-4 bg-secondary text-xs font-bold text-black rounded-full flex items-center justify-center">
                {total?.productQuantity}
              </div>
            </div>
            <span className="font-bold text-lg">Cart</span>
          </div>

          <CartProducts products={products} setProducts={setProducts} />

          <div className="absolute bottom-0 w-full h-48 p-5 bg-primary">
            <p className="inline-block w-1/5 text-gray-500">SUBTOTAL</p>
            <div className="inline-block w-4/5 text-right text-gray-500">
              <p className="text-2xl text-secondary m-0">{total?.totalPrice}</p>
            </div>
            <button
              className="w-full bg-black text-white uppercase py-3 mt-10 hover:bg-gray-900 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              onClick={handleCheckout}
              autoFocus
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
