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
import {ShopAdd, ShopEdit} from "../../components/shop/modal/ShopEdit";
import { deleteShop, getShops,getShopsByOwnerId } from "../../components/shop/ShopRepo";
import { Select } from "../../components/common/FormControls";
import { useNavigate } from "react-router-dom";
import { Role } from "../../constants";
function ShopList() {
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const navigate = useNavigate();
  const loadingContext = useContext(LoadingContext);

  const [list, setList] = useState([]);
  const [shop, setShop] = useState();
  const [deleteId, setDeleteId] = useState();

  const [listState, requestShops] = useAPIRequest(Role==="Admin"?getShops:getShopsByOwnerId);
  const [delState, requestDelete] = useAPIRequest(deleteShop);

  useEffect(() => {
    requestShops();
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

  useEffect(() => {
    loadingContext.setLoading(delState.status === Actions.loading);
    if (delState.status === Actions.success) {
      toast.success("Author deleted successfully.");
      requestShops();
    }
    if (delState.status === Actions.failure) {
      toast.error(parseError(delState.error));
    }
  }, [delState]);

  function handleSelects(a){
    console.log(a.shop.id);
    switch(a.status){
      case "COMBO":
        navigate(`/shops/${a.shop.id}/combos`, { replace: true });
        break;
      case "PRODUCT":
          navigate(`/shops/${a.shop.id}/products`, { replace: true });
        break;
      case "UPDATE":
          setShop(a.shop);
          setShowEdit(true);
        break;
      case "DELETE":
          setDeleteId(a.shop.id);
          setShowConfirm(true);
        break
      case "ORDER":
        navigate(`/shops/${a.shop.id}/orders`, { replace: true });
        break
      default:
        break;
    }
  }

  // function getActionButtons(a) {
  //   return (
  //     <div className="flex space-x-2">
  //       <PrimaryButton
  //         onClick={() => {
  //           setShop(a);
  //           setShowEdit(true);
  //         }}
  //       >
  //         <PencilAltIcon className="w-4 h-4" />
  //       </PrimaryButton>
  //       <DangerButton
  //         onClick={() => {
  //           setDeleteId(a.id);
  //           setShowConfirm(true);
  //         }}
  //       >
  //         <TrashIcon className="w-4 h-4" />
  //       </DangerButton>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col space-y-4">
      <Modal title="Add Shop" isOpen={showAdd}>
        <ShopAdd
          shop={shop}
          handleClose={(result) => {
            setShowAdd(false);
            setShop(undefined);
            if (result === true) {
              toast.success("Shop save successfully.");
              requestShops();
            }
          }}
        />
      </Modal>

      <Modal title="Edit Shop" isOpen={showEdit}>
        <ShopEdit
          shop={shop}
          handleClose={(result) => {
            setShowEdit(false);
            setShop(undefined);
            if (result === true) {
              toast.success("Shop save successfully.");
              requestShops();
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
            <h3 className="text-gray-600">Shops</h3>
            {
              Role==='Admin'?
              <PrimaryButton
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
                  <Table.TH className="w-25">Image</Table.TH>
                  <Table.TH className="w-22">Name</Table.TH>
                  <Table.TH className="w-60">Email</Table.TH>
                  <Table.TH className="w-25">Phone</Table.TH>
                  <Table.TH className="w-30">Address</Table.TH>
                  <Table.TH className="w-25">Owner</Table.TH>
                  <Table.TH className="w-30"></Table.TH>
                </tr>
              </Table.THead>

              <Table.TBody>
                {list.map((c) => {
                  return (
                    <tr key={c.id}>
                      <Table.TD> <img
                            src={c.fileUrl}
                            alt={c.fileName}
                            className="w-full aspect-auto rounded drop-shadow-md"
                          /></Table.TD>
                      <Table.TD>{c.shopName}</Table.TD>
                      <Table.TD>{c.shopEmail}</Table.TD>
                      <Table.TD>{c.shopPhone}</Table.TD>
                      <Table.TD>{c.address}</Table.TD>
                      <Table.TD>{c.ownerName}</Table.TD>
                      {/* <Table.TD>{getActionButtons(c)}</Table.TD> */}
                      <Table.TD>
                        <Select
                          onChange={(e) => {
                           handleSelects({
                              status:e.target.value,
                              shop:c
                           });
                          }}
                        >
                          <option>Option</option>
                          <option value="PRODUCT">View Products</option>
                          <option value="COMBO">View Combos</option>
                          {
                            Role==='Admin'?
                            <>
                              <option value="UPDATE">Update</option>
                              <option value="DELETE">Delete</option>
                            </>
                            :
                            <option value="ORDER">View Orders</option>
                          }
                        </Select>
                      </Table.TD>
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

export default ShopList;
