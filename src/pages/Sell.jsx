import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Upload } from "react-bootstrap-icons";
import { capturedProductDetails } from "../service/ProductService";

const Sell = () => {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    condition: "",
    category: "",
    price: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

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
      

      if (!loggedInUser || !loggedInUser.studentId) {
        setIsLoading(false);
        toast.error("You must login first before selling a product.");
        navigate("/")
        return;
      }

      const { productName, description, condition, category, price, image } = formData;

      if (productName && description && condition && category && price) {

        const productData = {
          productName,
          productDescription: description,
          condition,
          productCategory: category,
          price,
          availabilityStatus: true, 
          releaseDate: new Date().toISOString().split("T")[0], 
          seller: { studentId: loggedInUser.studentId }
        };

        
        const formDataToSend = new FormData();
        formDataToSend.append(
          "product",
          new Blob([JSON.stringify(productData)], { type: "application/json" })
        );

        if (image) {
          formDataToSend.append("productImage", image); 
        }

       
        await capturedProductDetails(formDataToSend);

        toast.success("Your item has been submitted for approval!");
        navigate("/home");
      } else {
        toast.error("Please fill in all required fields.");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Failed to submit your item.");
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
