import axios from 'axios';

const ProductUrl = "http://localhost:8080/api/products";

export const getProducts = async() => {
    const response = await axios.get(ProductUrl);
    return response.data;
};

export const getProduct = async(id) => {
    const response = await axios.get(`${ProductUrl}/${id}`);
    return response.data;
};

export const addProducts = async(productData) => {
    const response = await axios.post(ProductUrl,productData,{
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export const updateProduct = async (id, formData) => {
    const response = await axios.put(`${ProductUrl}/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};


export const deleteProduct = async(id) => {
    await axios.delete(`${ProductUrl}/${id}`);
}