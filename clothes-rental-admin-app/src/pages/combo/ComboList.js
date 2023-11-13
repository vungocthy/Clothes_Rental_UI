import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Alert from "../../components/common/Alert";
import { Actions, useAPIRequest } from "../../components/common/api-request";
import { DangerButton, PrimaryButton } from "../../components/common/Buttons";
import Card from "../../components/common/Card";
import { LoadingContext } from "../../components/common/Contexts";
import Modal, { ConfirmModal, ItemModal } from "../../components/common/Modal";
import Table from "../../components/common/Table";
import {  parseError } from "../../components/common/utils";
import { ComboAdd,ComboEdit } from "../../components/combo/modal/ComboEdit";
import { deleteCombo,getCombos } from "../../components/combo/ComboRepo";
import { Select } from "../../components/common/FormControls";
import { ProductCombo } from "../../components/combo/product-combo/ProductCombo";
import { Role } from "../../constants";
import { useParams } from "react-router-dom";


function ComboList() {
  const params= useParams();
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showProduct, setShowProduct] = useState(false);

  const loadingContext = useContext(LoadingContext);

  const [list, setList] = useState([]);
  const [Combo, setCombo] = useState();
  const [deleteId, setDeleteId] = useState();

  const [listState, requestCombos] = useAPIRequest(getCombos);
  const [delState, requestDelete] = useAPIRequest(deleteCombo);

  useEffect(() => {
    requestCombos(params.id);

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
      requestCombos(params.id);
    }
    if (delState.status === Actions.failure) {
      toast.error(parseError(delState.error));
    }
  }, [delState]);

  function handleSelects(a){
    setCombo(a.combo);
    switch(a.status){
      case "PRODUCT":    
        setShowProduct(true);
        break;
      case "UPDATE":
          setShowEdit(true);
        break;
      case "DELETE":
          setDeleteId(a.combo.id);
          setShowConfirm(true);
        break
      default:
        break;
    }
  }


  return (
    <div className="flex flex-col space-y-4">

      <ItemModal title={"Combo"} isOpen={showProduct}>
          <ProductCombo
            combo={Combo}
            handleClose={() => {
              setShowProduct(false);
              setCombo(undefined);
              requestCombos(params.id);
            }}
          />
      </ItemModal> 


      <Modal title="Add Combo" isOpen={showAdd}>
        <ComboAdd
          shopId={params.id}
          combo={Combo}
          handleClose={(result) => {
            setShowAdd(false);
            setCombo(undefined);
            if (result === true) {
              toast.success("Save successfully.");
              requestCombos(params.id);
            }
          }}
        />
      </Modal>

      <Modal title="Edit Combo" isOpen={showEdit}>
        <ComboEdit
          combo={Combo}
          handleClose={(result) => {
            setShowEdit(false);
            setCombo(undefined);
            if (result === true) {
              toast.success("Save successfully.");
              requestCombos(params.id);
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
            <h3 className="text-gray-600">Combos</h3>
            {
              Role==='Owner'?
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
                  <Table.TH className="w-60">Description</Table.TH>
                  <Table.TH className="w-25">Quantity</Table.TH>
                  <Table.TH className="w-30">Total Value</Table.TH>
                  <Table.TH className="w-25">Shop</Table.TH>
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
                        className="w-full aspect-auto rounded drop-shadow-md" /></Table.TD>
                      <Table.TD>{c.comboName}</Table.TD>
                      <Table.TD>{c.description}</Table.TD>
                      <Table.TD>{c.quantity}</Table.TD>
                      <Table.TD>{c.totalValue}</Table.TD>
                      <Table.TD>{c.shopName}</Table.TD>
                      <Table.TD>
                        <Select
                          onChange={(e) => {
                            handleSelects({
                              status: e.target.value,
                              combo: c
                            });
                          } }
                        >
                          <option>Option</option>
                          <option value="PRODUCT">Products</option>
                          {
                            Role==='Owner'?
                            <>
                              <option value="UPDATE">Update</option>
                              <option value="DELETE">Delete</option>
                            </>
                            :null
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

export default ComboList;
