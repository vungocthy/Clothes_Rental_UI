import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import React,{ useContext, useEffect, useState } from "react";
import Alert from "../../components/common/Alert";
import { DangerButton, PrimaryButton } from "../../components/common/Buttons";
import Card from "../../components/common/Card";
import { LoadingContext } from "../../components/common/Contexts";
import Modal, { ConfirmModal } from "../../components/common/Modal";
import Table from "../../components/common/Table";
import { Actions, useAPIRequest } from "../../components/common/api-request";
import {CategoryEdit, CategoryAdd } from "../../components/category/modal/CategoryEdit";
import { deleteCategory, getCategories } from "../../components/category/CategoryRepo";
import { parseError, formatTimestamp } from "../../components/common/utils";
import { toast } from "react-toastify";

import { Role } from "../../constants";

function CategoryList() {
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadingContext = useContext(LoadingContext);

  const [list, setList] = useState([]);
  const [category, setCategory] = useState();
  const [deleteId, setDeleteId] = useState();

  const [listState, requestCategories] = useAPIRequest(getCategories);
  const [delState, requestDelete] = useAPIRequest(deleteCategory);

//#region  Get All Category
  useEffect(() => {
    requestCategories();

    return () => {
      loadingContext.setLoading(false);
    };
  }, []);

  useEffect(() => {
    loadingContext.setLoading(listState.status === Actions.loading);
    if (listState.status === Actions.success) {
      setList(listState.payload ?? []);
    }
  }, [listState]);

//#endregion

//#region Delete Category

useEffect(() => {
    loadingContext.setLoading(delState.status === Actions.loading);
    if (delState.status === Actions.success) {
      toast.success("Category deleted successfully.");
      requestCategories();
    }
    if (delState.status === Actions.failure) {
      toast.error(parseError(delState.error));
    }
  }, [delState]);

//#endregion

  function getActionButtons(c) {
    return (
      <div className="flex space-x-2">
        <PrimaryButton
          onClick={() => {
            setCategory(c);
            setShowEdit(true);
          }}
        >
          <PencilAltIcon className="w-4 h-4" />
        </PrimaryButton>
        <DangerButton
          onClick={() => {
            setDeleteId(c.id);
            setShowConfirm(true);
          }}
        >
          <TrashIcon className="w-4 h-4" />
        </DangerButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">

      <Modal title="Add Category" isOpen={showAdd}>
        <CategoryAdd
          handleClose={(result) => {
            setShowAdd(false);
            setCategory(undefined);
            if (result === true) {
              toast.success("Category save successfully.");
              requestCategories();
            }
          }}
        />
      </Modal>

      <Modal title="Edit Category" isOpen={showEdit}>
        <CategoryEdit
          category={category}
          handleClose={(result) => {
            setShowEdit(false);
            setCategory(undefined);
            if (result === true) {
              toast.success("Category save successfully.");
              requestCategories();
            }
          }}
        />
      </Modal>

      <ConfirmModal
        message="Are you sure to delete?"
        isOpen={showConfirm}
        handleClose={(result) => {
          setShowConfirm(false);
          if (result) {
            requestDelete(deleteId);
          }
          setDeleteId(undefined);
        }}
      />

      {listState.status === Actions.failure && (
        <Alert alertClass="alert-error mb-4" closeable>
          {parseError(listState.error)}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <div className="flex items-center">
            <h3 className="text-gray-600">Categories</h3>
            {
              Role==='Admin'? <PrimaryButton
              className="ml-auto"
              onClick={() => setShowAdd(true)}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New
            </PrimaryButton>
            :null
            }
            
          </div>
        </Card.Header>
        <Card.Body>
          <div className="overflow-x-auto">
            <Table>
              <Table.THead>
                <tr>
                  <Table.TH className="w-40 md:w-full">Name</Table.TH>
                  <Table.TH className="w-60">Created At</Table.TH>
                  {
                    Role==='Admin'?<Table.TH className="w-44"></Table.TH>:null
                  }
                  
                </tr>
              </Table.THead>

              <Table.TBody>
                {list.map((c) => {
                  return (
                    <tr key={c.id}>
                      <Table.TD>{c.categoryName}</Table.TD>
                      <Table.TD>{formatTimestamp(c.creationDate)}</Table.TD>
                      {
                        Role==='Admin'?<Table.TD>{getActionButtons(c)}</Table.TD>:null
                      }                 
                    </tr>
                  );
                })}
              </Table.TBody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CategoryList;
