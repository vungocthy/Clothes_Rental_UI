import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { DangerButton, PrimaryButton } from "../components/common/Buttons";
import Card from "../components/common/Card";
import Table from "../components/common/Table";
import Pagination from "../components/common/Pagination";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Actions, useAPIRequest } from "../components/common/api-request";
import { deleteProduct, getProducts } from "./ProductRepo";
import { LoadingContext } from "../components/common/Contexts";
import { formatPrice, formatTimestamp, parseError } from "../components/common/utils";
import { toast } from "react-toastify";
import { ConfirmModal } from "../components/common/Modal";
import { baseImagePath } from "../App";
import Alert from "../components/common/Alert";
import { useParams } from "react-router-dom";

function ProductList() {
  let params = useParams();
  const loadingContext = useContext(LoadingContext);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState();

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
        <Link to={p.id}>
          <PrimaryButton>
            <PencilAltIcon className="w-4 h-4" />
          </PrimaryButton>
        </Link>
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

  function getProductImageUrl(p) {
    if (p.images && p.images.length > 0) {
      return `${baseImagePath}/books%2F${p.images[0]}?alt=media`;
    }

    return "/placeholder.png";
  }

  return (
    <div className="flex flex-col space-y-4">
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
            <h3 className="text-gray-600">Shop - Demo</h3>
            <Link to={"/books/new"} className="ml-auto">
              <PrimaryButton onClick={() => {}}>
                <PlusIcon className="w-5 h-5 mr-2" />
                Add New
              </PrimaryButton>
            </Link>
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
                  <Table.TH className="w-44"></Table.TH>
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
                      <Table.TD>{formatTimestamp(p.categoryName)}</Table.TD>
                      <Table.TD>{getActtionButtons(p)}</Table.TD>
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
