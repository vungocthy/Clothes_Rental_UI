import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { DangerButton,PrimaryButton } from "../../common/Buttons";
import Card from "../../common/Card";
import Table from "../../common/Table";
import Pagination from "../../common/Pagination";
import { useContext, useEffect, useState } from "react";

import { Actions, useAPIRequest } from "../../common/api-request";

import { LoadingContext } from "../../common/Contexts";
import { formatPrice, formatTimestamp, parseError } from "../../common/utils";
import { toast } from "react-toastify";
import Modal,{ ConfirmModal, ItemModal, ItemModalAdd } from "../../common/Modal";
import Alert from "../../common/Alert";
import { DefaultButton } from '../../common/Buttons';
import { getProductCombo,deleteProductCombo } from "../ComboRepo";
import { ProductComboAdd, ProductComboEdit } from "./ProductComboEdit";
import { Role} from "../../../constants";

export function ProductCombo({combo , handleClose }){
  
    const loadingContext = useContext(LoadingContext);
    const [showEdit, setShowEdit] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAdd,setShowAdd]=useState(false);
    const [deleteId, setDeleteId] = useState(); 

    const [productCombo,setProductCombo]=useState();
    const [productList, setProductList] = useState([]);
    const [productListState, requestProducts] = useAPIRequest(getProductCombo);
  
    const [delState, requestDelete] = useAPIRequest(deleteProductCombo);
    const [query, setQuery] = useState({
      comboId:combo?combo.id:null,
      pageIndex: 0,
    });
  
    const [paging, setPaging] = useState({ hasPrev: false, hasNext: false });


    useEffect(() => {
      loadingContext.setLoading(productListState.status === Actions.loading);
      if (productListState.status === Actions.success) {
          let payload = productListState.payload?.list ?? [];
          setProductList(payload);
          setPaging({
          hasNext: productListState.payload?.hasNext,
          hasPrev: productListState.payload?.hasPrev,
          });
          if (payload.length === 0) {
          toast.info("No Product found.");
          }
      }
    }, [productListState]);

    useEffect(() => {
    loadingContext.setLoading(delState.status === Actions.loading);
    if (delState.status === Actions.success) {
        toast.success("Product deleted successfully.");
        requestProducts(query);
    }
    if (delState.status === Actions.failure) {
        toast.error(parseError(delState.error));
    }
    }, [delState]); 


    useEffect(() => {
        requestProducts(query);
    }, [query]);


  function getActtionButtons(p) {
    return (
      <div className="flex space-x-2">
        <PrimaryButton
          onClick={() => {
            setProductCombo(p);
            setShowEdit(true);
          }}
        >
          <PencilAltIcon className="w-4 h-4" />
        </PrimaryButton>
        <DangerButton
          onClick={() => {
            setDeleteId(p.id);
            setShowConfirm(true);
          }}
        >
          <TrashIcon className="w-4 h-4" />
        </DangerButton>
      </div>
    );
  }

    return(
    <div className="flex flex-col space-y-4">

       <ItemModalAdd isOpen={showAdd}>
          <ProductComboAdd
            comboId={combo?combo.id:null}
            handleClose={() => {
              setShowAdd(false);
              requestProducts(query);
            }}
          />
       </ItemModalAdd> 

      <Modal title="Edit Product" isOpen={showEdit}>
        <ProductComboEdit
          productCombo={productCombo}
          handleClose={(result) => {
            setShowEdit(false);
            setProductCombo(undefined);
            if (result === true) {
              toast.success("Save successfully.");
              requestProducts(query);
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
  
        {productListState.status === Actions.failure && (
          <Alert alertClass="alert-error mb-4" closeable>
            {parseError(productListState.error)}
          </Alert>
        )}
  
        <Card>
          <Card.Header>
            <div className="flex items-center">
              <h3 className="text-gray-600">Combo - {combo ? combo.comboName : "Combo"}</h3>
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
                    {
                      Role==='Owner'?<Table.TH className="w-44"></Table.TH>:null
                    }
                    
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
                        {
                          Role==='Owner'?<Table.TD>{getActtionButtons(p)}</Table.TD>:null
                        }
                        
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