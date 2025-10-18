import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal, Form, Image } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/footer";
import { getStudentById, updateStudent } from "../service/StudentService";
import { 
    deleteProduct, 
    getAvailableProductsByStudent, 
    updateProduct, 
    getSoldProductsByStudent 
} from "../service/ProductService"; 
import { useNavigate } from "react-router-dom";

// Hardcoded residence addresses
const residenceAddresses = {
  "President House": { streetNumber: "22", streetName: "Barrack Street", suburb: "Cape Town City Center", city: "Cape Town", province: "Western Cape", postalCode: "8001" },
  "New Market Junction": { streetNumber: "45", streetName: "New Market Street", suburb: "Woodstock", city: "Cape Town", province: "Western Cape", postalCode: "8005" },
  "Plein House": { streetNumber: "10", streetName: "Plein Street", suburb: "Central", city: "Cape Town", province: "Western Cape", postalCode: "8001" },
};

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States for student profile editing
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [residenceId, setResidenceId] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  
  // PRODUCT LISTING STATES
  const [availableListings, setAvailableListings] = useState([]);
  const [soldListings, setSoldListings] = useState([]);

  // States for editing product
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();
  const studentId = localStorage.getItem("studentId");

  // --- Image Handlers ---
  const getProfileImageUrl = () => {
    if (!student || !student.profileImage || typeof student.profileImage !== 'string') {
        return null;
    }
    
    if (student.profileImage.startsWith("data:image")) {
        return student.profileImage;
    }
    
    return `data:image/jpeg;base64,${student.profileImage}`; 
  };

  const getInitials = (firstName = "", lastName = "") => (firstName?.charAt(0) || "") + (lastName?.charAt(0) || "").toUpperCase();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImageFile(file);
    setImagePreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  // --- Form & Data Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResidenceChange = (e) => {
    const residenceName = e.target.value;
    setFormData(prev => ({ ...prev, residenceName }));

    const addressInfo = residenceAddresses[residenceName] || {};
    setFormData(prev => ({
        ...prev,
        streetNumber: addressInfo.streetNumber || '',
        streetName: addressInfo.streetName || '',
        suburb: addressInfo.suburb || '',
        city: addressInfo.city || '',
        province: addressInfo.province || '',
        postalCode: addressInfo.postalCode || '',
    }));
  };
  
  const handleSave = async () => {
    try {
        const studentDto = {
            studentId: student.studentId, 
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            
            residence: {
                residenceId: residenceId,
                residenceName: formData.residenceName,
                roomNumber: formData.roomNumber,
                floorNumber: parseInt(formData.floorNumber) || 0,
                buildingName: formData.building,
                
                address: {
                    addressId: addressId,
                    streetNumber: formData.streetNumber,
                    streetName: formData.streetName,
                    suburb: formData.suburb,
                    city: formData.city,
                    province: formData.province,
                    postalCode: formData.postalCode,
                }
            }
        };

        const form = new FormData();
        form.append("student", new Blob([JSON.stringify(studentDto)], { type: "application/json" }));
        
        if (selectedImageFile) {
            form.append("profileImage", selectedImageFile);
        }

        const response = await updateStudent(student.studentId, form);
        setStudent(response.data);
        localStorage.setItem("user", JSON.stringify(response.data)); 

        setShowModal(false);
        setSelectedImageFile(null);
        setImagePreviewUrl(null); 
        toast.success("Profile updated successfully!");
    } catch (err) {
        console.error("Error updating profile:", err);
        toast.error("Failed to update profile.");
    }
  };

  const fetchAvailableProducts = async () => {
    try {
      if (!studentId) return;
      const response = await getAvailableProductsByStudent(studentId);
      setAvailableListings(response.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load active listings.");
    }
  };

  const fetchSoldProducts = async () => {
    try {
        if (!studentId) return;
        const response = await getSoldProductsByStudent(studentId);
        setSoldListings(response.data || []);
    } catch (err) {
        console.error(err);
        toast.error("Failed to load sold items.");
    }
  };
    
  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) {
        setLoading(false);
        toast.error("Student ID not found. Please log in.");
        return;
      }

      setLoading(true);
      try {
        const response = await getStudentById(studentId);
        const data = response.data;
        
        setStudent(data);

        const residenceName = data.residence?.residenceName;
        const addressInfo = residenceAddresses[residenceName] || data.residence?.address || {};

        setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            residenceName: residenceName || '',
            roomNumber: data.residence?.roomNumber || '',
            floorNumber: data.residence?.floorNumber || 0,
            building: data.residence?.buildingName || '',
            streetNumber: addressInfo.streetNumber || '',
            streetName: addressInfo.streetName || '',
            suburb: addressInfo.suburb || '',
            city: addressInfo.city || '',
            province: addressInfo.province || '',
            postalCode: addressInfo.postalCode || '',
        });
        setResidenceId(data.residence?.residenceId || null);
        setAddressId(data.residence?.address?.addressId || null);

        await fetchAvailableProducts();
        await fetchSoldProducts(); 
      } catch (err) {
        console.error("Failed to load profile data:", err);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  // --- Product Handlers ---
  const handleRemove = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      await deleteProduct(productId);
      setAvailableListings(prev => prev.filter(p => p.productId !== productId));
      toast.success("Item removed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item.");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditFormData({
      productName: product.productName,
      price: product.price,
      description: product.productDescription || "",
    });
    setEditImagePreview(product.imageData ? `data:${product.imageType};base64,${product.imageData}` : null);
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    setEditImageFile(file);
    setEditImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSaveEditedProduct = async () => {
    if (!editingProduct) return;

    try {
      const updatedProductDto = {
        productId: editingProduct.productId,
        productName: editFormData.productName,
        price: parseFloat(editFormData.price),
        productDescription: editFormData.description,
        
        condition: editingProduct.condition, 
        productCategory: editingProduct.productCategory,
        availabilityStatus: editingProduct.availabilityStatus,
        seller: editingProduct.seller, 
        currency: editingProduct.currency,
        releaseDate: editingProduct.releaseDate
      };

      const formData = new FormData();
      formData.append("product", new Blob([JSON.stringify(updatedProductDto)], { type: "application/json" }));
      
      if (editImageFile) {
        formData.append("productImage", editImageFile);
      } 

      const response = await updateProduct(editingProduct.productId, formData); 

      setAvailableListings(prev =>
        prev.map(p => (p.productId === editingProduct.productId ? response.data : p))
      );

      setShowEditModal(false);
      setEditingProduct(null);
      setEditImageFile(null);
      setEditImagePreview(null);
      toast.success("Product updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product.");
    }
  };

  if (loading) return <p>Loading student profile...</p>;
  if (!student) return <p>No student data found.</p>;

  return (
    <>
      <Header />
      <div className="container mt-4">
        {/* Student Info */}
        <div className="border rounded shadow-sm p-4 mb-4 d-flex justify-content-between align-items-start">
            <div className="d-flex align-items-center">
                <div className="me-4">
                    {getProfileImageUrl() ? (
                        <Image 
                            src={getProfileImageUrl()} 
                            roundedCircle 
                            style={{ width: "120px", height: "120px", objectFit: "cover", border: "2px solid #ccc" }} 
                            alt="Profile" 
                        />
                    ) : (
                        <div className="d-flex align-items-center justify-content-center" style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "#616868ff", color: "white", fontWeight: "bold", fontSize: "40px", border: "2px solid #ccc" }}>
                            {getInitials(student.firstName, student.lastName)}
                        </div>
                    )}
                </div>
                <div>
                    <h2>{student.firstName} {student.lastName}</h2>
                    <p className="lead text-muted">{student.email}</p>
                   
                </div>
            </div>
            <div className="d-flex flex-column align-items-start">
                <p><strong>Residence:</strong> {student.residence?.residenceName}</p>
                <p><strong>Floor:</strong> {student.residence?.floorNumber ?? 'N/A'}</p>
                {student.residence?.address && (
                    <p><strong>Address:</strong> {student.residence.address.streetNumber} {student.residence.address.streetName}, {student.residence.address.suburb}</p>
                )}
                <Button onClick={() => setShowModal(true)} className="mt-2">Edit Profile</Button>
            </div>
        </div>

        <div className="row g-4">
          
          {/* Active Listings */}
          <div className="col-md-6">
            <div className="border rounded shadow-sm p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "500px" }}>
              <h4 className="text-secondary">Active Listings</h4>
              <span className="badge bg-primary">{availableListings.length} items</span>
              <div className="overflow-auto mt-3" style={{ maxHeight: "420px" }}>
                {availableListings.length > 0 ? availableListings.map((product) => (
                  <div key={product.productId} className="card mb-3 shadow-sm">
                    <img src={product.imageData ? `data:${product.imageType};base64,${product.imageData}` : "/images/placeholder.png"} className="card-img-top" alt={product.productName} />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.productName}</h5>
                      <p className="card-text">R{product.price}</p>
                      <div className="mt-auto d-flex justify-content-between">
                        <Button size="sm" variant="outline-primary" onClick={() => handleEditProduct(product)}>Edit</Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleRemove(product.productId)}>Remove</Button>
                      </div>
                    </div>
                  </div>
                )) : <p>No active listings.</p>}
              </div>
            </div>
          </div>

          {/* Sold Items */}
          <div className="col-md-6">
            <div className="border rounded shadow-sm p-4" style={{ backgroundColor: "#e9f7ef", minHeight: "500px" }}>
              <h4 className="text-success">Sold Items</h4>
              <span className="badge bg-success">{soldListings.length || 0} items</span>
              <div className="overflow-auto mt-3" style={{ maxHeight: "420px" }}>
                {soldListings.length > 0 ? soldListings.map((product) => ( 
                  <div key={product.productId} className="card mb-3 shadow-sm">
                    <img
                      src={product.imageData ? `data:${product.imageType};base64,${product.imageData}` : "/images/placeholder.png"}
                      className="card-img-top"
                      alt={product.productName}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.productName}</h5>
                      <p className="card-text">Sold for: R{product.price}</p>
                    </div>
                  </div>
                )) : <p>No sold items.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* EDIT PROFILE MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Profile</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3 d-flex flex-column align-items-center">
                <Image 
                    src={imagePreviewUrl || getProfileImageUrl() || "/images/placeholder.png"} 
                    roundedCircle 
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    className="mb-2"
                    alt="Profile Preview"
                />
                <Form.Label>Change Profile Picture</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} /> 
            </Form.Group>
            <hr />
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstName" value={formData.firstName || ''} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastName" value={formData.lastName || ''} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email || ''} onChange={handleInputChange} disabled />
            </Form.Group>

            <h5 className="mt-4">Residence Details</h5>
            <Form.Group className="mb-3">
              <Form.Label>Residence Name</Form.Label>
              <Form.Control 
                as="select" 
                name="residenceName" 
                value={formData.residenceName || ''} 
                onChange={handleResidenceChange}
              >
                <option value="">Select Residence</option>
                {Object.keys(residenceAddresses).map(name => (
                    <option key={name} value={name}>{name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Room Number</Form.Label>
              <Form.Control type="text" name="roomNumber" value={formData.roomNumber || ''} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Floor Number</Form.Label>
              <Form.Control type="number" name="floorNumber" value={formData.floorNumber || ''} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Profile</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control name="productName" value={editFormData.productName || ''} onChange={handleEditInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control name="price" type="number" value={editFormData.price || ''} onChange={handleEditInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" as="textarea" value={editFormData.description || ''} onChange={handleEditInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Change Image</Form.Label>
              <Form.Control type="file" onChange={handleEditFileChange} />
              {editImagePreview && <Image src={editImagePreview} rounded style={{ width: "100px", height: "100px", marginTop: "10px" }} />}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSaveEditedProduct}>Save Product</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
