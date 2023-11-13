import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Alert from "../../components/common/Alert";
import { Actions, useAPIRequest } from "../../components/common/api-request";
import { DangerButton, PrimaryButton } from "../../components/common/Buttons";
import Card from "../../components/common/Card";
import { LoadingContext } from "../../components/common/Contexts";
import Modal, { ConfirmModal } from "../../components/common/Modal";
import Table from "../../components/common/Table";
import {  parseError } from "../../components/common/utils";
import {OwnerAdd, OwnerEdit} from "../../components/owner/modal/OwnerEdit";
import { deleteOwner, getOwners } from "../../components/owner/OwnerRepo";


function OwnerList() {
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const loadingContext = useContext(LoadingContext);

  const [list, setList] = useState([]);
  const [owner, setOwner] = useState();
  const [deleteId, setDeleteId] = useState();

  const [listState, requestOwners] = useAPIRequest(getOwners);
  const [delState, requestDelete] = useAPIRequest(deleteOwner);

  useEffect(() => {
    requestOwners();

    return () => {
      loadingContext.setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadingContext.setLoading(listState.status === Actions.loading);
    if (listState.status === Actions.success) {
      setList(listState.payload ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listState]);

  useEffect(() => {
    loadingContext.setLoading(delState.status === Actions.loading);
    if (delState.status === Actions.success) {
      toast.success("Owner deleted successfully.");
      requestOwners();
    }
    if (delState.status === Actions.failure) {
      toast.error(parseError(delState.error));
    }
  }, [delState]);

  function getActionButtons(a) {
    return (
      <div className="flex space-x-2">
        <PrimaryButton
          onClick={() => {
            setOwner(a);
            setShowEdit(true);
          }}
        >
          <PencilAltIcon className="w-4 h-4" />
        </PrimaryButton>
        <DangerButton
          onClick={() => {
            setDeleteId(a.id);
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
      <Modal title="Add Owner" isOpen={showAdd}>
        <OwnerAdd
          owner={owner}
          handleClose={(result) => {
            setShowAdd(false);
            setOwner(undefined);
            if (result === true) {
              toast.success("Owner save successfully.");
              requestOwners();
            }
          }}
        />
      </Modal>

      <Modal title="Edit Owner" isOpen={showEdit}>
        <OwnerEdit
          owner={owner}
          handleClose={(result) => {
            setShowEdit(false);
            setOwner(undefined);
            if (result === true) {
              toast.success("Owner save successfully.");
              requestOwners();
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
            <h3 className="text-gray-600">Owners</h3>
            <PrimaryButton
              className="ml-auto"
              onClick={() => setShowAdd(true)}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New
            </PrimaryButton>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="overflow-x-auto">
            <Table>
              <Table.THead>
                <tr>
                  <Table.TH className="w-44">Name</Table.TH>
                  <Table.TH className="w-40">Gender</Table.TH>
                  <Table.TH className="w-40">Email</Table.TH>
                  <Table.TH className="w-40">Phone</Table.TH>
                  <Table.TH className="w-40">Address</Table.TH>
                  <Table.TH className="w-40">Status</Table.TH>
                  <Table.TH className="w-40"></Table.TH>
                </tr>
              </Table.THead>

              <Table.TBody>
                {list.map((c) => {
                  return (
                    <tr key={c.id}>
                      <Table.TD>{c.name}</Table.TD>
                      <Table.TD>{c.gender}</Table.TD>
                      <Table.TD>{c.email}</Table.TD>
                      <Table.TD>{c.phone}</Table.TD>
                      <Table.TD>{c.address}</Table.TD>
                      <Table.TD>{c.status}</Table.TD>
                      <Table.TD>{getActionButtons(c)}</Table.TD>
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

export default OwnerList;
