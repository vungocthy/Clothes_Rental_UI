import { Editor } from "@tinymce/tinymce-react";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Alert from "../../common/Alert";
import { Actions, useAPIRequest } from "../../common/api-request";
import { PrimaryButton,DefaultButton } from "../../common/Buttons";
import Card from "../../common/Card";
import { LoadingContext } from "../../common/Contexts";
import { Input, Select } from "../../common/FormControls";
import { parseError } from "../../common/utils";
import { ProductImagesAdd,ProductImagesEdit } from "../ProductImages";
import { addProduct, getProductEdit, saveProduct } from "../ProductRepo";

export function ProductAdd({shopId,handleClose}){
  const loadingContext = useContext(LoadingContext);
  const [dataState, requestData] = useAPIRequest(getProductEdit);
  const [state, requestAdd] = useAPIRequest(addProduct);
  const [categoryList, setCategoryList] = useState([]);
  const [listImages, setListImages] = useState([]);
  const [initialValues, setInitialValues] = useState();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValues },
    validate: (values) => {
      let errors = {};
      if (!values.productName || values.productName.trim().length === 0) {
        errors.productName = "Please enter product name.";
      }

      if (!values.price || values.price.length === 0) {
        errors.price = "Please enter price.";
      }

      if (!values.material || values.material.length === 0) {
        errors.material = "Please enter material.";
      }

      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      let product = { ...values };
      requestAdd({
        shopId:shopId,
        product:product
      });

    },
  });


  useEffect(() => {
    requestData();
    return () => {
      loadingContext.setLoading(false);
    };
  }, []);

  useEffect(() => {
    loadingContext.setLoading(dataState.status === Actions.loading);

    if (dataState.status === Actions.success) {
      const payload = dataState.payload;
      setCategoryList(payload.categories ?? []);

      let product = payload.product ?? {};
      setListImages(prevList => [...prevList, product.productImages]);
      setInitialValues(product );
    }

    if (dataState.status === Actions.failure) {
      toast.error(parseError(dataState.error));
    }
  }, [dataState]);

  useEffect(() => {
    if (state.status !== Actions.loading) {
      formik.setSubmitting(false);
    }

    if (state.status === Actions.success) {
      toast.success("Product saved successfully.");
      handleClose();
    }
  }, [state]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
      <div className="lg:col-span-3">
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <Card.Header>
              <div className="flex items-center">
                <h3>Add Product</h3>
                <PrimaryButton
                  type="submit"
                  className={"ml-auto"}
                  disabled={
                    formik.isSubmitting
                  }
                  loading={formik.isSubmitting}
                >
                  Save
                </PrimaryButton>
              </div>
            </Card.Header>
            <Card.Body>
              {state.status === Actions.failure && (
                <Alert alertClass="alert-error mb-4" closeable>
                  {parseError(state.error)}
                </Alert>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-2">
                  <Input
                    label="Name *"
                    name="productName"
                    placeholder="Enter product name"
                    value={formik.values.productName}
                    onChange={formik.handleChange}
                    error={formik.errors.productName}
                  />
                </div>

                <div className="lg:col-span-2">
                  <Select
                    label="Category *"
                    name="categoryId"
                    value={formik.values.categoryId}
                    onChange={formik.handleChange}
                    error={formik.errors.categoryId}
                  >
                    <option>--Select--</option> 
                    {categoryList.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.categoryName}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="lg:col-span-2">
                  <Input
                    label="Material"
                    name="material"
                    placeholder="Enter material"
                    value={formik.values.material}
                    onChange={formik.handleChange}
                    error={formik.errors.material}
                  />
                </div>

                <div className="lg:col-span-1">
                  <Input
                    label="Color"
                    name="color"
                    placeholder="Enter color "
                    value={formik.values.color}
                    onChange={formik.handleChange}
                    error={formik.errors.color}
                  />
                </div>
                <div className="lg:col-span-1">
                  <Input
                    label="Size"
                    name="size"
                    placeholder="Enter size"
                    value={formik.values.size}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        formik.handleChange(e);
                      }
                    }}
                  />
                </div>

                <div className="lg:col-span-1">
                  <Input
                    label="Price"
                    name="price"
                    placeholder="Enter price amount"
                    value={formik.values.price}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        formik.handleChange(e);
                      }
                    }}
                    error={formik.errors.price}
                  />
                </div>
                <div className="lg:col-span-1">
                  <Input
                    label="Compesation"
                    name="compesation"
                    placeholder="Enter compesation amount"
                    value={formik.values.compesation}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        formik.handleChange(e);
                      }
                    }}
                    error={formik.errors.compesation}
                  />
                </div>
               
                <div className="lg:col-span-2">
                  <Editor
                    tinymceScriptSrc={`${
                      window.location.protocol + "//" + window.location.host
                    }/tinymce/tinymce.min.js`}
                    value={formik.values.description}
                    onEditorChange={(newValue) =>
                      formik.setFieldValue("description", newValue)
                    }
                    init={{
                      height: 200,
                      menubar: false,
                      placeholder: "Enter description",
                      plugins: [
                        "preview",
                        "fullscreen",
                        "wordcount",
                        "link",
                        "lists",
                      ],
                      toolbar:
                        "undo redo | formatselect | " +
                        "bold italic underline blockquote | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | fullscreen",
                    }}
                  />
                </div>
                <hr className="lg:col-span-2 my-2" />

                <div className="lg:col-span-2">
                  <label className="form-control-label mb-2">
                    Images 
                  </label>
                  <ProductImagesAdd
                    images={listImages}
                    onImagesChange={(blobs, urls) => {
                      formik.setFieldValue("files", blobs);
                      formik.setFieldValue("urls", urls);
                    }}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </form>
        <br/>
          <div className="flex flex-row-reverse space-x-reverse space-x-2">
            <DefaultButton onClick={handleClose}>
                Cancel
            </DefaultButton>
          </div> 
      </div>
    </div>
  );
}

export function ProductEdit({product,handleClose}){
  const loadingContext = useContext(LoadingContext);
  const [dataState, requestData] = useAPIRequest(getProductEdit);
  const [state, requestSave] = useAPIRequest(saveProduct);
  const [categoryList, setCategoryList] = useState([]);
  const [listImages, setListImages] = useState([]);
  const [initialValues, setInitialValues] = useState();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValues },
    validate: (values) => {
      let errors = {};
      if (!values.productName || values.productName.trim().length === 0) {
        errors.productName = "Please enter product name.";
      }

      if (!values.price || values.price.length === 0) {
        errors.price = "Please enter price.";
      }

      if (!values.material || values.material.length === 0) {
        errors.material = "Please enter material.";
      }

      if (!values.category) {
        errors.category = "Please select category.";
      }


      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      let product = { ...values };
      requestSave(product);

    },
  });

  useEffect(() => {
    requestData(product.id);

    return () => {
      loadingContext.setLoading(false);
    };
  }, []);

  useEffect(() => {
    loadingContext.setLoading(dataState.status === Actions.loading);

    if (dataState.status === Actions.success) {
      const payload = dataState.payload;
      setCategoryList(payload.categories ?? []);

      let product = payload.product ?? {};
      setListImages(prevList => [...prevList, product.productImages]);
      setInitialValues(product);
    }

    if (dataState.status === Actions.failure) {
      toast.error(parseError(dataState.error));
    }
  }, [dataState]);

  useEffect(() => {
    if (state.status !== Actions.loading) {
      formik.setSubmitting(false);
    }

    if (state.status === Actions.success) {
      toast.success("Product saved successfully.");
      handleClose();
    }
  }, [state]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
      <div className="lg:col-span-3">
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <Card.Header>
              <div className="flex items-center">
                <h3>Update Product</h3>
                <PrimaryButton
                  type="submit"
                  className={"ml-auto"}
                  disabled={
                    formik.isSubmitting || dataState.status === Actions.loading
                  }
                  loading={formik.isSubmitting}
                >
                  Save
                </PrimaryButton>
              </div>
            </Card.Header>
            <Card.Body>
              {state.status === Actions.failure && (
                <Alert alertClass="alert-error mb-4" closeable>
                  {parseError(state.error)}
                </Alert>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-2">
                  <Input
                    label="Name *"
                    name="productName"
                    placeholder="Enter book name"
                    value={formik.values.productName}
                    onChange={formik.handleChange}
                    error={formik.errors.productName}
                  />
                </div>

                <div className="lg:col-span-2">
                  <Select
                    label="Category *"
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    error={formik.errors.category}
                  >
                    <option>--Select--</option>
                    {categoryList.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.categoryName}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="lg:col-span-2">
                  <Input
                    label="Material"
                    name="material"
                    placeholder="Enter material"
                    value={formik.values.material}
                    onChange={formik.handleChange}
                    error={formik.errors.material}
                  />
                </div>

                <div className="lg:col-span-1">
                  <Input
                    label="Color"
                    name="color"
                    placeholder="Enter color "
                    value={formik.values.color}
                    onChange={formik.handleChange}
                    error={formik.errors.color}
                  />
                </div>
                <div className="lg:col-span-1">
                  <Input
                    label="Size"
                    name="size"
                    placeholder="Enter size"
                    value={formik.values.size}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        formik.handleChange(e);
                      }
                    }}
                  />
                </div>

                <div className="lg:col-span-1">
                  <Input
                    label="Price"
                    name="price"
                    placeholder="Enter compesation amount"
                    value={formik.values.price}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        formik.handleChange(e);
                      }
                    }}
                    error={formik.errors.price}
                  />
                </div>
                <div className="lg:col-span-1">
                  <Input
                    label="Compesation"
                    name="compesation"
                    placeholder="Enter compesation amount"
                    value={formik.values.compesation}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        formik.handleChange(e);
                      }
                    }}
                    error={formik.errors.price}
                  />
                </div>
               
                <div className="lg:col-span-2">
                  <Editor
                    tinymceScriptSrc={`${
                      window.location.protocol + "//" + window.location.host
                    }/tinymce/tinymce.min.js`}
                    value={formik.values.description}
                    onEditorChange={(newValue) =>
                      formik.setFieldValue("description", newValue)
                    }
                    init={{
                      height: 200,
                      menubar: false,
                      placeholder: "Enter description",
                      plugins: [
                        "preview",
                        "fullscreen",
                        "wordcount",
                        "link",
                        "lists",
                      ],
                      toolbar:
                        "undo redo | formatselect | " +
                        "bold italic underline blockquote | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | fullscreen",
                    }}
                  />
                </div>
                <hr className="lg:col-span-2 my-2" />

                <div className="lg:col-span-2">
                  <label className="form-control-label mb-2">
                    Images 
                  </label>
                  <ProductImagesEdit
                    id={formik.values.id}
                    images={formik.values.productImages}
                    onImagesChange={(blobs, urls) => {
                      formik.setFieldValue("files", blobs);
                      formik.setFieldValue("urls", urls);
                    }}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </form>
        <br/>
          <div className="flex flex-row-reverse space-x-reverse space-x-2">
            <DefaultButton onClick={handleClose}>
                Cancel
            </DefaultButton>
          </div> 
      </div>
    </div>
  );
}
  