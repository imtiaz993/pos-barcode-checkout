import CartProduct from "./CartProduct";

const CartProducts = ({ products }: any) => {
  return (
    <div className="relative min-h-[280px] pb-[200px]">
      {products?.length ? (
        products.map((p:ANY) => <CartProduct product={p} key={p.sku} />)
      ) : (
        <p className="text-center text-gray-100 leading-10">
          Add some products in the cart <br />
          :)
        </p>
      )}
    </div>
  );
};

export default CartProducts;
