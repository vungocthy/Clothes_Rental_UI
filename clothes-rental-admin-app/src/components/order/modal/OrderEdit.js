import { useFormik } from "formik";
import { useEffect } from "react";
import Alert from "../../common/Alert";
import { Actions, useAPIRequest } from "../../common/api-request";
import { DefaultButton, PrimaryButton } from "../../common/Buttons";
import { Input,Select } from "../../common/FormControls";
import { parseError } from "../../common/utils";
import { updateOrderStatus } from "../OrderRepo";

export function OrderEdit({ order = { name: "" }, handleClose }) {
    const [state, requestSave] = useAPIRequest(updateOrderStatus);
    const formik = useFormik({
      enableReinitialize: true,
      initialValues: { ...order },
      validate: (values) => {
        let errors = {};
        if (!values.status || values.status.trim().length === 0) {
          errors.status = "Please enter category name.";
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
            {/* <Input
                label="Note"
                name="note"
                placeholder="Enter note"
                value={formik.values.note}
                onChange={formik.handleChange}
                error={formik.errors.note}
            /> */}

            {/* <Input
                label="Status"
                name="status"
                placeholder="Enter status . . ."
                value={formik.values.status}
                onChange={formik.handleChange}
                error={formik.errors.status}
            /> */}

            <Select
                label="Status *"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                error={formik.errors.status}
                >
                <option>--Select--</option> 
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="DELIVERING">Delivering</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
            </Select>
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