import { useFormik } from "formik";
import { useState,useEffect } from "react";
import Alert from "../../common/Alert";
import { Actions, useAPIRequest } from "../../common/api-request";
import { DefaultButton, PrimaryButton } from "../../common/Buttons";
import { Input } from "../../common/FormControls";
import { parseError } from "../../common/utils";
import { addShop,  saveShop } from "../ShopRepo";
import ShopImages from "../ShopImages";
import { getOwners } from "../../owner/OwnerRepo";
import { default as ReactSelect } from "react-select";

export function ShopEdit({shop = { name: "" }, handleClose }) {
  const [state, requestSave] = useAPIRequest(saveShop);
  const [listImages, setListImages] = useState([]);

  useEffect(() => {
    setListImages(prevList => [...prevList, shop.fileUrl]);
  }, [shop.fileUrl]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...shop },
    validate: (values) => {
      let errors = {};
      if (!values.shopName || values.shopName.trim().length === 0) {
        errors.name = "Please enter ShopName.";
      }

      if (!values.shopEmail || values.shopEmail.trim().length === 0) {
        errors.name = "Please enter shop Email.";
      }
      if (!values.shopPhone || values.shopPhone.trim().length === 0) {
        errors.name = "Please enter shop Phone.";
      }
      if (!values.address || values.address.trim().length === 0) {
        errors.name = "Please enter address.";
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
          label="Shop Name:"
          name="shopName"
          placeholder="Enter name . . ."
          value={formik.values.shopName}
          onChange={formik.handleChange}
          error={formik.errors.name}
        />

        <Input
          label="Shop Email:"
          name="shopEmail"
          placeholder="Enter email  . . ."
          value={formik.values.shopEmail}
          onChange={formik.handleChange}
          error={formik.errors.email}
        />

        <Input
          label="Shop Phone:"
          name="shopPhone"
          placeholder="Enter phone number . . ."
          value={formik.values.shopPhone}
          onChange={formik.handleChange}
          error={formik.errors.email}
        />

        <Input
          label="Address"
          name="address"
          placeholder="Enter address  . . ."
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.errors.address}
        />
      </div>

      <hr className="lg:col-span-2 my-2" />

      <div className="lg:col-span-2">
        <label className="form-control-label mb-2">
          Shop Images *
        </label>
        <ShopImages
          //images={formik.values.images}
          images={listImages}
          onImagesChange={(blobs, urls) => {
            formik.setFieldValue("files", blobs);
            formik.setFieldValue("urls", urls);
          }}
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


export function ShopAdd({ shop = { name: "" }, handleClose }) {
  //console.log(owner);
  const [state, requestAdd] = useAPIRequest(addShop);
  const [owberState,requestOwner]=useAPIRequest(getOwners);

  useEffect(()=>{
    requestOwner();
  },[]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...shop },
    validate: (values) => {
      let errors = {};
      if (!values.shopName || values.shopName.trim().length === 0) {
        errors.name = "Please enter shop Name.";
      }
      if (!values.shopEmail || values.shopEmail.trim().length === 0) {
        errors.name = "Please enter shop Email.";
      }
      if (!values.shopPhone || values.shopPhone.trim().length === 0) {
        errors.name = "Please enter shop Phone.";
      }
      if (!values.address || values.address.trim().length === 0) {
        errors.name = "Please enter address.";
      }
      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      requestAdd(values);
    },
  });

  useEffect(() => {
    if (state.status !== Actions.loading) {
      formik.setSubmitting(false);
    }

    if (state.status === Actions.success) {
      handleClose(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function handleQueryChange(id){
    formik.setFieldValue('ownerId', id);
  }

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col mt-4">
      {state.status === Actions.failure && (
        <Alert alertClass="alert-error mb-4" closeable>
          {parseError(state.error)}
        </Alert>
      )}

      <div className="mb-6">
      <Input
          label="Shop Name:"
          name="shopName"
          placeholder="Enter name . . ."
          value={formik.values.shopName}
          onChange={formik.handleChange}
          error={formik.errors.name}
        />

        <Input
          label="Shop Email:"
          name="shopEmail"
          placeholder="Enter email  . . ."
          value={formik.values.shopEmail}
          onChange={formik.handleChange}
          error={formik.errors.email}
        />

        <Input
          label="Shop Phone:"
          name="shopPhone"
          placeholder="Enter phone number . . ."
          value={formik.values.shopPhone}
          onChange={formik.handleChange}
          error={formik.errors.email}
        />
        <Input
          label="Address"
          name="address"
          placeholder="Enter address  . . ."
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.errors.address}
        />
      </div>
      <div className="mr-3 mb-2">
        <ReactSelect
          name="OwnerId"
          styles={{
            control: (css, state) => ({
              ...css,
              width: "103%",
              padding: 2,
              boxShadow: "none",
            }),
          }}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: "#e0e7ff",
              primary: "#6366f1",
            },
          })}

          defaultValue={formik.values.ownerId}
          onChange={(newValue, action) => {
            handleQueryChange({ id: newValue?.id });
          }}
          isDisabled={false}
          isLoading={false}
          isClearable={true}
          isRtl={false}
          isSearchable={true}
          placeholder="By owner"
          options={owberState.payload}
          getOptionValue={(op) => op.id}
          getOptionLabel={(op) => op.name}
        >
        </ReactSelect>
      </div>

      <hr className="lg:col-span-2 my-2" />

      <div className="lg:col-span-2">
        <label className="form-control-label mb-2">
          Shop Images *
        </label>
        <ShopImages
          images={formik.values.images}
          onImagesChange={(blobs, urls) => {
            formik.setFieldValue("files", blobs);
            formik.setFieldValue("urls", urls);
          }}
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