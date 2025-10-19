import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Upload } from "react-bootstrap-icons";
import { capturedProductDetails } from "../service/ProductService";
import { useAuth } from "../context/AuthContext";
import {
  validateSensitiveOperation,
  isTokenNearExpiry,
} from "../utils/authUtils";

const Sell = () => {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    condition: "",
    category: "",
    price: "",
    currency: "zar",
    quantinty: 1,
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isAuthenticated() || !user || !user.data) {
        setIsLoading(false);
        toast.error("You must login first before selling a product.");
        navigate("/login");
        return;
      }

      if (user.role !== "STUDENT") {
        setIsLoading(false);
        toast.error("Only students can sell products.");
        navigate("/home");
        return;
      }

      if (!user.data.studentId) {
        setIsLoading(false);
        toast.error("Student profile incomplete. Please contact support.");
        navigate("/home");
        return;
      }

      try {
        validateSensitiveOperation("CREATE_PRODUCT", user.role, token);
      } catch (error) {
        setIsLoading(false);
        toast.error(error.message);
        if (error.message.includes("re-authenticate")) {
          navigate("/login");
        }
        return;
      }

      if (isTokenNearExpiry(token, 15)) {
        toast.warning(
          "Your session expires soon. Consider refreshing your login after this action."
        );
      }

      const { productName, description, condition, category, price, image } =
        formData;

      if (!productName?.trim()) {
        toast.error("Product name is required.");
        setIsLoading(false);
        return;
      }

      if (!description?.trim()) {
        toast.error("Product description is required.");
        setIsLoading(false);
        return;
      }

      if (!condition) {
        toast.error("Please select product condition.");
        setIsLoading(false);
        return;
      }

      if (!category) {
        toast.error("Please select a category.");
        setIsLoading(false);
        return;
      }

      if (!price || parseFloat(price) <= 0) {
        toast.error("Please enter a valid price.");
        setIsLoading(false);
        return;
      }

      if (parseFloat(price) > 100000) {
        toast.error("Price seems too high. Please verify.");
        setIsLoading(false);
        return;
      }

      const productData = {
        productName: productName.trim(),
        productDescription: description.trim(),
        condition,
        productCategory: category,
        price: parseFloat(price),
        availabilityStatus: true,
        releaseDate: new Date().toISOString().split("T")[0],
        seller: { studentId: user.data.studentId },
      };

      const formDataToSend = new FormData();
      formDataToSend.append(
        "product",
        new Blob([JSON.stringify(productData)], { type: "application/json" })
      );

      if (image) {
        if (image.size > 10 * 1024 * 1024) {
          toast.error("Image size should be less than 10MB.");
          setIsLoading(false);
          return;
        }

        if (!image.type.startsWith("image/")) {
          toast.error("Please select a valid image file.");
          setIsLoading(false);
          return;
        }

        formDataToSend.append("productImage", image);
      }

      console.log("Submitting product with data:", productData);
      console.log(
        "Token being used:",
        token ? `${token.substring(0, 20)}...` : "No token"
      );

      await capturedProductDetails(formDataToSend);

      toast.success("Your item has been submitted for approval!");
      navigate("/home");
    } catch (error) {
      console.error("Error submitting product:", error);

      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
        navigate("/login");
      } else if (error.response?.status === 403) {
        const errorMessage =
          error.response?.data?.message || "Access forbidden";
        toast.error(errorMessage);
        if (errorMessage.includes("re-authenticate")) {
          navigate("/login");
        }
      } else if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.message || "Invalid data provided";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to submit your item. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      productName: "",
      description: "",
      condition: "",
      category: "",
      price: "",
      image: null,
    });
    toast.info("All fields have been reset.");
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <div className="mb-4">
          <Link to="/home" className="btn btn-outline-secondary btn-sm">
            <ArrowLeft className="me-2" size={16} />
            Back to Home
          </Link>
        </div>

        <div className="card mx-auto" style={{ maxWidth: "600px" }}>
          <div className="card-header text-center">
            <h2 className="h4 mb-0 text-primary">Sell Your Item</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="productName" className="form-label">
                  Product Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="productName"
                  name="productName"
                  placeholder="e.g., MacBook Pro 13-inch"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description *
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  placeholder="Describe your item in detail..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="condition" className="form-label">
                  Condition *
                </label>
                <select
                  className="form-select"
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category *
                </label>
                <select
                  className="form-select"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Screens">Screens</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Textbooks">Textbooks</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Cellphones">Cellphones</option>
                  <option value="Appliances">Appliances</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price (R) *
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="form-label">
                  Product Image
                </label>
                <div className="border border-2 border-dashed rounded p-4 text-center">
                  <Upload className="text-muted mb-2" size={32} />
                  <p className="text-muted small mb-2">
                    Click to upload an image or drag and drop
                  </p>
                  <p className="text-muted small mb-3">PNG, JPG up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="form-control"
                    id="image"
                  />
                  {formData.image && (
                    <p className="text-success small mt-2">
                      {formData.image.name} selected
                    </p>
                  )}
                </div>
              </div>

              <div className="d-grid gap-3">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Listing"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg"
                  onClick={handleCancel}
                >
                  Cancel & Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sell;
