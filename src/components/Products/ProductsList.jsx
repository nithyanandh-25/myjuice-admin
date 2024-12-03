import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { getProducts, updateProduct, deleteProduct } from "../../Apis/ProductsApis";
import AddProducts from './AddProducts';
import './Product.css';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editingProduct, setEditingProduct] = useState({});
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    
    const navigate = useNavigate(); // For navigation
    const location = useLocation(); // Access location state
    const adminName = location.state?.adminName || "Admin"; // Retrieve admin's name

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const handleEditClick = (product) => {
        setEditingProductId(product.id);
        setEditingProduct(product);
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files.length > 0) {
            setEditingProduct({
                ...editingProduct,
                imageFile: files[0],
            });
        } else {
            setEditingProduct({
                ...editingProduct,
                [name]: value,
            });
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setEditingProduct({
                ...editingProduct,
                imageFile: e.target.files[0]
            });
        }
    };

    const handleUpdate = async () => {
        if (editingProduct) {
            if (!editingProduct.name || !editingProduct.quantity || !editingProduct.price) {
                alert('Name, quantity, and price fields are required.');
                return;
            }

            const formData = new FormData();
            formData.append('name', editingProduct.name);
            formData.append('quantity', editingProduct.quantity);
            formData.append('price', editingProduct.price);

            if (editingProduct.imageFile) {
                formData.append('file', editingProduct.imageFile);
            }

            try {
                await updateProduct(editingProduct.id, formData);
                setEditingProductId(null);
                const updatedProducts = await getProducts();
                setProducts(updatedProducts);
            } catch (error) {
                console.error("Error updating product:", error);
            }
        }
    };

    const handleDelete = (id) => {
        setProductToDelete(id); // Set the product ID to delete
        setShowModal(true); // Show the modal
    };

    const confirmDelete = async () => {
        await deleteProduct(productToDelete);
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
        setShowModal(false); // Hide the modal after deletion
    };

    const cancelDelete = () => {
        setShowModal(false); // Hide the modal without deleting
    };

    const handleAddProduct = async () => {
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
        setIsAddingProduct(false);
    };

    const handleLogout = () => {
        navigate('/'); // Navigate back to the Admin login/register page
    };

    return (
        <div className="product-list-container">
            <div className="header-container">
                <h2 className="product-list-heading">Welcome, {adminName}</h2>
                <button className='logout-button' onClick={handleLogout}>Logout</button>
            </div>
            <button className='product-button' onClick={() => setIsAddingProduct(true)}>
                <span>Add Product</span>
            </button>
            {isAddingProduct && (
                <AddProducts onFormSubmit={handleAddProduct} onCancel={() => setIsAddingProduct(false)} />
            )}
            <table className="product-table">
                <thead>
                    <tr className="product-table-header">
                        <th>Name</th>
                        <th>Quantity in ml</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} className="product-table-row">
                            {editingProductId === product.id ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            className="product-text"
                                            name="name"
                                            value={editingProduct.name}
                                            onChange={handleInputChange}
                                            placeholder="Name"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="product-text"
                                            name="quantity"
                                            value={editingProduct.quantity}
                                            onChange={handleInputChange}
                                            placeholder="Quantity in ml"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="product-number"
                                            name="price"
                                            value={editingProduct.price}
                                            onChange={handleInputChange}
                                            placeholder="Price"
                                        />
                                    </td>
                                    <td>
                                        <label>Current Image:</label>
                                        {editingProduct.image ? (
                                            <img
                                                src={`data:image/jpeg;base64,${editingProduct.image}`}
                                                alt={editingProduct.name}
                                                className="product-table-image"
                                                style={{ width: 50 }}
                                            />
                                        ) : (
                                            'No Image'
                                        )}
                                        <input
                                            type="file"
                                            className="product-file"
                                            name="image"
                                            onChange={handleFileChange}
                                        />
                                    </td>
                                    <td>
                                        <button className='product-button' onClick={handleUpdate}>Update</button>
                                        <button className='product-button' onClick={() => setEditingProductId(null)}>
                                            <span>Cancel</span>
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{product.name || 'N/A'}</td>
                                    <td>{product.quantity || 'N/A'}</td>
                                    <td>{product.price || 'N/A'}</td>
                                    <td>
                                        <img
                                            src={`data:image/jpeg;base64,${product.image}`}
                                            alt={product.name}
                                            className="product-table-image"
                                            style={{ width: 50 }}
                                        />
                                    </td>
                                    <td>
                                        <button className='product-button' onClick={() => handleEditClick(product)}>Edit</button>
                                        <button className='product-button' onClick={() => handleDelete(product.id)}>Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for confirmation */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Are you sure you want to delete this product?</p>
                        <button className='product-button' onClick={confirmDelete}>OK</button>
                        <button className='product-button' onClick={cancelDelete}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsList;
