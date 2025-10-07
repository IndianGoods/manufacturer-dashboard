import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { mockProducts } from "../../../data/mockData";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import Breadcrumbs from "../../../components/layout/Breadcrumbs";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import Table from "../../../components/ui/Table";
import Card from "../../../components/ui/Card";

const Inventory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});
  const [editingValues, setEditingValues] = useState({});
  const [products, setProducts] = useState(mockProducts);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const containerRef = useRef(null);

  // Extract all products with their variants
  const allInventoryItems = useMemo(() => {
    const items = [];
    products.forEach((product) => {
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant) => {
          items.push({
            id: `${product.id}-${variant.id}`,
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            variantName: variant.name,
            sku: variant.sku,
            category: product.category,
            price: variant.price,
            stock: variant.inventory?.available || 0,
            onHand:
              variant.inventory?.onHand || variant.inventory?.available || 0,
            committed: variant.inventory?.committed || 0,
            unavailable: variant.inventory?.unavailable || {},
            totalUnavailable: Object.values(
              variant.inventory?.unavailable || {}
            ).reduce((sum, val) => sum + val, 0),
            location: variant.location,
            barcode: variant.barcode || "",
            weight: variant.weight || 0,
            product,
            variantData: variant,
          });
        });
      } else {
        items.push({
          id: product.id,
          productId: product.id,
          variantId: null,
          name: product.name,
          variantName: "Default",
          sku: product.sku,
          category: product.category,
          price: product.price,
          stock: product.inventory?.available || 0,
          onHand:
            product.inventory?.onHand || product.inventory?.available || 0,
          committed: product.inventory?.committed || 0,
          unavailable: product.inventory?.unavailable || {},
          totalUnavailable: Object.values(
            product.inventory?.unavailable || {}
          ).reduce((sum, val) => sum + val, 0),
          location: product.location,
          barcode: product.barcode || "",
          weight: product.weight || 0,
          product,
          variantData: null,
        });
      }
    });
    return items;
  }, [products]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(allInventoryItems.map((item) => item.category))];
    return ["all", ...cats];
  }, [allInventoryItems]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = allInventoryItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.variantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      // Tab filtering
      let matchesTab = true;
      if (activeTab === "inStock") {
        matchesTab = item.stock > 0;
      } else if (activeTab === "lowStock") {
        matchesTab = item.stock > 0 && item.stock < 10;
      } else if (activeTab === "outOfStock") {
        matchesTab = item.stock === 0;
      }

      return matchesSearch && matchesCategory && matchesTab;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "name") {
        aVal = `${a.name} ${a.variantName}`;
        bVal = `${b.name} ${b.variantName}`;
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [
    allInventoryItems,
    searchTerm,
    selectedCategory,
    sortBy,
    sortOrder,
    activeTab,
  ]);

  const handleProductClick = (item) => {
    navigate(`/dashboard/products/${item.productId}`);
  };

  const handleVariantSelection = (itemId, checked) => {
    if (checked) {
      setSelectedVariants((prev) => ({ ...prev, [itemId]: true }));
    } else {
      setSelectedVariants((prev) => {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      });
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const newSelected = {};
      filteredAndSortedItems.forEach((item) => {
        newSelected[item.id] = true;
      });
      setSelectedVariants(newSelected);
    } else {
      setSelectedVariants({});
    }
  };

  const handleSortByName = (order) => {
    setSortBy("name");
    setSortOrder(order);
  };

  const selectedItemsCount =
    Object.values(selectedVariants).filter(Boolean).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpenDropdowns({});
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setOpenDropdowns({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const toggleDropdown = (itemId, dropdownType = "main", event = null) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const key = `${itemId}-${dropdownType}`;
    setOpenDropdowns((prev) => {
      const isCurrentlyOpen = prev[key];

      // For nested dropdowns, keep main dropdown open
      if (
        dropdownType.startsWith("unavailable-") &&
        dropdownType !== "unavailable"
      ) {
        return {
          [`${itemId}-unavailable`]: true,
          [key]: !isCurrentlyOpen,
        };
      }

      // For main dropdowns, close others and toggle this one
      return isCurrentlyOpen ? {} : { [key]: true };
    });
  };

  const handleValueChange = (itemId, field, value) => {
    setEditingValues((prev) => ({
      ...prev,
      [`${itemId}-${field}`]: value,
    }));
  };

  // Update inventory data in products
  const updateInventoryData = (
    productId,
    variantId,
    field,
    value,
    reason = ""
  ) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) => {
        if (product.id === productId) {
          if (variantId && product.variants) {
            const updatedVariants = product.variants.map((variant) => {
              if (variant.id === variantId) {
                const updatedInventory = { ...variant.inventory };

                if (field === "available") {
                  updatedInventory.available = parseInt(value) || 0;
                } else if (field === "onHand") {
                  updatedInventory.onHand = parseInt(value) || 0;
                } else if (field === "committed") {
                  updatedInventory.committed = parseInt(value) || 0;
                } else if (field.startsWith("unavailable.")) {
                  const unavailableType = field.split(".")[1];
                  updatedInventory.unavailable = {
                    ...updatedInventory.unavailable,
                    [unavailableType]: parseInt(value) || 0,
                  };
                }

                return { ...variant, inventory: updatedInventory };
              }
              return variant;
            });
            return { ...product, variants: updatedVariants };
          } else {
            const updatedInventory = { ...product.inventory };

            if (field === "available") {
              updatedInventory.available = parseInt(value) || 0;
            } else if (field === "onHand") {
              updatedInventory.onHand = parseInt(value) || 0;
            } else if (field === "committed") {
              updatedInventory.committed = parseInt(value) || 0;
            } else if (field.startsWith("unavailable.")) {
              const unavailableType = field.split(".")[1];
              updatedInventory.unavailable = {
                ...updatedInventory.unavailable,
                [unavailableType]: parseInt(value) || 0,
              };
            }

            return { ...product, inventory: updatedInventory };
          }
        }
        return product;
      });

      console.log(
        `Updated ${field} for product ${productId}, variant ${variantId} to ${value}. Reason: ${reason}`
      );
      return updatedProducts;
    });
  };

  // Handle unavailable actions
  const handleUnavailableAction = (item, type, action, value = 0) => {
    const currentValue = item.unavailable[type] || 0;

    switch (action) {
      case "change":
        const newValue = Math.max(0, parseInt(value) || 0);
        updateInventoryData(
          item.productId,
          item.variantId,
          `unavailable.${type}`,
          newValue
        );
        break;
      case "addToAvailable":
        if (currentValue > 0) {
          updateInventoryData(
            item.productId,
            item.variantId,
            `unavailable.${type}`,
            0
          );
          updateInventoryData(
            item.productId,
            item.variantId,
            "available",
            item.stock + currentValue
          );
        }
        break;
      case "delete":
        updateInventoryData(
          item.productId,
          item.variantId,
          `unavailable.${type}`,
          0
        );
        break;
    }

    setOpenDropdowns({});
  };

  // Handle inventory adjustments
  const handleInventoryAdjustment = (item, field, adjustment, reason) => {
    const currentValue = field === "available" ? item.stock : item.onHand;
    const newValue = Math.max(0, currentValue + parseInt(adjustment));

    updateInventoryData(
      item.productId,
      item.variantId,
      field,
      newValue,
      reason
    );
    setOpenDropdowns({});
  };

  // Apply field changes
  const applyFieldChange = (item, field) => {
    const editKey = `${item.id}-${field}`;
    const newValue = editingValues[editKey];

    if (newValue !== undefined && newValue !== null) {
      updateInventoryData(item.productId, item.variantId, field, newValue);
      setEditingValues((prev) => {
        const updated = { ...prev };
        delete updated[editKey];
        return updated;
      });
    }
  };

  const isDropdownOpen = (itemId, dropdownType = "main") => {
    return openDropdowns[`${itemId}-${dropdownType}`];
  };

  const breadcrumbItems = [{ name: "Inventory" }];

  const tabs = [
    { id: "all", name: "All", count: allInventoryItems.length },
    {
      id: "inStock",
      name: "In Stock",
      count: allInventoryItems.filter((item) => item.stock > 0).length,
    },
    {
      id: "lowStock",
      name: "Low Stock",
      count: allInventoryItems.filter(
        (item) => item.stock > 0 && item.stock < 10
      ).length,
    },
    {
      id: "outOfStock",
      name: "Out of Stock",
      count: allInventoryItems.filter((item) => item.stock === 0).length,
    },
  ];

  const sortOptions = [
    { value: "name", label: "Product title A-Z" },
    { value: "name-desc", label: "Product title Z-A" },
    { value: "stock", label: "Stock (lowest first)" },
    { value: "stock-desc", label: "Stock (highest first)" },
    { value: "onHand", label: "On hand (lowest first)" },
    { value: "onHand-desc", label: "On hand (highest first)" },
  ];

  const handleTabChange = (tab, disabled) => {
    if (disabled) return;
    setActiveTab(tab);
    // Add any tab-specific filtering logic here
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  const handleSort = (option) => {
    const [field, order] = option.includes("-desc")
      ? [option.replace("-desc", ""), "desc"]
      : [option, "asc"];
    setSortBy(field);
    setSortOrder(order);
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto max-w-md">
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-100 rounded-lg p-4">
              <div className="w-16 h-16 bg-blue-500 rounded mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-10 bg-white rounded-sm"></div>
              </div>
              <div className="text-xs text-gray-500">Sneaker</div>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 relative overflow-hidden">
                <div className="absolute inset-x-0 top-4 h-8 bg-green-600 rounded-t-full"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-green-600"></div>
              </div>
              <div className="text-xs text-gray-500">Vase</div>
            </div>
            <div className="bg-yellow-100 rounded-lg p-4">
              <div className="w-16 h-16 bg-yellow-600 rounded mx-auto mb-2 relative">
                <div className="absolute top-2 left-2 right-2 bottom-6 bg-yellow-500 rounded"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-500">Honey</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2 relative">
                <div className="absolute inset-2 bg-gray-800 rounded-full">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-1 bg-gray-600"></div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Sunglasses</div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Manage your inventory
        </h3>
        <p className="text-gray-500 mb-6">
          Track stock levels, manage product variants, and monitor inventory
          across all locations
        </p>

        <div className="flex justify-center">
          <Button
            className="bg-primary-700 hover:bg-primary-700 text-white"
            onClick={() => navigate("/dashboard/products/new")}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add product
          </Button>
        </div>
      </div>
    </div>
  );

  const InventoryTable = () => (
    <div className="overflow-x-auto overflow-y-visible">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-12">
              <input
                type="checkbox"
                checked={
                  selectedItemsCount === filteredAndSortedItems.length &&
                  filteredAndSortedItems.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </Table.Head>
            <Table.Head className="text-xs">Product</Table.Head>
            <Table.Head className="text-xs">SKU</Table.Head>
            <Table.Head className="text-xs">Unavailable</Table.Head>
            <Table.Head className="text-xs">Available</Table.Head>
            <Table.Head className="text-xs">On Hand</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredAndSortedItems.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              // Row click unbound, code preserved for future use
              // onClick={(e) => {
              //   if (
              //     e.target.type !== "checkbox" &&
              //     e.target.type !== "number" &&
              //     !e.target.closest("button")
              //   ) {
              //     handleProductClick(item);
              //   }
              // }}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <input
                  type="checkbox"
                  checked={selectedVariants[item.id] || false}
                  onChange={(e) =>
                    handleVariantSelection(item.id, e.target.checked)
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <div className="h-8 w-8 flex-shrink-0">
                    <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-xs font-medium text-gray-900">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.variantName} • {item.category}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="text-xs font-mono text-gray-600">
                  {item.sku}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => toggleDropdown(item.id, "unavailable", e)}
                    className="h-8 px-2"
                  >
                    <span className="text-xs font-medium">
                      {item.totalUnavailable}
                    </span>
                    <ChevronDownIcon className="h-3 w-3 ml-1" />
                  </Button>

                  {isDropdownOpen(item.id, "unavailable") && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-20 min-w-48">
                      <div className="p-3 space-y-2">
                        {[
                          "damaged",
                          "qualityControl",
                          "safetyStock",
                          "other",
                        ].map((type) => {
                          const value = item.unavailable[type] || 0;
                          const label =
                            type === "qualityControl"
                              ? "Quality Control"
                              : type === "safetyStock"
                              ? "Safety Stock"
                              : type.charAt(0).toUpperCase() + type.slice(1);

                          return (
                            <div
                              key={type}
                              className="border-b border-gray-100 pb-2 last:border-0"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">
                                  {label}:
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">
                                    {value}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) =>
                                      toggleDropdown(
                                        item.id,
                                        `unavailable-${type}`,
                                        e
                                      )
                                    }
                                    className="h-6 w-6 p-0"
                                  >
                                    <ChevronDownIcon className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              {isDropdownOpen(
                                item.id,
                                `unavailable-${type}`
                              ) && (
                                <div
                                  className="bg-gray-50 p-2 rounded space-y-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      placeholder="Value"
                                      className="h-8 text-sm"
                                      id={`${item.id}-${type}-input`}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <Button
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const input = document.getElementById(
                                          `${item.id}-${type}-input`
                                        );
                                        const newValue =
                                          parseInt(input.value) || 0;
                                        handleUnavailableAction(
                                          item,
                                          type,
                                          "change",
                                          newValue
                                        );
                                      }}
                                      className="h-8"
                                    >
                                      Set
                                    </Button>
                                  </div>
                                  <div className="space-y-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnavailableAction(
                                          item,
                                          type,
                                          "addToAvailable"
                                        );
                                      }}
                                      disabled={value === 0}
                                      className="w-full justify-start h-8"
                                    >
                                      → Available ({value})
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnavailableAction(
                                          item,
                                          type,
                                          "delete"
                                        );
                                      }}
                                      disabled={value === 0}
                                      className="w-full justify-start h-8 text-red-600 hover:text-red-700"
                                    >
                                      Delete ({value})
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="relative flex items-center gap-2">
                  <Input
                    type="number"
                    value={editingValues[`${item.id}-available`] ?? item.stock}
                    onChange={(e) =>
                      handleValueChange(item.id, "available", e.target.value)
                    }
                    onBlur={() => applyFieldChange(item, "available")}
                    onKeyPress={(e) =>
                      e.key === "Enter" && applyFieldChange(item, "available")
                    }
                    className="w-20 h-8 text-sm"
                  />
                  {/* Three-dot menu removed */}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="relative flex items-center gap-2">
                  <Input
                    type="number"
                    value={editingValues[`${item.id}-onHand`] ?? item.onHand}
                    onChange={(e) =>
                      handleValueChange(item.id, "onHand", e.target.value)
                    }
                    onBlur={() => applyFieldChange(item, "onHand")}
                    onKeyPress={(e) =>
                      e.key === "Enter" && applyFieldChange(item, "onHand")
                    }
                    className="w-20 h-8 text-sm"
                  />
                  {/* Three-dot menu removed */}
                </div>
              </td>
            </tr>
          ))}
        </Table.Body>
      </Table>
    </div>
  );

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <div className="flex items-center space-x-3">
            <Button onClick={() => navigate("/dashboard/products/new")}> 
              <PlusIcon className="h-4 w-4 mr-2" />
              Add product
            </Button>
          </div>
        </div>
      </div>

      {/* Only show empty state if 'All' tab is selected and there are no inventory items */}
      {activeTab === "all" && filteredAndSortedItems.length === 0 ? (
        <Card>
          <EmptyState />
        </Card>
      ) : (
        <Card>
          {/* Tabs with Search and Filters */}
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const visuallyDisabled = tab.count === 0;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id, visuallyDisabled)}
                      tabIndex={visuallyDisabled ? -1 : 0}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-primary-500 text-primary-600"
                          : visuallyDisabled
                          ? "border-transparent text-gray-300"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer"
                      }`}
                      style={
                        visuallyDisabled
                          ? { pointerEvents: "none", cursor: "default" }
                          : {}
                      }
                    >
                      {tab.name}
                      <span
                        className={`ml-2 py-0.5 px-2 text-xs rounded-full ${
                          tab.count > 0
                            ? "bg-gray-100 text-gray-600"
                            : "bg-gray-50 text-gray-300"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="flex items-center space-x-2">
                {selectedItemsCount > 0 ? (
                  /* Bulk Actions */
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">
                      {selectedItemsCount} item
                      {selectedItemsCount > 1 ? "s" : ""} selected
                    </span>
                    <Button variant="outline" size="sm" className="text-xs">
                      Bulk adjust
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      Export selected
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedVariants({})}
                      className="text-xs text-gray-500"
                    >
                      Clear
                    </Button>
                  </div>
                ) : (
                  /* Search and Sort */
                  <>
                    {/* Expandable Search */}
                    <div className="flex items-center">
                      {!isSearchExpanded ? (
                        <button
                          onClick={() => setIsSearchExpanded(true)}
                          className="p-2 rounded hover:bg-gray-100 transition-colors"
                        >
                          <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      ) : (
                        <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 ml-3" />
                          <input
                            type="text"
                            placeholder="Search inventory"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-2 pr-3 py-2 text-sm focus:outline-none w-64"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              setIsSearchExpanded(false);
                              setSearchTerm("");
                              handleSearch("");
                            }}
                            className="p-1 mr-2 rounded hover:bg-gray-100"
                          >
                            <XMarkIcon className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <select
                        value={`${sortBy}${
                          sortOrder === "desc" ? "-desc" : ""
                        }`}
                        onChange={(e) => handleSort(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 pr-8"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <InventoryTable />
        </Card>
      )}
    </div>
  );
};

export default Inventory;
