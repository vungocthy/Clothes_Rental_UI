import { useFormik } from "formik";
import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import Alert from "../../common/Alert";
import { Actions, useAPIRequest } from "../../common/api-request";
import { DefaultButton, PrimaryButton } from "../../common/Buttons";
import { Input } from "../../common/FormControls";
import {formatPrice, parseError } from "../../common/utils";
import { saveProductCombo,addProductCombo } from "../ComboRepo";

import { PlusIcon } from "@heroicons/react/solid";
import { DangerButton } from "../../common/Buttons";
import Card from "../../common/Card";
import Table from "../../common/Table";
import Pagination from "../../common/Pagination";



export function ProductComboEdit({productCombo = { name: "" }, handleClose }) {
  const [state, requestSave] = useAPIRequest(saveProductCombo);
  const [listImages, setListImages] = useState([]);

  useEffect(() => {
    setListImages(prevList => [...prevList, productCombo.fileUrl]);
  }, [productCombo.fileUrl]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...productCombo },
    validate: (values) => {
      let errors = {};

      if (!values.quantity || values.quantity.trim().length === 0) {
        errors.quantity = "Please enter quantity.";
      }
      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      requestSave(values);
    },
  });

  useEffect(() => {
    if (state.status !== Actions.loading) {
      formik.setSubmitting(false);
    }

    if (state.status === Actions.success) {
      handleClose(true);
    }
  }, [state]);

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col mt-4">
      {state.status === Actions.failure && (
        <Alert alertClass="alert-error mb-4" closeable>
          {parseError(state.error)}
        </Alert>
      )}

      <div className="mb-6">
        <Input
          label="Combo:"
          name="Name"
          readOnly
          placeholder="Enter name . . ."
          value={formik.values.comboName}
          onChange={formik.handleChange}
          error={formik.errors.comboName}
        />

        <Input
          label="Product:"
          name="ProductName"
          placeholder="Enter description  . . ."
          readOnly 
          value={formik.values.productName}
          onChange={formik.handleChange}
          error={formik.errors.productName}
        />

        <Input
          label="Quantity:"
          name="quantity"
          placeholder="Enter quantity . . ."
          value={formik.values.quantity}
          onChange={formik.handleChange}
          error={formik.errors.quantity}
        />
      </div>


      <div className="flex flex-row-reverse space-x-reverse space-x-2">
        <PrimaryButton
          type="submit"
          disabled={formik.isSubmitting}
          loading={formik.isSubmitting}
        >
          Save
        </PrimaryButton>
        <DefaultButton disabled={formik.isSubmitting} onClick={handleClose}>
          Cancel
        </DefaultButton>
      </div>
    </form>
  );
}


export function ProductComboAdd({comboId, handleClose }) {
  let params = useParams();
  const [productListState, requestProducts] = useAPIRequest();
  const [productList, setProductList] = useState([]);
  const [query, setQuery] = useState({
    comboId:params.id,
    pageIndex: 0,
  });
  const [paging, setPaging] = useState({ hasPrev: false, hasNext: false });

  return(
    <div className="flex flex-col space-y-4">

    {productListState.status === Actions.failure && (
      <Alert alertClass="alert-error mb-4" closeable>
        {parseError(productListState.error)}
      </Alert>
    )}
 
    <Card>
      <Card.Header>
        <div className="flex items-center">
          <h3 className="text-gray-600">Add Product to Combo</h3>
        </div>
      </Card.Header>
      <Card.Body className="flex flex-col space-y-2">
        {/* Option here */}
        <div className="overflow-x-auto">
          <Table>
            <Table.THead>
              <tr>
                <Table.TH className="w-40">Image</Table.TH>
                <Table.TH className="w-40 md:w-full">Name</Table.TH>
                <Table.TH className="w-40">Price</Table.TH>
                <Table.TH className="w-40">Quantity</Table.TH>
                <Table.TH className="w-24">Material</Table.TH>
                <Table.TH className="w-60">Category</Table.TH>
                <Table.TH className="w-44"></Table.TH>
              </tr>
            </Table.THead>
            <Table.TBody>
              {productList.map((p) => {
                return (
                  <tr key={p.id}>
                    <Table.TD>
                      <div className="">
                        <img
                          src={p.productImages[0].fileUrl}
                          alt="product"
                          className="w-full aspect-auto rounded drop-shadow-md"
                        />
                      </div>
                    </Table.TD>
                    <Table.TD>{p.productName}</Table.TD>
                    <Table.TD>{formatPrice(p.price)}</Table.TD>
                    <Table.TD>{p.quantity}</Table.TD>
                    <Table.TD>{p.material}</Table.TD>
                    <Table.TD>{p.categoryName}</Table.TD>
                    <Table.TD><PlusIcon className="w-5 h-5 mr-2" /></Table.TD>
                  </tr>
                );
              })}
            </Table.TBody>
          </Table>
        </div>
 
        <div className="flex flex-row-reverse pt-2">
          <Pagination
            list={productList}
            query={query}
            hasPrev={paging.hasPrev}
            hasNext={paging.hasNext}
            onPrev={() => {
              const q = { ...query };
              q.pageIndex = q.pageIndex-1;
              setQuery(q);
            }}
            onNext={() => {
              const q = { ...query };
              q.pageIndex = q.pageIndex+1;
              setQuery(q);
            }}
          />
 
        </div>
      </Card.Body>
    </Card>
    <div className="flex flex-row-reverse space-x-reverse space-x-2">
        <DefaultButton onClick={handleClose}>
            Cancel
        </DefaultButton>
    </div>  
  </div>
  );
}