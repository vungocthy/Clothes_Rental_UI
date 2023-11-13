import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { DangerButton, PrimaryButton } from "../../components/common/Buttons";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Actions, useAPIRequest } from "../../components/common/api-request";
import { deleteProduct,getProducts } from "../../components/product/ProductRepo";
import { LoadingContext } from "../../components/common/Contexts";
import { formatPrice, formatTimestamp, parseError } from "../../components/common/utils";
import { toast } from "react-toastify";
import { ConfirmModal, ItemModalAdd, ItemModalProduct } from "../../components/common/Modal";
import Alert from "../../components/common/Alert";
import { useParams } from "react-router-dom";
import { Role } from "../../constants";
import { ProductAdd, ProductEdit } from "../../components/product/modal/ProductEdit";


function ProductList() {
  let params = useParams();
  const loadingContext = useContext(LoadingContext);

  const [showAdd,setShowAdd]=useState(false);
  const [showEdit,setShowEdit]=useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState();

  const [Product,setProduct]=useState(null);
  const [productList, setProductList] = useState([]);
  const [productListState, requestProducts] = useAPIRequest(getProducts);

  const [delState, requestDelete] = useAPIRequest(deleteProduct);

  const [query, setQuery] = useState({
    shopId:params.id,
    pageIndex: 0,
  });

  const [paging, setPaging] = useState({ hasPrev: false, hasNext: false });

  useEffect(() => {
    return () => {
      loadingContext.setLoading(false);
    };
  }, []);

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
      requestProducts({
        shopId:params.id,
        pageIndex: 0
      });
    }
    if (delState.status === Actions.failure) {
      toast.error(parseError(delState.error));
    }
  }, [delState]);

  useEffect(() => {
    requestProducts(query);
  }, [query]);

  function handleQueryChange(value) {
    setQuery((q) => ({
      ...q,
      ...value,
      first: null,
      last: null,
    }));
  }

  function getActtionButtons(p) {
    return (
      <div className="flex space-x-2">
        <PrimaryButton
          onClick={() => {
            setProduct(p);
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


  return (
    <div className="flex flex-col space-y-4">

      <ItemModalProduct isOpen={showEdit}>
        <ProductEdit
          product={Product}
          handleClose={() => {
            setShowEdit(false);
            requestProducts(query);
          }}
        />
      </ItemModalProduct>

      <ItemModalProduct isOpen={showAdd}>
        <ProductAdd
          shopId={params.id}
          handleClose={() => {
            setShowAdd(false);
            requestProducts(query);
          }}
        />
      </ItemModalProduct>

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
            <h3 className="text-gray-600">Products *</h3>
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
                      <Table.TD>{p.material}</Table.TD>
                      <Table.TD>{p.categoryName}</Table.TD>
                      {
                        Role==='Owner'? <Table.TD>{getActtionButtons(p)}</Table.TD>:null
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
    </div>
  );
}

export default ProductList;
