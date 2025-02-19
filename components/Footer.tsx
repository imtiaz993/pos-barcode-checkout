import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="text-xs text-center py-2">
      © 2024 Eco Boutique Market.{" "}
      <a
        target="_blank"
        className="text-blue-600 underline cursor-pointer"
        href="https://www.ecoboutiquemarket.com/privacy-policy/"
      >
        Privacy Policy
      </a>
      . All rights reserved.
    </div>
  );
};

export default Footer;
