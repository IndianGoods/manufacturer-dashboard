import Breadcrumbs from "../../components/layout/Breadcrumbs";
import Card from "../../components/ui/Card";
import { PlusIcon, ShoppingBagIcon, ClipboardDocumentListIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

const quickActions = [
  {
    title: "Create Product",
    description: "Add a new product to your catalog.",
    icon: ShoppingBagIcon,
    href: "/dashboard/products/create",
  },
  {
    title: "Create Order",
    description: "Start a new order for a customer.",
    icon: ClipboardDocumentListIcon,
    href: "/dashboard/orders/create",
  },
  {
    title: "Manage Inventory",
    description: "View and update your inventory levels.",
    icon: Cog6ToothIcon,
    href: "/dashboard/inventory",
  },
];

const Home = () => {
  // Get user name
  const user = useSelector(state => state.auth?.user);
  const name = user?.name || "User";
  const breadcrumbItems = [{ name: "Dashboard" }];

  // Example analytics summary cards (can be replaced with real data)
  const summaryCards = [
    { title: "Gross sales", value: "₹42,500", subtitle: "+12% from last week" },
    { title: "Orders", value: "1,250", subtitle: "+8% from last week" },
    { title: "Avg order value", value: "₹34.00", subtitle: "+3% from last week" },
    { title: "Products sold", value: "3,800", subtitle: "+5% from last week" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Top: Recent Activity Cards */}
        <div className="flex flex-wrap gap-6 mb-8">
          {summaryCards.map((card, idx) => (
            <div key={card.title} className="flex-1 min-w-[180px] bg-white rounded-xl px-6 py-5 shadow border border-gray-100 flex flex-col justify-center items-start">
              <div className="flex items-center gap-2 mb-2">
                {idx === 0 && <ShoppingBagIcon className="h-6 w-6 text-gray-400" />}
                {idx === 1 && <ClipboardDocumentListIcon className="h-6 w-6 text-gray-400" />}
                {idx === 2 && <Cog6ToothIcon className="h-6 w-6 text-gray-400" />}
                {idx === 3 && <PlusIcon className="h-6 w-6 text-gray-400" />}
                <span className="text-base font-medium text-gray-700">{card.title}</span>
              </div>
              <div className="text-xl font-normal text-gray-900">{card.value}</div>
              <div className="text-xs text-green-600 mt-1">{card.subtitle}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Middle: Sales Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Total Sales</h2>
                <button className="px-4 py-2 bg-gray-100 rounded text-gray-700 text-xs font-normal border border-gray-200">Download PDF</button>
              </div>
              <div className="flex gap-8 mb-6">
                <div>
                  <div className="text-xl font-normal text-gray-900">239</div>
                  <div className="text-xs text-gray-500">New Orders</div>
                </div>
                <div>
                  <div className="text-xl font-normal text-gray-900">₹3,499.00</div>
                  <div className="text-xs text-gray-500">Revenue February</div>
                </div>
                <div>
                  <div className="text-xl font-normal text-gray-900">₹2,168.00</div>
                  <div className="text-xs text-gray-500">Average Revenue</div>
                </div>
              </div>
              {/* Simple Chart Placeholder (removed if not functional) */}
              <div className="bg-gray-50 rounded h-32 flex items-center justify-center">
                <span className="text-gray-400 text-xs">(Chart coming soon)</span>
              </div>
            </div>

            {/* Order List Table - styled like Discounts.jsx */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-0">
              <div className="flex gap-6 px-6 pt-6 mb-4">
                <button className="text-sm font-medium text-primary-700 border-b-2 border-primary-700 pb-1">Checkout</button>
                <button className="text-sm font-medium text-gray-400 pb-1">On Process</button>
                <button className="text-sm font-medium text-gray-400 pb-1">On Delivery</button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-left">
                    <th className="py-3 px-6 font-medium">No</th>
                    <th className="py-3 px-6 font-medium">Order ID</th>
                    <th className="py-3 px-6 font-medium">Orderer Name</th>
                    <th className="py-3 px-6 font-medium">Date</th>
                    <th className="py-3 px-6 font-medium">Cost</th>
                    <th className="py-3 px-6 font-medium">Shipping Cost</th>
                    <th className="py-3 px-6 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="py-3 px-6">1</td>
                    <td className="py-3 px-6">#27382929</td>
                    <td className="py-3 px-6">Nelson Mandel</td>
                    <td className="py-3 px-6">10 Feb 2022</td>
                    <td className="py-3 px-6">$280.00</td>
                    <td className="py-3 px-6">$10.00</td>
                    <td className="py-3 px-6"><span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">Pending</span></td>
                  </tr>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="py-3 px-6">2</td>
                    <td className="py-3 px-6">#2738182</td>
                    <td className="py-3 px-6">Hanivan Muhammad</td>
                    <td className="py-3 px-6">10 Feb 2022</td>
                    <td className="py-3 px-6">$180.00</td>
                    <td className="py-3 px-6">$20.00</td>
                    <td className="py-3 px-6"><span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Visitors & Shipping */}
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
              <h2 className="text-base font-medium text-gray-900 mb-2">Visitors</h2>
              <div className="text-xl font-normal text-gray-900 mb-1">43,292 <span className="text-xs text-green-600">+2.4%</span></div>
              {/* Simple Chart Placeholder (removed if not functional) */}
              <div className="bg-gray-50 rounded h-20 flex items-center justify-center mb-4">
                <span className="text-gray-400 text-xs">(Chart coming soon)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500">Order Target</span>
                  <span className="text-base font-medium text-primary-700">1,239</span>
                  <span className="text-xs text-gray-400">70% of target</span>
                </div>
                <div>
                  <svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" stroke="#E5E7EB" strokeWidth="4" fill="none" /><circle cx="30" cy="30" r="28" stroke="#3B82F6" strokeWidth="4" fill="none" strokeDasharray="175" strokeDashoffset="52" /></svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
              <h2 className="text-base font-medium text-gray-900 mb-2">Upcoming Shipping</h2>
              <div className="mb-3 flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-700">Order ID</span>
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-500">#27382929</span>
                <span className="text-green-600">Delivery</span>
                <span className="text-gray-400">10 Feb 2022</span>
              </div>
              <div className="mb-3 flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-700">Order ID</span>
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-500">#14818929</span>
                <span className="text-green-600">Delivery</span>
                <span className="text-gray-400">15 Feb 2022</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
