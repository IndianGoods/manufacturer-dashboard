import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
import {
  PhotoIcon as CameraIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ChevronDownIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { updateProduct, deleteProduct } from "../../store/slices/productsSlice";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";

// Move components outside to prevent re-rendering
const ImageUploadArea = ({
  uploadedImages,
  handleMainImageUpload,
  removeMainImage,
}) => (
  <Card>
    <Card.Header>
      <h3 className="text-lg font-medium">Media</h3>
    </Card.Header>
    <Card.Content>
      <div className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Add images, or drag and drop
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                JPG, PNG, WEBP, or GIF
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept="image/*"
                onChange={handleMainImageUpload}
              />
            </label>
          </div>
        </div>

        {/* Image Previews */}
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={image.id} className="relative group">
                <div className="w-full h-24 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={image.url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeMainImage(image.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card.Content>
  </Card>
);

const ProductDetailsCard = ({
  formData,
  handleInputChange,
  categories,
  tags,
  tagInput,
  setTagInput,
  addTag,
  removeTag,
  handleTagKeyPress,
  tagInputRef,
}) => (
  <Card>
    <Card.Header>
      <h3 className="text-lg font-medium">Product details</h3>
    </Card.Header>
    <Card.Content className="space-y-4">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
        placeholder="Product title"
        required
      />

      {/* Category Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => {
              handleInputChange("category", e.target.value);
              handleInputChange("subCategory", ""); // Reset subcategory when category changes
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select category</option>
            {Object.keys(categories).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub-Category
          </label>
          <select
            value={formData.subCategory}
            onChange={(e) => handleInputChange("subCategory", e.target.value)}
            disabled={!formData.category}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
          >
            <option value="">Select sub-category</option>
            {formData.category &&
              categories[formData.category]?.map((subCategory) => (
                <option key={subCategory} value={subCategory}>
                  {subCategory}
                </option>
              ))}
          </select>
        </div>
      </div>

      <Input
        label="SKU"
        value={formData.sku}
        onChange={(e) => handleInputChange("sku", e.target.value)}
        placeholder="Stock Keeping Unit"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <Editor
          apiKey="your-tinymce-api-key"
          value={formData.description}
          onEditorChange={(content) =>
            handleInputChange("description", content)
          }
          init={{
            height: 250,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "preview",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="border border-gray-300 rounded-lg p-2 min-h-[42px] focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:outline-none"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            ref={tagInputRef}
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyPress}
            onBlur={() => {
              if (tagInput.trim()) {
                addTag(tagInput);
              }
            }}
            placeholder={
              tags.length === 0
                ? "e.g. wholesale, bulk, industrial"
                : "Add another tag..."
            }
            className="w-full border-0 outline-none text-sm placeholder-gray-400"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Press Enter or comma to add tags
        </p>
      </div>
    </Card.Content>
  </Card>
);

const SpecificationsCard = ({ formData, handleInputChange }) => (
  <Card>
    <Card.Header>
      <h3 className="text-lg font-medium">Specifications</h3>
    </Card.Header>
    <Card.Content className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Material"
          value={formData.specifications.material}
          onChange={(e) =>
            handleInputChange("material", e.target.value, "specifications")
          }
          placeholder="e.g. Cotton, Steel, Plastic"
        />

        <Input
          label="Model Number"
          value={formData.specifications.modelNumber}
          onChange={(e) =>
            handleInputChange("modelNumber", e.target.value, "specifications")
          }
          placeholder="Model number"
        />

        <Input
          label="Packing"
          value={formData.specifications.packing}
          onChange={(e) =>
            handleInputChange("packing", e.target.value, "specifications")
          }
          placeholder="Packing details"
        />

        <Input
          label="MOQ (Minimum Order Quantity)"
          type="number"
          value={formData.specifications.moq}
          onChange={(e) =>
            handleInputChange("moq", e.target.value, "specifications")
          }
          placeholder="Minimum order quantity"
        />

        <Input
          label="Package"
          value={formData.specifications.package}
          onChange={(e) =>
            handleInputChange("package", e.target.value, "specifications")
          }
          placeholder="Package type"
        />

        <Input
          label="Single Package Size"
          value={formData.specifications.singlePackageSize}
          onChange={(e) =>
            handleInputChange(
              "singlePackageSize",
              e.target.value,
              "specifications"
            )
          }
          placeholder="e.g. 10x5x2 cm"
        />

        <Input
          label="Single Gross Weight"
          value={formData.specifications.singleGrossWeight}
          onChange={(e) =>
            handleInputChange(
              "singleGrossWeight",
              e.target.value,
              "specifications"
            )
          }
          placeholder="e.g. 0.5 kg"
        />

        <Input
          label="Recommended Age"
          value={formData.specifications.recommendedAge}
          onChange={(e) =>
            handleInputChange(
              "recommendedAge",
              e.target.value,
              "specifications"
            )
          }
          placeholder="e.g. 3+ years"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={formData.specifications.gender}
            onChange={(e) =>
              handleInputChange("gender", e.target.value, "specifications")
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select gender</option>
            <option value="unisex">Unisex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="kids">Kids</option>
          </select>
        </div>
      </div>
    </Card.Content>
  </Card>
);

const PricingCard = ({
  formData,
  handleInputChange,
  handleVariantChange,
  addVariant,
  removeVariant,
  variantImages,
  handleVariantImageUpload,
  removeVariantImage,
}) => (
  <Card>
    <Card.Header>
      <h3 className="text-lg font-medium">Pricing</h3>
    </Card.Header>
    <Card.Content className="space-y-4">
      {/* Base Product Pricing (when no variants) */}
      {!formData.hasVariants && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
              required
            />
            <Input
              label="Compare at Price"
              type="number"
              step="0.01"
              value={formData.compareAtPrice}
              onChange={(e) => handleInputChange("compareAtPrice", e.target.value)}
              placeholder="0.00"
            />
            <Input
              label="MRP"
              type="number"
              step="0.01"
              value={formData.mrp}
              onChange={(e) => handleInputChange("mrp", e.target.value)}
              placeholder="0.00"
            />
            <Input
              label="Cost per item"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleInputChange("cost", e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Stock Quantity"
              type="number"
              value={formData.stock}
              onChange={(e) => handleInputChange("stock", e.target.value)}
              placeholder="0"
              required
            />
            <div></div>
          </div>
        </div>
      )}

      {/* Variants Toggle */}
      <div className="border-t pt-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="has-variants"
            checked={formData.hasVariants}
            onChange={(e) => handleInputChange("hasVariants", e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="has-variants" className="text-sm font-medium text-gray-700">
            This product has multiple options, like different sizes or colors
          </label>
        </div>
      </div>

      {/* Variants Section */}
      {formData.hasVariants && (
        <div className="space-y-4">
          {formData.variants.map((variant, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">
                  {variant.size && variant.color
                    ? `${variant.size} / ${variant.color}`
                    : `Variant ${index + 1}`}
                </h4>
                {formData.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Size"
                  value={variant.size}
                  onChange={(e) =>
                    handleVariantChange(index, "size", e.target.value)
                  }
                  placeholder="e.g. S, M, L, XL"
                />
                <Input
                  label="Color"
                  value={variant.color}
                  onChange={(e) =>
                    handleVariantChange(index, "color", e.target.value)
                  }
                  placeholder="e.g. Red, Blue, Black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(index, "price", e.target.value)
                  }
                  placeholder="0.00"
                />
                <Input
                  label="Compare at Price"
                  type="number"
                  step="0.01"
                  value={variant.compareAtPrice}
                  onChange={(e) =>
                    handleVariantChange(index, "compareAtPrice", e.target.value)
                  }
                  placeholder="0.00"
                />
                <Input
                  label="MRP"
                  type="number"
                  step="0.01"
                  value={variant.mrp}
                  onChange={(e) =>
                    handleVariantChange(index, "mrp", e.target.value)
                  }
                  placeholder="0.00"
                />
                <Input
                  label="Cost per item"
                  type="number"
                  step="0.01"
                  value={variant.cost}
                  onChange={(e) =>
                    handleVariantChange(index, "cost", e.target.value)
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="SKU"
                  value={variant.sku}
                  onChange={(e) =>
                    handleVariantChange(index, "sku", e.target.value)
                  }
                  placeholder="SKU"
                />
                <Input
                  label="Barcode"
                  value={variant.barcode}
                  onChange={(e) =>
                    handleVariantChange(index, "barcode", e.target.value)
                  }
                  placeholder="Barcode"
                />
                <Input
                  label="Stock Quantity"
                  type="number"
                  value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(index, "stock", e.target.value)
                  }
                  placeholder="0"
                />
                <div></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variant Images
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <CameraIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports JPG, PNG, GIF up to 10MB
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleVariantImageUpload(index, e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* Variant Image Previews */}
                {variantImages[index] && variantImages[index].length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {variantImages[index].map((image, imgIndex) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={image.url}
                            alt={`Variant ${index + 1} Image ${imgIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVariantImage(index, image.id)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`continue-selling-${index}`}
                  checked={variant.continueSelling}
                  onChange={(e) =>
                    handleVariantChange(
                      index,
                      "continueSelling",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`continue-selling-${index}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  Continue selling when out of stock
                </label>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addVariant} className="w-full">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add variant
          </Button>
        </div>
      )}
    </Card.Content>
  </Card>
);

const StatusCard = ({ formData, handleInputChange, statusOptions }) => (
  <Card>
    <Card.Header>
      <h3 className="text-lg font-medium">Product status</h3>
    </Card.Header>
    <Card.Content>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleInputChange("status", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {statusOptions.find((s) => s.value === formData.status)?.description}
        </p>
      </div>
    </Card.Content>
  </Card>
);

const EditProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { items } = useSelector((state) => state.products);

  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subCategory: "",
    sku: "",
    images: [],
    description: "",
    specifications: {
      material: "",
      modelNumber: "",
      packing: "",
      moq: "",
      package: "",
      singlePackageSize: "",
      singleGrossWeight: "",
      recommendedAge: "",
      gender: "",
    },
    tags: "",
    price: "",
    compareAtPrice: "",
    mrp: "",
    cost: "",
    stock: "",
    hasVariants: false,
    variants: [
      {
        size: "",
        color: "",
        images: [],
        price: "",
        compareAtPrice: "",
        mrp: "",
        cost: "",
        sku: "",
        barcode: "",
        stock: "",
        continueSelling: false,
      },
    ],
    seo: {
      title: "",
      description: "",
      url: "",
    },
    status: "draft",
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const tagInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [variantImages, setVariantImages] = useState({});

  // Placeholder categories - you'll replace this with your actual data
  const categories = {
    Electronics: ["Mobile Phones", "Laptops", "Accessories", "Components"],
    Clothing: ["T-Shirts", "Shirts", "Pants", "Accessories"],
    "Home & Garden": ["Furniture", "Decor", "Kitchen", "Tools"],
    Industrial: ["Machinery", "Tools", "Safety Equipment", "Raw Materials"],
  };

  // Load existing product data
  useEffect(() => {
    const foundProduct = items.find((p) => p.id.toString() === id);
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Determine if product has variants
      const hasVariants = foundProduct.variants && foundProduct.variants.length > 0;
      
      setFormData({
        title: foundProduct.name || foundProduct.title || "",
        category: foundProduct.category || "",
        subCategory: foundProduct.subCategory || "",
        sku: foundProduct.sku || "",
        images: foundProduct.images || [],
        description: foundProduct.description || "",
        specifications: foundProduct.specifications || {
          material: "",
          modelNumber: "",
          packing: "",
          moq: "",
          package: "",
          singlePackageSize: "",
          singleGrossWeight: "",
          recommendedAge: "",
          gender: "",
        },
        tags: foundProduct.tags || "",
        price: hasVariants ? "" : (foundProduct.price?.toString() || ""),
        compareAtPrice: hasVariants ? "" : (foundProduct.compareAtPrice?.toString() || ""),
        mrp: hasVariants ? "" : (foundProduct.mrp?.toString() || ""),
        cost: hasVariants ? "" : (foundProduct.cost?.toString() || ""),
        stock: hasVariants ? "" : (foundProduct.inventory?.toString() || foundProduct.stock?.toString() || ""),
        hasVariants: hasVariants,
        variants: hasVariants ? foundProduct.variants : [
          {
            size: "",
            color: "",
            images: [],
            price: foundProduct.price?.toString() || "",
            compareAtPrice: foundProduct.compareAtPrice?.toString() || "",
            mrp: foundProduct.mrp?.toString() || "",
            cost: foundProduct.cost?.toString() || "",
            sku: foundProduct.sku || "",
            barcode: "",
            stock: foundProduct.inventory?.toString() || foundProduct.stock?.toString() || "",
            continueSelling: false,
          },
        ],
        seo: foundProduct.seo || {
          title: "",
          description: "",
          url: "",
        },
        status: foundProduct.status || "draft",
      });

      // Set tags if they exist
      if (foundProduct.tags) {
        const tagsArray = Array.isArray(foundProduct.tags) 
          ? foundProduct.tags 
          : foundProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        setTags(tagsArray);
      }

      // Set uploaded images
      if (foundProduct.images && foundProduct.images.length > 0) {
        setUploadedImages(foundProduct.images);
      }
    } else {
      navigate("/dashboard/products");
    }
  }, [id, items, navigate]);

  const breadcrumbItems = [
    { name: "Products", href: "/dashboard/products" },
    { name: product?.name || "Edit product" },
  ];

  const statusOptions = [
    {
      value: "active",
      label: "Active",
      description: "This product will be available in your online store",
    },
    {
      value: "draft",
      label: "Draft",
      description: "This product will be hidden from your online store",
    },
    {
      value: "archived",
      label: "Archived",
      description: "This product will be archived and hidden",
    },
  ];

  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleVariantChange = (variantIndex, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex] = {
      ...updatedVariants[variantIndex],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));
  };

  const addVariant = () => {
    const newVariant = {
      size: "",
      color: "",
      images: [],
      price: "",
      compareAtPrice: "",
      mrp: "",
      cost: "",
      sku: "",
      barcode: "",
      stock: "",
      continueSelling: false,
    };
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
  };

  const removeVariant = (variantIndex) => {
    if (formData.variants.length > 1) {
      const updatedVariants = formData.variants.filter(
        (_, index) => index !== variantIndex
      );
      setFormData((prev) => ({
        ...prev,
        variants: updatedVariants,
      }));
    }
  };

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      setFormData((prev) => ({
        ...prev,
        tags: newTags.join(", "),
      }));
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setFormData((prev) => ({
      ...prev,
      tags: newTags.join(", "),
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleMainImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = {
          id: Date.now() + Math.random(),
          file,
          url: event.target.result,
          name: file.name,
        };
        newImages.push(imageData);
        if (newImages.length === files.length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...newImages],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVariantImageUpload = (variantIndex, e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = {
          id: Date.now() + Math.random(),
          file,
          url: event.target.result,
          name: file.name,
        };
        newImages.push(imageData);
        if (newImages.length === files.length) {
          setVariantImages((prev) => ({
            ...prev,
            [variantIndex]: [...(prev[variantIndex] || []), ...newImages],
          }));

          const updatedVariants = [...formData.variants];
          updatedVariants[variantIndex] = {
            ...updatedVariants[variantIndex],
            images: [
              ...(updatedVariants[variantIndex].images || []),
              ...newImages,
            ],
          };
          setFormData((prev) => ({
            ...prev,
            variants: updatedVariants,
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMainImage = (imageId) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  const removeVariantImage = (variantIndex, imageId) => {
    setVariantImages((prev) => ({
      ...prev,
      [variantIndex]: (prev[variantIndex] || []).filter(
        (img) => img.id !== imageId
      ),
    }));

    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex] = {
      ...updatedVariants[variantIndex],
      images: (updatedVariants[variantIndex].images || []).filter(
        (img) => img.id !== imageId
      ),
    };
    setFormData((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));
  };

  const handleSave = (status = "draft") => {
    const productData = {
      ...product,
      ...formData,
      id: product.id,
      status,
      name: formData.title,
      category: formData.category,
      inventory: formData.hasVariants 
        ? formData.variants.reduce((sum, variant) => sum + (parseInt(variant.stock) || 0), 0)
        : parseInt(formData.stock) || 0,
      price: formData.hasVariants 
        ? parseFloat(formData.variants[0]?.price || 0)
        : parseFloat(formData.price || 0),
      sku: formData.hasVariants 
        ? formData.variants[0]?.sku || ""
        : formData.sku || "",
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateProduct(productData));
    navigate("/dashboard/products");
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`)) {
      dispatch(deleteProduct(product.id));
      navigate("/dashboard/products");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit product</h1>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Delete product
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/products")}
            >
              Cancel
            </Button>
            <Button variant="outline" onClick={() => handleSave("draft")}>
              Save as draft
            </Button>
            <Button
              onClick={() => handleSave("active")}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              Save product
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <ProductDetailsCard
            formData={formData}
            handleInputChange={handleInputChange}
            categories={categories}
            tags={tags}
            tagInput={tagInput}
            setTagInput={setTagInput}
            addTag={addTag}
            removeTag={removeTag}
            handleTagKeyPress={handleTagKeyPress}
            tagInputRef={tagInputRef}
          />
          <SpecificationsCard
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <PricingCard
            formData={formData}
            handleInputChange={handleInputChange}
            handleVariantChange={handleVariantChange}
            addVariant={addVariant}
            removeVariant={removeVariant}
            variantImages={variantImages}
            handleVariantImageUpload={handleVariantImageUpload}
            removeVariantImage={removeVariantImage}
          />
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <StatusCard
            formData={formData}
            handleInputChange={handleInputChange}
            statusOptions={statusOptions}
          />
          <ImageUploadArea
            uploadedImages={uploadedImages}
            handleMainImageUpload={handleMainImageUpload}
            removeMainImage={removeMainImage}
          />
        </div>
      </div>
    </>
  );
};

export default EditProduct;