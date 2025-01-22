import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }: any) => {
  const pathname = usePathname();

  // Close the sidebar when the route changes
  useEffect(() => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  const links = [
    { href: "/admin/order-history", label: "Order History" },
    { href: "/admin/manage-users", label: "Manage Users" },
    { href: "/admin/manage-admins", label: "Manage Admins" },
  ];

  return (
    <div>
      <div
        className={`fixed lg:static top-0 left-0 h-full lg:min-h-[calc(100dvh-50px)] bg-white shadow-md w-64 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-50`}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b lg:hidden">
          <h2 className="font-semibold">Menu</h2>
          <button className="text-2xl" onClick={() => setSidebarOpen(false)}>
            <IoMdClose />
          </button>
        </div>
        <ul className="flex flex-col p-4 space-y-2 text-sm font-medium">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-2 py-2 lg: rounded ${
                  pathname === link.href
                    ? "text-white bg-blue-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
