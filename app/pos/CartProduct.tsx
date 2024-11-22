import { formatPrice } from "@/utils/formatPrice";

const CartProduct = ({ product }: any) => {
  const {
    title,
    price,
    style,
    currencyId,
    currencyFormat,
    availableSizes,
    quantity,
  } = product;

  const handleRemoveProduct = () => {};
  const handleIncreaseProductQuantity = () => {};
  const handleDecreaseProductQuantity = () => {};

  return (
    <div className="relative box-border p-5 transition-all before:content-[''] before:w-[90%] before:h-[2px] before:bg-black/20 before:absolute before:top-0 before:left-[5%]">
      <button
        onClick={handleRemoveProduct}
        title="remove product from cart"
        className="absolute top-4 right-[5%] w-4 h-4 bg-transparent bg-[url('/static/delete-icon.png')] bg-no-repeat bg-auto cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary hover:bg-[left_-17px] rounded-full"
      />
      <img
        src={""}
        alt={title}
        className="inline-block align-middle w-[15%] h-auto mr-[3%]"
      />
      <div className="inline-block align-middle w-[57%]">
        <p className="text-gray-100 m-0">{title}</p>
        <p className="text-gray-500 m-0">
          {`${availableSizes[0]} | ${style}`} <br />
          Quantity: {quantity}
        </p>
      </div>
      <div className="inline-block align-middle text-right w-[25%] text-secondary">
        <p>{`${currencyFormat}  ${formatPrice(price, currencyId)}`}</p>
        <div>
          <button
            onClick={handleDecreaseProductQuantity}
            disabled={quantity === 1}
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
