import { useFormik } from "formik";
import { useEffect } from "react";
import Alert from "../../common/Alert";
import { Actions, useAPIRequest } from "../../common/api-request";
import { DefaultButton, PrimaryButton } from "../../common/Buttons";
import { Input } from "../../common/FormControls";
import { parseError } from "../../common/utils";
import { addCategory, saveCategory } from "../CategoryRepo";

export function CategoryEdit({ category = { name: "" }, handleClose }) {
  const [state, requestSave] = useAPIRequest(saveCategory);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...category },
    validate: (values) => {
      let errors = {};
      if (!values.categoryName || values.categoryName.trim().length === 0) {
        errors.categoryName = "Please enter category name.";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          label="Name"
          name="categoryName"
          placeholder="Enter category name"
          value={formik.values.categoryName}
          onChange={formik.handleChange}
          error={formik.errors.categoryName}
        />
      </div>
      <div className="flex flex-row-reverse space-x-reverse space-x-2">
        <PrimaryButton type="submit" disabled={formik.isSubmitting} loading={formik.isSubmitting}>
          Save
        </PrimaryButton>
        <DefaultButton disabled={formik.isSubmitting} onClick={handleClose}>
          Cancel
        </DefaultButton>
      </div>
    </form>
  );
}

export function CategoryAdd({ category = { name: "" }, handleClose }) {
  const [state, requestAdd] = useAPIRequest(addCategory);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...category },
    validate: (values) => {
      let errors = {};
      if (!values.name || values.name.trim().length === 0) {
        errors.name = "Please enter category name.";
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

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col mt-4">
      {state.status === Actions.failure && (
        <Alert alertClass="alert-error mb-4" closeable>
          {parseError(state.error)}
        </Alert>
      )}

      <div className="mb-6">
        <Input
          label="Name"
          name="name"
          placeholder="Enter category name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.errors.name}
        />
      </div>
      <div className="flex flex-row-reverse space-x-reverse space-x-2">
        <PrimaryButton type="submit" disabled={formik.isSubmitting} loading={formik.isSubmitting}>
          Save
        </PrimaryButton>
        <DefaultButton disabled={formik.isSubmitting} onClick={handleClose}>
          Cancel
        </DefaultButton>
      </div>
    </form>
  );
}


