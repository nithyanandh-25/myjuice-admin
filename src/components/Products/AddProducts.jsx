import { useState } from 'react';
import { addProducts } from '../../Apis/ProductsApis';

const AddProducts = ({ onFormSubmit, onCancel, onProductAdded }) => {
    const [products, setProducts] = useState([
        { name: '', quantity: '', price: '', image: null }
    ]);

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProducts = [...products];
        updatedProducts[index][name] = value;
        setProducts(updatedProducts);
    };

    const handleImageChange = (index, e) => {
        const updatedProducts = [...products];
        updatedProducts[index].image = e.target.files[0];
        setProducts(updatedProducts);
    };

    const addAnotherProduct = () => {
        setProducts([...products, { name: '', quantity: '', price: '', image: null }]);
    };

    const removeProduct = (index) => {
        const updatedProducts = products.filter((_, i) => i !== index);
        setProducts(updatedProducts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productDataArray = products.map(product => {
            const productData = new FormData();
            productData.append('name', product.name);
            productData.append('quantity', product.quantity);
            productData.append('price', product.price);
            if (product.image) {
                productData.append('image', product.image);
            }
            return productData;
        });

        try {
            const responses = await Promise.all(productDataArray.map(data => addProducts(data)));
            console.log(responses);
            onFormSubmit(responses);
            onProductAdded();
        } catch (error) {
            console.error("Error adding products:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-products-container">
            {products.map((product, index) => (
                <div key={index} className="product-input-group">
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={(e) => handleChange(index, e)}
                        className="input-text"
                        placeholder="Name"
                    />
                    <input
                        type="text"
                        name="quantity"
                        value={product.quantity}
                        onChange={(e) => handleChange(index, e)}
                        className="input-text"
                        placeholder="Quantity in ml"
                    />
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={(e) => handleChange(index, e)}
                        className="input-number"
                        placeholder="Price"
                    />
                    <input
                        type="file"
                        onChange={(e) => handleImageChange(index, e)}
                        className="input-file"
                    />
                    <span className="remove-product" onClick={() => removeProduct(index)}>
                        ✖
                    </span>
                </div>
            ))}
            <span className="add-product" onClick={addAnotherProduct}>
                + Add
            </span>
            <button type="submit" className="product-button">Submit</button>
            <button type="button" className="product-button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default AddProducts;