import { useFormik } from "formik";
import { useState,useEffect } from "react";
import Alert from "../../common/Alert";
import { Actions, useAPIRequest } from "../../common/api-request";
import { DefaultButton, PrimaryButton } from "../../common/Buttons";
import { Input } from "../../common/FormControls";
import { parseError } from "../../common/utils";
import { addCombo,saveCombo } from "../ComboRepo";
import ComboImages from "../ComboImages";



export function ComboEdit({combo = { name: "" }, handleClose }) {
  const [state, requestSave] = useAPIRequest(saveCombo);
  const [listImages, setListImages] = useState([]);

  useEffect(() => {
    setListImages(prevList => [...prevList, combo.fileUrl]);
  }, [combo.fileUrl]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...combo },
    validate: (values) => {
      let errors = {};
      if (!values.comboName || values.comboName.trim().length === 0) {
        errors.comboName = "Please enter combo name.";
      }

      if (!values.description || values.description.trim().length === 0) {
        errors.description = "Please enter description.";
      }
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
          label="Combo Name:"
          name="comboName"
          placeholder="Enter name . . ."
          value={formik.values.comboName}
          onChange={formik.handleChange}
          error={formik.errors.comboName}
        />

        <Input
          label="Description:"
          name="description"
          placeholder="Enter description  . . ."
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.errors.description}
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

      <hr className="lg:col-span-2 my-2" />

      <div className="lg:col-span-2">
        <label className="form-control-label mb-2">
          Shop Images *
        </label>
        <ComboImages
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


export function ComboAdd({ shopId,combo = { name: "" }, handleClose }) {
  const [state, requestAdd] = useAPIRequest(addCombo);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...combo },
    validate: (values) => {
      let errors = {};
      if (!values.comboName || values.comboName.trim().length === 0) {
        errors.comboName = "Please enter combo name.";
      }

      if (!values.description || values.description.trim().length === 0) {
        errors.description = "Please enter description.";
      }
      if (!values.quantity || values.quantity.trim().length === 0) {
        errors.quantity = "Please enter quantity.";
      }
      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      requestAdd({
        shopId:shopId,
        combo:values
      });
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
          label="Combo Name:"
          name="comboName"
          placeholder="Enter name . . ."
          value={formik.values.comboName}
          onChange={formik.handleChange}
          error={formik.errors.comboName}
        />

        <Input
          label="Description:"
          name="description"
          placeholder="Enter description  . . ."
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.errors.description}
        />

        <Input
          label="Quantity:"
          name="quantity"
          placeholder="Enter quantity . . ."
          value={formik.values.quantity}
          onChange={(e) => {
            if (!isNaN(e.target.value)) {
              formik.handleChange(e);
            }
          }}
        />

      </div>

      <hr className="lg:col-span-2 my-2" />

      <div className="lg:col-span-2">
        <label className="form-control-label mb-2">
          Combo Images *
        </label>
        <ComboImages
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