import React, { useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Breadcrumbs from "../../components/layout/Breadcrumbs";

// Discount Details Card Component
const DiscountDetailsCard = ({ formData, handleInputChange, appliesToOptions, handleGenerateCode }) => (
  <Card>
    <Card.Header>
      <h3 className="text-lg font-medium">Discount details</h3>
    </Card.Header>
    <Card.Content className="space-y-6">
      {/* Discount Target */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Discount applies to</label>
        <div className="inline-flex rounded-md shadow-sm border border-gray-300 overflow-hidden mb-2">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${
              formData.discountTarget === "product" 
                ? "bg-gray-200 text-gray-900" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            style={{ borderRight: "1px solid #e5e7eb" }}
            aria-pressed={formData.discountTarget === "product"}
            onClick={() => handleInputChange("discountTarget", "product")}
          >
            Amount off product
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${
              formData.discountTarget === "order" 
                ? "bg-gray-200 text-gray-900" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            aria-pressed={formData.discountTarget === "order"}
            onClick={() => handleInputChange("discountTarget", "order")}
          >
            Amount off order
          </button>
        </div>
      </div>

      {/* Discount Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Discount method</label>
        <div className="inline-flex rounded-md shadow-sm border border-gray-300 overflow-hidden mb-2">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${
              formData.method === "code" 
                ? "bg-gray-200 text-gray-900" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            style={{ borderRight: "1px solid #e5e7eb" }}
            aria-pressed={formData.method === "code"}
            onClick={() => handleInputChange("method", "code")}
          >
            Discount code
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${
              formData.method === "auto" 
                ? "bg-gray-200 text-gray-900" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            aria-pressed={formData.method === "auto"}
            onClick={() => handleInputChange("method", "auto")}
          >
            Automatic discount
          </button>
        </div>
        {formData.method === "code" && (
          <div className="mt-2">
            <div className="flex items-end gap-2 max-w-md">
              <div className="flex-1">
                <Input
                  label="Discount code"
                  value={formData.discountCode}
                  onChange={e => handleInputChange("discountCode", e.target.value)}
                  placeholder="Discount code"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateCode}
                className="h-10 text-sm px-4 whitespace-nowrap"
              >
                Generate code
              </Button>
            </div>
          </div>
        )}
        <div className="text-xs text-gray-500 mt-1">Customers must enter this code at checkout.</div>
      </div>

      {/* Discount Value */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Discount value</label>
        <div className="flex gap-2">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 min-w-[120px]"
            value={formData.discountType}
            onChange={e => handleInputChange("discountType", e.target.value)}
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed amount</option>
          </select>
          <Input
            type="number"
            value={formData.discountValue}
            onChange={e => handleInputChange("discountValue", e.target.value)}
            placeholder="Value"
            className="w-32"
          />
        </div>
      </div>

      {/* Applies To - dynamic */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Applies to</label>
        <div className="inline-flex rounded-md shadow-sm border border-gray-300 overflow-hidden mb-2">
          {appliesToOptions[formData.discountTarget].map((opt, idx) => (
            <button
              key={opt.value}
              type="button"
              className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${
                formData.appliesTo === opt.value 
                  ? "bg-gray-200 text-gray-900" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              style={idx !== appliesToOptions[formData.discountTarget].length - 1 ? { borderRight: "1px solid #e5e7eb" } : {}}
              aria-pressed={formData.appliesTo === opt.value}
              onClick={() => handleInputChange("appliesTo", opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {formData.discountTarget === "product" && formData.appliesTo !== "all" && (
          <div className="flex items-end gap-2 mt-2 max-w-md">
            <div className="flex-1">
              <Input type="text" placeholder={`Search ${formData.appliesTo}`} />
            </div>
            <Button type="button" variant="outline" className="h-10 text-sm px-4">Browse</Button>
          </div>
        )}
      </div>
    </Card.Content>
  </Card>
);

// Customer Eligibility Card Component
const CustomerEligibilityCard = ({ formData, handleInputChange }) => (
  <Card>
    <Card.Header>
      <h3 className="text-lg font-medium">Customer eligibility</h3>
    </Card.Header>
    <Card.Content className="space-y-6">
      {/* Eligibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility</label>
        <div className="inline-flex rounded-md shadow-sm border border-gray-300 overflow-hidden mb-2">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${
              formData.eligibility === "all" 
                ? "bg-gray-200 text-gray-900" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            style={{ borderRight: "1px solid #e5e7eb" }}
            aria-pressed={formData.eligibility === "all"}
            onClick={() => handleInputChange("eligibility", "all")}
          >
            All customers
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${
              formData.eligibility === "segments" 
                ? "bg-gray-200 text-gray-900" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            style={{ borderRight: "1px solid #e5e7eb" }}
            aria-pressed={formData.eligibility === "segments"}
            onClick={() => handleInputChange("eligibility", "segments")}
          >
            Specific customer segments
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${
              formData.eligibility === "specific" 
                ? "bg-gray-200 text-gray-900" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            aria-pressed={formData.eligibility === "specific"}
            onClick={() => handleInputChange("eligibility", "specific")}
          >
            Specific customers
          </button>
        </div>
      </div>

      {/* Minimum Purchase Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum purchase requirements</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="minRequirement" checked={formData.minRequirement === "none"} onChange={() => handleInputChange("minRequirement", "none")} /> No minimum requirements
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="minRequirement" checked={formData.minRequirement === "amount"} onChange={() => handleInputChange("minRequirement", "amount")} /> Minimum purchase amount (₹)
            <Input
              type="number"
              value={formData.minAmount}
              onChange={e => handleInputChange("minAmount", e.target.value)}
              className="w-32"
              placeholder="0"
            />
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="minRequirement" checked={formData.minRequirement === "quantity"} onChange={() => handleInputChange("minRequirement", "quantity")} /> Minimum quantity of items
            <Input
              type="number"
              value={formData.minQuantity}
              onChange={e => handleInputChange("minQuantity", e.target.value)}
              className="w-32"
              placeholder="0"
            />
          </label>
        </div>
      </div>
    </Card.Content>
  </Card>
);

// Usage Limits Card Component
const UsageLimitsCard = ({ formData, handleInputChange }) => (
  <Card>
    <Card.Header>
      <h3 className="text-lg font-medium">Usage limits</h3>
    </Card.Header>
    <Card.Content className="space-y-6">
      {/* Maximum Discount Uses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Maximum discount uses</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.maxUses} onChange={e => handleInputChange("maxUses", e.target.checked)} /> Limit number of times this discount can be used in total
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.maxUsesPerCustomer} onChange={e => handleInputChange("maxUsesPerCustomer", e.target.checked)} /> Limit to one use per customer
          </label>
        </div>
      </div>

      {/* Combinations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Combinations</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.combinations.product} onChange={e => handleInputChange("product", e.target.checked, "combinations")} /> Product discounts
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.combinations.order} onChange={e => handleInputChange("order", e.target.checked, "combinations")} /> Order discounts
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.combinations.shipping} onChange={e => handleInputChange("shipping", e.target.checked, "combinations")} /> Shipping discounts
          </label>
        </div>
      </div>
    </Card.Content>
  </Card>
);

// Active Dates Card Component
const ActiveDatesCard = ({ formData, handleInputChange }) => (
  <Card>
    <Card.Header>
      <h3 className="text-lg font-medium">Active dates</h3>
    </Card.Header>
    <Card.Content className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Start date and time</label>
        <div className="flex gap-2 items-center">
          <Input
            type="date"
            value={formData.startDate}
            onChange={e => handleInputChange("startDate", e.target.value)}
            className="w-40"
          />
          <Input
            type="time"
            value={formData.startTime}
            onChange={e => handleInputChange("startTime", e.target.value)}
            className="w-32"
          />
        </div>
      </div>
      
      <div>
        <label className="flex items-center gap-2 mb-2">
          <input type="checkbox" checked={formData.setEndDate} onChange={e => handleInputChange("setEndDate", e.target.checked)} /> Set end date
        </label>
        {formData.setEndDate && (
          <div className="flex gap-2 items-center">
            <Input
              type="date"
              value={formData.endDate}
              onChange={e => handleInputChange("endDate", e.target.value)}
              className="w-40"
            />
            <Input
              type="time"
              value={formData.endTime}
              onChange={e => handleInputChange("endTime", e.target.value)}
              className="w-32"
            />
          </div>
        )}
      </div>
    </Card.Content>
  </Card>
);

// Discount Summary Card Component  
const DiscountSummaryCard = ({ formData }) => (
  <Card>
    <Card.Header>
      <h3 className="text-sm font-semibold">Discount summary</h3>
    </Card.Header>
    <Card.Content>
      <div className="text-xs text-gray-500 mb-2">Code: {formData.discountCode || "-"}</div>
      <div className="text-xs text-gray-500 mb-2">Type: {formData.discountType}</div>
      <div className="text-xs text-gray-500 mb-2">Amount off: {formData.discountValue || "-"} {formData.discountType === "percentage" ? "%" : "₹"}</div>
      <div className="text-xs text-gray-500 mb-2">Target: {formData.discountTarget === "product" ? "Product" : "Order"}</div>
      <h4 className="text-sm font-semibold mt-4 mb-2">Details</h4>
      <ul className="text-xs text-gray-500 list-disc pl-4">
        <li>{formData.eligibility === "all" ? "All customers" : formData.eligibility === "segments" ? "Specific segments" : "Specific customers"}</li>
        <li>{formData.minRequirement === "none" ? "No minimum purchase requirement" : formData.minRequirement === "amount" ? `Min amount: ₹${formData.minAmount}` : `Min quantity: ${formData.minQuantity}`}</li>
        <li>{formData.maxUses ? "Usage limit enabled" : "No usage limits"}</li>
        <li>{formData.combinations.product || formData.combinations.order || formData.combinations.shipping ? "Can combine with other discounts" : "Can't combine with other discounts"}</li>
        <li>Active from {formData.startDate || "today"}</li>
      </ul>
    </Card.Content>
  </Card>
);

// Sales Channel Card Component
const SalesChannelCard = ({ formData, handleInputChange }) => (
  <Card>
    <Card.Header>
      <h4 className="text-sm font-semibold mb-2">Sales channel access</h4>
    </Card.Header>
    <Card.Content>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={formData.channelAccess} onChange={e => handleInputChange("channelAccess", e.target.checked)} /> Allow discount to be featured on selected channels
      </label>
    </Card.Content>
  </Card>
);

const CreateDiscount = () => {
  const [formData, setFormData] = useState({
    method: "code",
    discountCode: "",
    discountType: "percentage",
    discountValue: "",
    appliesTo: "collections",
    selectedCollections: [],
    eligibility: "all",
    minRequirement: "none",
    minAmount: "",
    minQuantity: "",
    maxUses: false,
    maxUsesPerCustomer: false,
    combinations: { product: false, order: false, shipping: false },
    startDate: "",
    startTime: "",
    setEndDate: false,
    endDate: "",
    endTime: "",
    channelAccess: false,
    discountTarget: "product",
  });

  const appliesToOptions = {
    product: [
      { value: "collections", label: "Specific collections" },
      { value: "products", label: "Specific products" },
      { value: "all", label: "All products" },
    ],
    order: [
      { value: "all", label: "Entire order" },
    ],
  };

  const handleInputChange = (field, value, parent) => {
    if (parent) {
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleGenerateCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setFormData(prev => ({ ...prev, discountCode: code }));
  };

  const breadcrumbItems = [
    { name: "Discounts", href: "/dashboard/discounts" },
    { name: "Create discount" },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Create discount</h1>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="px-4 py-2">
              Cancel
            </Button>
            <Button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2">
              Save discount
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <DiscountDetailsCard 
            formData={formData}
            handleInputChange={handleInputChange}
            appliesToOptions={appliesToOptions}
            handleGenerateCode={handleGenerateCode}
          />
          
          <CustomerEligibilityCard 
            formData={formData}
            handleInputChange={handleInputChange}
          />
          
          <UsageLimitsCard 
            formData={formData}
            handleInputChange={handleInputChange}
          />
          
          <ActiveDatesCard 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <DiscountSummaryCard formData={formData} />
          <SalesChannelCard 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
      </div>
    </>
  );
};

export default CreateDiscount;
