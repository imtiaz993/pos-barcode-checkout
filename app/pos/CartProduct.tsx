const CartProduct = ({ product, products, setProducts }: any) => {
  const handleRemoveProduct = () => {
    setProducts(products.filter((i: any) => i.id !== product.id));
  };
  const handleIncreaseProductQuantity = () => {
    setProducts(
      products.map((i: any) => {
        if (i.id === product.id) {
          return { ...i, quantity: i.quantity + 1 };
        } else {
          return i;
        }
      })
    );
  };
  const handleDecreaseProductQuantity = () => {
    setProducts(
      products.map((i: any) => {
        if (i.id === product.id) {
          return { ...i, quantity: i.quantity - 1 };
        } else {
          return i;
        }
      })
    );
  };

  return (
    <div className="relative box-border p-5 transition-all before:content-[''] before:w-[90%] before:h-[2px] before:bg-black/20 before:absolute before:top-0 before:left-[5%]">
      <button
        onClick={handleRemoveProduct}
        title="remove product from cart"
        className="absolute top-4 right-[5%] w-4 h-4 bg-transparent bg-[url('/images/delete-icon.png')] bg-no-repeat bg-auto cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary hover:bg-[left_-17px] rounded-full"
      />
      <img
        src={
          (product?.images &&
            product?.images.length > 0 &&
            product?.images[0].src) ||
          ""
        }
        alt={
          (product?.images &&
            product?.images.length > 0 &&
            product?.images[0].alt) ||
          ""
        }
        className="inline-block align-middle w-20 h-auto mr-5"
      />
      <div className="inline-block align-middle w-[57%]">
        <p className="text-gray-100 m-0">{product?.name}</p>
        <p className="text-gray-500 m-0">Barcode: {product?.barcode}</p>
        <p className="text-gray-500 m-0 line-clamp-1">
          Description: {product?.description}
        </p>
        <p className="text-gray-500 m-0">Quantity: {product?.quantity}</p>
      </div>
      <div className="inline-block align-middle text-right w-[25%] text-secondary">
        <p>
          Price: $ {product?.price}{" "}
          <span className="ml-5">Tax: ${product?.tax_rate}</span>
        </p>
        <div>
          <button
            onClick={handleDecreaseProductQuantity}
            disabled={product?.quantity === 1}
            className="w-6 h-6 bg-black text-gray-400 border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary disabled:opacity-20"
          >
            -
          </button>
          <button
            onClick={handleIncreaseProductQuantity}
            className="w-6 h-6 bg-black text-gray-400 border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
