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
    <div className="relative box-border p-[5%] transition-all productAddedToCart">
      <button
        onClick={handleRemoveProduct}
        title="remove product from cart"
        className="absolute top-2 right-[5%] w-4 h-4 bg-transparent bg-[url('/images/delete-icon.png')] bg-no-repeat bg-auto cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary hover:invert rounded-full"
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
        className="inline-block align-middle w-[15%] max-h-20 object-contain h-auto mr-[3%]"
      />
      <div className="inline-block align-middle w-[57%]">
        <p className="m-0 text-sm font-semibold">
          {product?.name}
        </p>
        <p className="text-[#5b5a5e] m-0 text-sm">
          Barcode: {product?.barcode}
        </p>
        <p className="text-[#5b5a5e] m-0 line-clamp-1 text-sm">
          Description: {product?.description}
        </p>
        <p className="text-[#5b5a5e] m-0 text-sm">
          Quantity: {product?.quantity}
        </p>
      </div>
      <div className="inline-block align-middle text-right w-[25%]">
        <p className="text-sm md:text-base mb-2">
          <span className="whitespace-nowrap block">Price: ${product?.price.toFixed(2)} </span>
          <span className="ml-5 whitespace-nowrap block">
            Tax: ${product?.tax_rate.toFixed(2)}
          </span>
        </p>
        <div>
          <button
            onClick={handleDecreaseProductQuantity}
            disabled={product?.quantity === 1}
            className="w-6 h-6 bg-black text-[#b7b7b7] border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary disabled:opacity-20"
          >
            -
          </button>
          <button
            onClick={handleIncreaseProductQuantity}
            className="w-6 h-6 bg-black text-[#b7b7b7] border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
