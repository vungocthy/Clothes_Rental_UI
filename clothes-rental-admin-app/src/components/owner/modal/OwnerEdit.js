import { useFormik } from "formik";
import { useEffect } from "react";
import Alert from "../../common/Alert";
import { Actions, useAPIRequest } from "../../common/api-request";
import { DefaultButton, PrimaryButton } from "../../common/Buttons";
import { Input } from "../../common/FormControls";
import { parseError } from "../../common/utils";
import { addOwner,saveOwner } from "../OwnerRepo";

export function OwnerEdit({owner = { name: "" }, handleClose }) {
  //console.log(owner);
  const [state, requestSave] = useAPIRequest(saveOwner);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...owner },
    validate: (values) => {
      let errors = {};
      if (!values.name || values.name.trim().length === 0) {
        errors.name = "Please enter author name.";
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
          name="name"
          placeholder="Enter name . . ."
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.errors.name}
        />

        <Input
          label="Gender"
          name="gender"
          placeholder="Enter gender  . . ."
          value={formik.values.gender}
          onChange={formik.handleChange}
          error={formik.errors.gender}
        />

        <Input
          label="Email"
          name="email"
          placeholder="Enter email . . ."
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.errors.email}
        />

        <Input
          label="Phone"
          name="phone"
          placeholder="Enter phone number . . ."
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={formik.errors.phone}
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


export function OwnerAdd({owner = { name: "" }, handleClose }) {
  //console.log(owner);
  const [state, requestAdd] = useAPIRequest(addOwner);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...owner },
    validate: (values) => {
      let errors = {};
      if (!values.name || values.name.trim().length === 0) {
        errors.name = "Please enter author name.";
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
          placeholder="Enter name . . ."
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.errors.name}
        />

        <Input
          label="Gender"
          name="gender"
          placeholder="Enter gender  . . ."
          value={formik.values.gender}
          onChange={formik.handleChange}
          error={formik.errors.gender}
        />

        <Input
          label="Email"
          name="email"
          placeholder="Enter email . . ."
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.errors.email}
        />

        <Input
          label="Phone"
          name="phone"
          placeholder="Enter phone number . . ."
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={formik.errors.phone}
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