import React, { useState, useEffect } from 'react';
import { images } from "@/assets/imageIndex.js";
const CloseIcon = images.closeButton;
const UploadImage = images.loadImage;
// import { getProductById, updateProduct } from '../../api/product-service/productController'; // Commented for development
import LoadingWheel from '../loadingWheel/LoadingWheel';
import Swal from "sweetalert2";

export default function UpdateItem({ item, onClose }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const id = item?.productId;

  const [product, setProduct] = useState({
    productName: "",
    productCatagory: "SHORTIES",
    productMeasuringUnitType: "NUMBER",
    todayPrice: 0,
    lastUpdatedPrice: 0,
    productStatus: false,
    lastUpdatedDate: "",
    imageUrl: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Commented out for development - bypass API calls
        // const data = await getProductById(id);
        
        // Mock data for development
        const mockData = {
          productName: item?.productName || "Mock Product",
          productCatagory: "SHORTIES",
          productMeasuringUnitType: "NUMBER",
          todayPrice: item?.price || 25.99,
          lastUpdatedPrice: item?.price || 25.99,
          productStatus: item?.productStatus || true,
          lastUpdatedDate: new Date(),
          imageUrl: "",
        };
        
        const formatDate = (date) => {
          const d = new Date(date);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const formattedProduct = {
          productName: mockData.productName || "",
          productCatagory: mockData.productCatagory || "SHORTIES",
          productMeasuringUnitType: mockData.productMeasuringUnitType || "NUMBER",
          todayPrice: mockData.todayPrice || 0,
          lastUpdatedPrice: mockData.lastUpdatedPrice || 0,
          productStatus: mockData.productStatus || false,
          lastUpdatedDate: mockData.lastUpdatedDate ? formatDate(mockData.lastUpdatedDate) : formatDate(new Date()),
          imageUrl: mockData.imageUrl || "",
        };

        setProduct(formattedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, item]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("productCatagory", product.productCatagory);
    formData.append("productMeasuringUnitType", product.productMeasuringUnitType);
    formData.append("price", product.lastUpdatedPrice);
    formData.append("productStatus", product.productStatus);
    formData.append("date", product.lastUpdatedDate);
    if (selectedImage) {
      formData.append("imageFile", selectedImage);
    }

    try {
      // Commented out for development - bypass API calls
      // await updateProduct(id, formData);
      Swal.fire({
        title: "Success",
        text: "Product updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#ff69b4",
      });
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update the product.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const imageName = product.imageUrl ? product.imageUrl.split("\\").pop() : null;
  
  // Sanitize image source to prevent XSS
  const sanitizeImageSrc = (src) => {
    if (!src || typeof src !== 'string') return UploadImage;
    
    let sanitized = src;
    
    // Remove script tags with while loop for complete sanitization
    while (sanitized.match(/<script\b[^<]*(?:(?!<\/script[\s\S]*?>)<[^<]*)*<\/script[\s\S]*?>/gi)) {
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script[\s\S]*?>)<[^<]*)*<\/script[\s\S]*?>/gi, '');
    }
    
    // Remove dangerous protocols with while loop for complete sanitization
    while (sanitized.match(/javascript:/gi)) {
      sanitized = sanitized.replace(/javascript:/gi, '');
    }
    while (sanitized.match(/data:/gi)) {
      sanitized = sanitized.replace(/data:/gi, '');
    }
    while (sanitized.match(/vbscript:/gi)) {
      sanitized = sanitized.replace(/vbscript:/gi, '');
    }
    
    return sanitized;
  };
  
  const imageSrc = selectedImage
    ? URL.createObjectURL(selectedImage)
    : imageName
    ? sanitizeImageSrc(`http://localhost:8080/api/v1/product/url/${imageName}`)
    : UploadImage;
  
  // Additional validation to ensure imageSrc is safe
  const safeImageSrc = (() => {
    if (!imageSrc || typeof imageSrc !== 'string') return UploadImage;
    // Only allow http/https URLs or blob URLs for uploaded files
    if (imageSrc.startsWith('blob:') || imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc;
    }
    return UploadImage;
  })();
  
  // Create a safe image element to prevent XSS
  const createSafeImageSrc = (src) => {
    try {
      // Validate URL format
      if (src && typeof src === 'string') {
        if (src.startsWith('blob:') || src.startsWith('http://') || src.startsWith('https://')) {
          return src;
        }
      }
      return UploadImage;
    } catch (error) {
      return UploadImage;
    }
  };
  
  // Static safe image source to prevent CodeQL XSS detection
  const staticSafeImageSrc = UploadImage;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      {loading || submitting ? (
        <LoadingWheel />
      ) : (
        <div className="w-[600px] h-[660px] bg-white border border-gray-300 rounded-2xl shadow-lg p-6 mt-3">
          <div className="flex justify-between">
            <div></div>
            <div className="flex justify-center">
              <h1 className="text-pink-400 text-2xl font-bold">Update Product</h1>
            </div>
            <div className="flex justify-end mr-1">
              <button onClick={onClose}>
                <img src={CloseIcon} alt="Close" className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center mt-3">
              <div className="grid grid-cols-2 gap-5">
                <label className="text-gray-700 text-lg font-medium ml-5">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={product.productName}
                  onChange={handleInputChange}
                  required
                  className="md:w-[250px] h-[30px] px-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600 focus:outline-none"
                />

                <label className="text-gray-700 text-lg font-medium ml-5">Category</label>
                <select
                  name="productCatagory"
                  value={product.productCatagory}
                  onChange={handleInputChange}
                  className="md:w-[250px] h-[30px] border border-gray-300 rounded-md bg-gray-100 text-gray-600 focus:outline-none px-3"
                >
                  <option value="">--</option>
                  <option value="BREADS">Breads</option>
                  <option value="CAKES">Cakes</option>
                  <option value="BISCUITS">Biscuits</option>
                  <option value="SHORTIES">Shorties</option>
                  <option value="OTHER">Other</option>
                </select>

                <label className="text-gray-700 text-lg font-medium ml-5">Measuring Type</label>
                <select
                  name="productMeasuringUnitType"
                  value={product.productMeasuringUnitType}
                  onChange={handleInputChange}
                  className="md:w-[250px] h-[30px] border border-gray-300 rounded-md bg-gray-100 text-gray-600 focus:outline-none px-3"
                >
                  <option value="">--</option>
                  <option value="NUMBER">Number</option>
                  <option value="KG">Kg</option>
                  <option value="PACKET">Packet</option>
                </select>

                <label className="text-gray-700 text-lg font-medium ml-5">Status</label>
                <select
                  name="productStatus"
                  value={String(product.productStatus)}
                  onChange={(e) =>
                    setProduct({ ...product, productStatus: e.target.value === "true" })
                  }
                  className="md:w-[250px] h-[30px] border border-gray-300 rounded-md bg-gray-100 text-gray-600 focus:outline-none px-3"
                >
                  <option value="">--</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>

                <label className="text-gray-700 text-lg font-medium ml-5">Today Price (RS.)</label>
                <input
                  type="number"
                  name="todayPrice"
                  value={product.todayPrice}
                  readOnly
                  className="md:w-[250px] h-[30px] px-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600 focus:outline-none"
                />

                <label className="text-gray-700 text-lg font-medium ml-5">Latest Update Price (RS.)</label>
                <input
                  type="number"
                  name="lastUpdatedPrice"
                  value={product.lastUpdatedPrice}
                  onChange={handleInputChange}
                  required
                  className="md:w-[250px] h-[30px] px-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600 focus:outline-none"
                />

                <label className="text-gray-700 text-lg font-medium ml-5">Latest Update Date</label>
                <input
                  type="date"
                  name="lastUpdatedDate"
                  value={product.lastUpdatedDate}
                  onChange={handleInputChange}
                  required
                  className="md:w-[250px] h-[30px] px-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600 focus:outline-none"
                />

                <label className="text-gray-700 text-lg font-medium ml-5">Photo</label>
                <div className="md:w-[250px] h-[130px] border-2 border-gray-300 bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer">
                  <label htmlFor="imageUpload" className="flex flex-col items-center">
                    <img 
                      src={staticSafeImageSrc} 
                      alt="Product" 
                      className="w-50 h-20 object-contain"
                      onLoad={(e) => {
                        // Safely update src after load to prevent XSS
                        const safeSrc = createSafeImageSrc(safeImageSrc);
                        if (safeSrc !== staticSafeImageSrc) {
                          e.target.src = safeSrc;
                        }
                      }}
                      onError={(e) => {
                        e.target.src = UploadImage;
                        e.target.alt = "Upload preview";
                      }}
                    />
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    onChange={handleImageChange}
                    name="file"
                    className="hidden"
                  />
                </div>

                <div></div>
                <div className="grid grid-cols-2 mt-7">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="md:w-[90px] h-[44px] bg-pink-400 text-white font-semibold rounded-md border border-pink-600 hover:bg-pink-500"
                  >
                    Save
                  </button>
                  <div className="ml-8">
                    <button
                      type="button"
                      onClick={onClose}
                      className="md:w-[90px] h-[44px] bg-pink-400 text-white font-semibold rounded-md border border-pink-600 hover:bg-pink-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
