import React, { useEffect, useState } from 'react';

const ProductForm = ({
  formData,
  setFormData,
  isCreateMode,
  imageFile,
  setImageFile,
  submitHandler,
}) => {
  const [previewImage, setPreviewImage] = useState("");

  // Make sure default structure exists to prevent crashes
  useEffect(() => {
    if (!formData.image) {
      setFormData((prev) => ({ ...prev, image: { src: "" } }));
    }
    if (!formData.variants || !Array.isArray(formData.variants)) {
      setFormData((prev) => ({ ...prev, variants: [{ price: "" }] }));
    }
  }, [formData, setFormData]);

  // Handle preview update
  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewImage(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Cleanup
    } else if (formData.image?.src) {
      setPreviewImage(formData.image.src);
    } else {
      setPreviewImage("");
    }
  }, [imageFile, formData.image?.src]);

  const valueHandler = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      setFormData((prev) => ({
        ...prev,
        variants: [{ price: value }],
      }));
    } else if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: { src: value },
      }));
      setImageFile(null); // Clear file if user types URL
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Optional: Clear image URL so only file is used
      setFormData((prev) => ({
        ...prev,
        image: { src: "" },
      }));
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="image-block">
        {previewImage ? (
          <img src={previewImage} alt="Preview" style={{ maxWidth: "100%", maxHeight: 200 }} />
        ) : (
          <p>No image selected</p>
        )}
      </div>

      <div className="form-fields">
        {!isCreateMode && (
          <input type="hidden" name="id" value={formData.id || ""} />
        )}

        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={valueHandler}
          placeholder="Title"
        />

        <input
          type="text"
          name="price"
          value={formData.variants?.[0]?.price || ""}
          onChange={valueHandler}
          placeholder="Price"
        />

        <input
          type="text"
          name="image"
          value={formData.image?.src || ""}
          onChange={valueHandler}
          placeholder="Image URL"
        />

        {/* <input
          type="file"
          accept="image/*"
          onChange={fileChangeHandler}
        /> */}

        <textarea
          name="body_html"
          value={formData.body_html || ""}
          onChange={valueHandler}
          placeholder="Description"
        />

        <input
          type="text"
          name="handle"
          value={formData.handle || ""}
          onChange={valueHandler}
          placeholder="Handle"
        />
        {/* BOGO Checkbox */}
        <div style={{ display: "flex", flexDirection:"row", alignItems: "center", gap: "8px", margin: "" }}>
          <input
            type="checkbox"
            name="isBogo"
            checked={!!formData.isBogo}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                isBogo: e.target.checked,
              }))
            }
          />
          Buy One Get One (BOGO)
        </div>
        <input
          className="button"
          type="submit"
          value={isCreateMode ? "Add Product" : "Update Product"}
        />
      </div>
    </form>
  );
};

export default ProductForm;
