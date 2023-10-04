import React, { useState, useEffect } from 'react';
import './ProductStyles.css';

export function Product({ product, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  const handleUpdate = () => {
    onUpdate(editedProduct);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(product.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  return (
    <tr>
      <td>{product.id}</td>
      <td>{product.title}</td>
      <td>{isEditing ? (<input type="text" name="description" value={editedProduct.description} onChange={handleInputChange}/>) : (editedProduct.description)}</td>
      <td>{isEditing ? (<input type="text" name="price" value={editedProduct.price} onChange={handleInputChange}/>) : (editedProduct.price)}</td>
      <td>{isEditing ? (<input type="text" name="discountPercentage" value={editedProduct.discountPercentage} onChange={handleInputChange}/>) : (`${editedProduct.discountPercentage}%`)}</td>
      <td>{editedProduct.rating}</td>
      <td>{editedProduct.stock}</td>
      <td>{editedProduct.brand}</td>
      <td>{editedProduct.category}</td>
      <td>{isEditing ? (<span><button onClick={handleUpdate}>Update</button></span>) 
      : (
          <div className="Actions">
            <button onClick={handleEdit}>Update</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </td>
    </tr>
  );
}

function Table() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [nextId, setNextId] = useState(31);

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then((res) => res.json())
      .then((data) => setData(data.products));
  }, []);

  const handleAdd = () => {
    setIsAdding(true);

    const newProduct = {
      id: nextId,
      title: 'New Product',
      description: '',
      price: 0,
      discountPercentage: 0,
      rating: 0,
      stock: 0,
      brand: '',
      category: '',
    };

    setNextId(nextId + 1);

    fetch('https://dummyjson.com/products/add', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((addedProduct) => {
        setData([...data, addedProduct]);
        setIsAdding(false);
      });
  };

  const handleUpdate = (editedProduct) => {
    fetch(`https://dummyjson.com/products/${editedProduct.id}`, {
      method: 'PUT',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedData = data.map((item) => {
          if (item.id === editedProduct.id) {
            return editedProduct;
          }
          return item;
        });
        setData(updatedData);
        setIsUpdating(`Product with ID ${editedProduct.id} updated successfully.`);
        setTimeout(() => {
          setIsUpdating(false);
        }, 3000);
      });
  };

  const handleDelete = (productId) => {
    fetch(`https://dummyjson.com/products/${productId}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedData = data.filter((item) => item.id !== productId);
        setData(updatedData);
      });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="Addbutton">
        <button onClick={handleAdd} disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </div>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Rating</th>
            <th>Stock</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((product) => (
            <Product
              key={product.id}
              product={product}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= data.length}>
          Next
        </button>
      </div>
      <div className="pagelength">
        Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
      </div>
      {isUpdating && <div>{isUpdating}</div>}
    </div>
  );
}

export default Table;
