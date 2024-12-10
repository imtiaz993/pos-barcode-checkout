"use client"

import { useState } from 'react';
import Image from "next/image";

export default function Page() {
  const [amount, setAmount] = useState<any>(25);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [fromName, setFromName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setrecipientPhone] = useState('');

  const presetAmounts = [10, 25, 50, 75, 100, 500];

  const handleAddToCart = async () => {
    // Example API call
    const payload = {
      amount: customAmount || amount,
      message,
      fromName,
      recipientName,
      recipientPhone,
    };
    try {
      const res = await fetch('/api/add-to-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log('Successfully added to cart:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4 text-center">Purchase your <span className="text-blue-600">Virtual Gift Card </span>!</h1>

      {/* Card Preview */}
      <div className="w-full rounded-lg p-4 mb-8 flex items-center justify-center">
        <Image
            src="/images/gift_card.png"
            width={0}
            height={0}
            sizes="100vw"
            alt=""
            className="w-auto"
          />
      </div>

      {/* 1. Choose amount */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">1. Choose amount: <span className="text-red-600">*</span></h2>
        <div className="flex flex-wrap gap-2">
          {presetAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => { setAmount(amt); setCustomAmount(''); }}
              className={`px-4 py-2 rounded border ${amount === amt ? 'bg-blue-100 border-blue-600' : 'border-gray-300'}`}
            >
              ${amt}
            </button>
          ))}
        </div>
        <div className="mt-2">
          <label htmlFor="customAmount" className="block text-sm mb-1">Custom Amount</label>
          <input
            type="number"
            id="customAmount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount('');
            }}
            className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
            placeholder="500.00"
          />
        </div>
      </div>


      {/* 3. Write a gift message */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">3. Write a gift message:</h2>
        <textarea
          className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
          placeholder="Add a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* From field */}
      <div className="mb-6">
        <label htmlFor="fromName" className="font-semibold block mb-2">From <span className="text-red-600">*</span></label>
        <input
          type="text"
          id="fromName"
          value={fromName}
          onChange={(e) => setFromName(e.target.value)}
          placeholder="Add a sender name..."
          className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
        />
      </div>


      {/* Recipient information */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Recipient information:</h2>
        <label className="block mb-1 text-sm" htmlFor="recipientName">Name <span className="text-red-600">*</span></label>
        <input
          type="text"
          id="recipientName"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          placeholder="Enter a recipient name"
          className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
        />

        <label className="block mb-1 text-sm" htmlFor="recipientPhone">Phone Number <span className="text-red-600">*</span></label>
        <input
          type="phone"
          id="recipientPhone"
          value={recipientPhone}
          onChange={(e) => setrecipientPhone(e.target.value)}
          placeholder="+123456789"
          className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
        />
      </div>

      <button
        onClick={handleAddToCart}
        className="mt-6 w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700"
      >
        ADD TO CART & CHECKOUT
      </button>
    </div>
  );
}