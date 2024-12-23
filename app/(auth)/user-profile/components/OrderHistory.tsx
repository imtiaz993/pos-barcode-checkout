const OrderHistory = () => {
  const orders = [
    {
      productName: "Product 1",
      quantity: 2,
      amount: "$40",
      orderDate: "2024-12-01",
    },
    {
      productName: "Product 2",
      quantity: 1,
      amount: "$20",
      orderDate: "2024-11-25",
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Past Orders</h2>
      <div className="overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-gray-700">Product Name</th>
              <th className="p-2 text-gray-700">Quantity</th>
              <th className="p-2 text-gray-700">Amount</th>
              <th className="p-2 text-gray-700">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{order.productName}</td>
                <td className="p-2">{order.quantity}</td>
                <td className="p-2">{order.amount}</td>
                <td className="p-2">{order.orderDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
