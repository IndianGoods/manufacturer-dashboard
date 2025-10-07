import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
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
import { addProduct } from "../../store/slices/productsSlice";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";

// Sortable grid for images (main image upload area)
function ImageSortableGrid({ images, setImages, removeImage }) {
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === undefined || to === undefined || from === to) return;
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setImages(updated);
    dragItem.current = undefined;
    dragOverItem.current = undefined;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="relative group"
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          style={{ cursor: "grab" }}
        >
          <div className="w-full h-24 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={image.url}
              alt={`Upload ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => removeImage(image.id)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
          {index === 0 && (
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              Main
            </span>
          )}
          <span className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white bg-opacity-80 rounded px-1 pointer-events-none">Drag</span>
        </div>
      ))}
    </div>
  );
}

// Move components outside to prevent re-rendering
const ImageUploadArea = ({
  uploadedImages,
  setUploadedImages,
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
        <label htmlFor="file-upload" className="block cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors relative">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Add images, or drag and drop
            </span>
            <span className="mt-1 block text-xs text-gray-500">
              JPG, PNG, WEBP, or GIF
            </span>
          </div>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            multiple
            accept="image/*"
            onChange={handleMainImageUpload}
          />
        </label>

        {/* Image Previews with drag-and-drop */}
        {uploadedImages.length > 0 && (
          <ImageSortableGrid
            images={uploadedImages}
            setImages={setUploadedImages}
            removeImage={removeMainImage}
          />
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
        className="h-10 px-3 py-2 text-sm rounded-lg"
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
            className="h-10 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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
            className="h-10 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
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
        className="h-10 px-3 py-2 text-sm rounded-lg"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <div className="border border-gray-300 rounded-md px-2 py-1 min-h-[32px] focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500 bg-white">
          <div className="flex flex-wrap gap-1 mb-1">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:outline-none"
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
            className="h-8 w-full border-0 outline-none text-sm placeholder-gray-400 px-2 py-1 rounded-md"
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">Press Enter or comma to add tags</p>
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
          className="h-10 px-3 py-2 text-sm rounded-lg"
        />

        <Input
          label="Model Number"
          value={formData.specifications.modelNumber}
          onChange={(e) =>
            handleInputChange("modelNumber", e.target.value, "specifications")
          }
          placeholder="Model number"
          className="h-10 px-3 py-2 text-sm rounded-lg"
        />

        <Input
          label="Packing"
          value={formData.specifications.packing}
          onChange={(e) =>
            handleInputChange("packing", e.target.value, "specifications")
          }
          placeholder="Packing details"
          className="h-10 px-3 py-2 text-sm rounded-lg"
        />

        <Input
          label="MOQ (Minimum Order Quantity)"
          type="number"
          value={formData.specifications.moq}
          onChange={(e) =>
            handleInputChange("moq", e.target.value, "specifications")
          }
          placeholder="Minimum order quantity"
          className="h-10 px-3 py-2 text-sm rounded-lg"
        />

        <Input
          label="Package"
          value={formData.specifications.package}
          onChange={(e) =>
            handleInputChange("package", e.target.value, "specifications")
          }
          placeholder="Package type"
          className="h-10 px-3 py-2 text-sm rounded-lg"
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
          className="h-10 px-3 py-2 text-sm rounded-lg"
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
          className="h-10 px-3 py-2 text-sm rounded-lg"
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
          className="h-10 px-3 py-2 text-sm rounded-lg"
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
            className="h-10 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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
      {/* Variants Toggle - moved to top */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="has-variants"
            checked={formData.hasVariants}
            onChange={(e) => handleInputChange("hasVariants", e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label
            htmlFor="has-variants"
            className="text-sm font-medium text-gray-700"
          >
            This product has multiple options, like different sizes or colors
          </label>
        </div>
      </div>

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
              className="h-10 px-3 py-2 text-sm rounded-lg"
            />
            <Input
              label="Compare at Price"
              type="number"
              step="0.01"
              value={formData.compareAtPrice}
              onChange={(e) =>
                handleInputChange("compareAtPrice", e.target.value)
              }
              placeholder="0.00"
              className="h-10 px-3 py-2 text-sm rounded-lg"
            />
            <Input
              label="MRP"
              type="number"
              step="0.01"
              value={formData.mrp}
              onChange={(e) => handleInputChange("mrp", e.target.value)}
              placeholder="0.00"
              className="h-10 px-3 py-2 text-sm rounded-lg"
            />
            <Input
              label="Cost per item"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleInputChange("cost", e.target.value)}
              placeholder="0.00"
              className="h-10 px-3 py-2 text-sm rounded-lg"
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
              className="h-10 px-3 py-2 text-sm rounded-lg"
            />
            <div></div>
          </div>
        </div>
      )}

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
                  className="h-10 px-3 py-2 text-sm rounded-lg"
                />

                <Input
                  label="Color"
                  value={variant.color}
                  onChange={(e) =>
                    handleVariantChange(index, "color", e.target.value)
                  }
                  placeholder="e.g. Red, Blue, Black"
                  className="h-10 px-3 py-2 text-sm rounded-lg"
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
                  className="h-10 px-3 py-2 text-sm rounded-lg"
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
                  className="h-10 px-3 py-2 text-sm rounded-lg"
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
                  className="h-10 px-3 py-2 text-sm rounded-lg"
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
                  className="h-10 px-3 py-2 text-sm rounded-lg"
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
                  className="h-10 px-3 py-2 text-sm rounded-lg"
                />

                <Input
                  label="Barcode"
                  value={variant.barcode}
                  onChange={(e) =>
                    handleVariantChange(index, "barcode", e.target.value)
                  }
                  placeholder="Barcode"
                  className="h-10 px-3 py-2 text-sm rounded-lg"
                />
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
          className="h-10 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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

const CreateProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  // Toy subcategories and product types
  const categories = {
    "Educational Toys": [
      "Building Blocks",
      "STEM Kits",
      "Science Experiment Sets",
      "Math Learning Toys",
      "Language Learning Toys",
      "Geography Toys",
      "Coding Toys",
      "Robotics Kits",
      "Chemistry Sets",
      "Microscopes",
      "Telescopes",
      "Solar System Models",
      "Anatomy Models",
      "Puzzle Games",
      "Brain Teasers",
      "Memory Games",
      "Logic Games",
      "Montessori Toys",
      "Flashcards",
      "Interactive Learning Tablets",
    ],
    "Action Figures & Collectibles": [
      "Superhero Figures",
      "Movie Character Figures",
      "Anime Figures",
      "Villains",
      "Historical Figures",
      "Fantasy Figures",
      "SciFi Figures",
      "Animal Figures",
      "Dinosaur Figures",
      "Vehicle Figures",
      "Collectable Cards",
      "Trading Cards",
      "Model Kits",
      "Die-Cast Models",
      "Battle Collectibles",
      "Bobbleheads",
      "Funko Pop Style Figures",
      "Poseable Figures",
      "Limited Edition Figures",
    ],
    "Dolls & Accessories": [
      "Fashion Dolls",
      "Baby Dolls",
      "Ethnic Dolls",
      "Collectible Dolls",
      "Doll Houses",
      "Doll Furniture",
      "Doll Vehicles",
      "Doll Pets",
      "Doll Carriages",
      "Doll Prams",
      "Doll Clothes",
      "Doll Shoes",
      "Building/Lighting Dollhouse Decorations",
      "Barbie-type Dolls",
      "American Girl Style Dolls",
      "Rag Dolls",
      "Porcelain Dolls",
    ],
    "Vehicles & Transportation": [
      "Die-Cast Cars",
      "Remote Control Cars",
      "Toy Trucks",
      "Construction Vehicles",
      "Emergency Vehicles",
      "Motorcycles",
      "Bicycles",
      "Trains",
      "Train Sets",
      "Airplanes",
      "Helicopters",
      "Boats",
      "Submarines",
      "Space Vehicles",
      "Farm Vehicles",
      "Military Vehicles",
      "Racing Cars",
      "Monster Trucks",
      "Electric Ride-On Cars",
      "Scooters",
      "Go-Karts",
    ],
    "Building & Construction": [
      "LEGO Compatible Blocks",
      "Magnetic Building Sets",
      "Wooden Blocks",
      "Foam Blocks",
      "K'NEX Style Sets",
      "Architecture Sets",
      "City Building Sets",
      "Castle Sets",
      "Space Building Sets",
      "Vehicle Building Kits",
      "Robot Building Kits",
      "Marble Run Sets",
      "Gear Building Sets",
      "Electronic Building Sets",
      "3D Puzzles",
      "Snap Circuits",
      "Engineering Kits",
    ],
    "Arts & Crafts": [
      "Drawing Sets",
      "Painting Supplies",
      "Coloring Books",
      "Crayons",
      "Markers",
      "Colored Pencils",
      "Watercolors",
      "Acrylic Paints",
      "Paint Brushes",
      "Canvas Boards",
      "Sketch Pads",
      "Clay Sets",
      "Modeling Dough",
      "Polymer Clay",
      "Craft Kits",
      "Jewelry Making Kits",
      "Friendship Bracelet Kits",
      "Embroidery Kits",
      "Knitting Sets",
      "Origami Kits",
      "Scrapbooking Supplies",
      "Stickers",
      "Glue Sticks",
      "Bead Sets",
      "Stamp Sets",
    ],
    "Outdoor & Sports Toys": [
      "Bicycles",
      "Skateboards",
      "Roller Skates",
      "Scooters",
      "Jump Ropes",
      "Hula Hoops",
      "Frisbees",
      "Flying Discs",
      "Paddle Rackets",
      "Puppet Sets",
      "Sports Balls",
      "Basketball Hoops",
      "Soccer Balls",
      "Football",
      "Baseball Equipment",
      "Cricket Sets",
      "Golf Sets",
      "Archery Sets",
      "Outdoor Play Tents",
      "Pool Toys",
      "Beach Toys",
      "Sand Toys",
      "Water Play",
      "Sidewalk Chalk",
    ],
    "Electronic & Interactive Toys": [
      "Electronic Learning Toys",
      "Interactive Tablets",
      "Smart Toys",
      "Voice Recognition Toys",
      "Remote Control Toys",
      "Electronic Games",
      "Handheld Games",
      "Talking Toys",
      "Musical Toys",
      "Musical Instruments",
      "Electronic Keyboards",
      "Karaoke Machines",
      "Walkie Talkies",
      "Digital Cameras for Kids",
      "Smart Watches for Kids",
    ],
    "Puzzles & Games": [
      "Jigsaw Puzzles",
      "3D Puzzles",
      "Floor Puzzles",
      "Board Games",
      "Card Games",
      "Strategy Games",
      "Trivia Games",
      "Word Games",
      "Number Games",
      "Matching Games",
      "Cooperative Games",
      "Family Games",
      "Party Games",
      "Travel Games",
      "Classic Games",
      "Electronic Games",
      "Brain Teaser Puzzles",
      "Rubik's Cubes",
    ],
    "Plush & Soft Toys": [
      "Teddy Bears",
      "Stuffed Animals",
      "Character Plushies",
      "Soft Story Toys",
      "Plush Dolls",
      "Plush Puppets",
      "Plush Finger Puppets",
      "Hand Puppets",
      "Sock Puppets",
      "Animal Plush Toys",
      "Stuffed Animals",
      "Interactive Plush Toys",
      "Musical Plush Toys",
      "Glow-in-the-Dark Plush",
      "Stuffed Pillows",
      "Giant Stuffed Animals",
      "Mini Plushies",
    ],
    "Pretend Play": [
      "Kitchen Playsets",
      "Doctor Kits",
      "Tool Sets",
      "Dress-Up Clothes",
      "Cleaning Sets",
      "Cash Registers",
      "Shopping Carts",
      "Salon Sets",
      "Veterinarian Kits",
      "Fire Fighter Sets",
      "Police Sets",
      "Astronaut Costumes",
      "Princess Costumes",
      "Superhero Capes",
      "Puppet Theaters",
      "Play Tents",
    ],
  };

  const breadcrumbItems = [
    { name: "Products", href: "/dashboard/products" },
    { name: "Add product" },
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

  useEffect(() => {
    if (formData.tags) {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      setTags(tagsArray);
    }
  }, []);

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
      ...formData,
      id: Date.now(),
      status,
      name: formData.title,
      category: formData.productType,
      inventory: formData.variants.reduce(
        (sum, variant) => sum + (parseInt(variant.inventory) || 0),
        0
      ),
      price: parseFloat(formData.variants[0]?.price || 0),
      sku: formData.variants[0]?.sku || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addProduct(productData));
    navigate("/dashboard/products");
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Add product</h1>
          <div className="flex items-center space-x-3">
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
          {/* Test 1: SpecificationsCard - OK */}
          <SpecificationsCard
            formData={formData}
            handleInputChange={handleInputChange}
          />
          {/* ImageUploadArea causes overflow - temporarily disabled */}
          {/* <ImageUploadArea
            uploadedImages={uploadedImages}
            handleMainImageUpload={handleMainImageUpload}
            removeMainImage={removeMainImage}
          /> */}
          {/* Add back PricingCard - the main functionality */}
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
          {/* Move ImageUploadArea to sidebar to prevent overflow */}
          <ImageUploadArea
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            handleMainImageUpload={handleMainImageUpload}
            removeMainImage={removeMainImage}
          />
        </div>
      </div>
    </>
  );
};

export default CreateProduct;
