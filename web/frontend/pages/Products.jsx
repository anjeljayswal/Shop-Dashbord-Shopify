import React, { useEffect, useState } from 'react';
import { Page, Layout, LegacyCard, Grid } from '@shopify/polaris';
import { Add, Delete } from '@mui/icons-material';
import ProductForm from '../components/ProductForm';

function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // let {responseData, isLoading, error} = useApiRequest("/api/products/all", "GET");

  let [isModalOpen, setIsModalOpen] = useState(false);
  let [formData, setFormData] = useState({});
  let [isCreateModel, setIsCreateModel] = useState(false);

  const defaultFormData = {
    title: "",
    body_html: "",
    handle: "",
    variants: [{ price: 0 }],
    image: { src: "" }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products/all");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        console.log('data: ', data);
        setProducts(data);
      } catch (err) {
        console.error("Error:", err);
        setError("Unable to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  function productHandler(productid) {
    setIsModalOpen(true);
    let searchProduct = products?.data.find(elem => elem.id === productid);
    setFormData(() => ({
      ...searchProduct
    }));
  }

  let submitHandler = (e) => {
    e.preventDefault();
    fetch("/api/product/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (response.ok) {
          setIsModalOpen(false);
        }
        return response.json();
      })
      .then(data => {
        console.log(data)
      })
      .catch(error => console.log(error))
  }

  let valueHandler = (e) => {
    let { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  let createHandler = async () => {
    try {
      let request = await fetch("/api/product/create", {
        method: "POST",
      });
      let response = await request.json();
      console.log(response);
    } catch (error) {
      console.log(error)
    }
  }
  const openCreateModal = () => {
    setFormData(defaultFormData);
    setIsCreateModel(true);
  };
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/product/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Created:", data);
      if (response.ok) {
        setIsCreateModel(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  let deleteHandler = async (productId) => {
    if (!productId) {
      console.error("No product ID provided for deletion.");
      return;
    }
    try {
      const request = await fetch("/api/product/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }), // <-- send in body
      });
      const response = await request.json();
      console.log(response);

      if (request.ok) {
        setIsModalOpen(false);
        setProducts(prev => ({
          ...prev,
          data: prev.data.filter(p => p.id !== productId)
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <button onClick={openCreateModal} className='button'>New <Add /></button>
        </Layout.Section>
        <Layout.Section>
          <Grid>
            {
              !isLoading && products.data.map((product) => (
                <Grid.Cell key={product.id} columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 3 }}>
                  <div className="card" onClick={() => productHandler(product.id)}>
                    <LegacyCard sectioned >
                      <img src={product?.image?.src} alt="product media" className='product-image' />

                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <h2 className="product-title">{product.title}</h2>
                          <p className="product-price">INR {product.variants[0].price}</p>
                        </div>
                        <div>
                          <button
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                            type="button"
                            className='button danger'
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHandler(product.id);
                            }}
                          >
                            <Delete style={{ fontSize: 18 }} />

                          </button>
                        </div>
                      </div>


                    </LegacyCard>

                  </div>
                </Grid.Cell>
              ))
            }
          </Grid>
        </Layout.Section>
      </Layout>
      {
        isModalOpen && (
          <div className='product-modal'>
            <p className="btn-close" onClick={() => setIsModalOpen(false)}>X</p>
            <div className="modal-form">
              <form onSubmit={submitHandler}>
                <div className="image-block">
                  <img src={formData?.image?.src} alt="product media" />
                </div>
                <div className="form-fields">
                  <input type="hidden" name="id" value={formData.id} />
                  <input type="text" name="title" id="title" value={formData.title} onChange={valueHandler} />
                  <input type="number" name="formData.variants[0].price" id="price" value={formData.variants[0].price} onChange={valueHandler} />
                  <textarea name="body_html" id="body_html" cols="30" rows="10" value={formData.body_html} onChange={valueHandler}></textarea>
                  <input type="text" name="handle" id="handle" value={formData.handle} onChange={valueHandler} />
                  <input className='button' type="submit" value="Update" />
                </div>
              </form>
            </div>
          </div>
        )
      }
      {
        isCreateModel && (
          <div className='product-modal'>
            <p className="btn-close" onClick={() => setIsCreateModel(false)}>X</p>
            <div className="modal-form">
              <ProductForm
                formData={formData}
                setFormData={setFormData}
                isCreateMode={true}
                imageFile={null}
                setImageFile={() => { }}
                submitHandler={handleCreateSubmit}
              />
            </div>
          </div>
        )
      }
    </Page>
  )
}

export default Products