import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Alert from "../../components/common/Alert";
import { Actions, useAPIRequest } from "../../components/common/api-request";
import Card from "../../components/common/Card";
import { LoadingContext } from "../../components/common/Contexts";
import { DatePickerInput, Input, Select } from "../../components/common/FormControls";
import Pagination from "../../components/common/Pagination";
import Table from "../../components/common/Table";
import { formatPrice, formatTimestamp, parseError } from "../../components/common/utils";
import { getOrders } from "../../components/order/OrderRepo";
import { useParams } from "react-router-dom";
import Modal,{ItemModal} from "../../components/common/Modal";
import { SecondaryButton, PrimaryButton } from "../../components/common/Buttons";
import { PencilAltIcon,EyeIcon } from "@heroicons/react/outline";
import { OrderEdit } from "../../components/order/modal/OrderEdit";
import { OrderDetail } from "../../components/order/modal/OrderDetail";


function OrderList() {
  const loadingContext = useContext(LoadingContext);
  let params = useParams();

  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const [order, setOrder] = useState();
  const [orderId, setOrderId] = useState();

  const [list, setList] = useState([]);
  const [listState, requestOrders] = useAPIRequest(getOrders);

  const [query, setQuery] = useState({
    shopId:params.id,
    pageIndex: 0
  });

  const [paging, setPaging] = useState({ hasPrev: false, hasNext: false });

  // const [orderNumber, setOrderNumber] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    return () => {
      loadingContext.setLoading(false);
    };
  }, []);

  useEffect(() => {
    loadingContext.setLoading(listState.status === Actions.loading);
    if (listState.status === Actions.success) {
      let payload = listState.payload?.list ?? [];
      setList(payload);
      setPaging({
        hasNext: listState.payload?.hasNext,
        hasPrev: listState.payload?.hasPrev,
      });
      if (payload.length === 0) {
        toast.info("No order found.");
      }
    }
  }, [listState]);

  useEffect(() => {
    requestOrders(query);
  }, [query]);

  // function handleQueryChange(value) {
  //   setQuery((q) => ({
  //     ...q,
  //     ...value,
  //     orderNumber: orderNumber,
  //     phoneNumber: phoneNumber,
  //     first: null,
  //     last: null,
  //   }));
  // }

  function getActionButtons(o) {
    return (
      <div className="flex space-x-2">
        <SecondaryButton
          onClick={() => {
            setOrderId(o.id);
            setShowDetail(true);
          }}
        >
          <EyeIcon className="w-4 h-4" />
        </SecondaryButton>

        <PrimaryButton
          onClick={() => {
            setOrder(o);
            setShowEdit(true);
          }}
        >
          <PencilAltIcon className="w-4 h-4" />
        </PrimaryButton>
        
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">

      <ItemModal isOpen={showDetail}>
        <OrderDetail
          orderId={orderId}
          handleClose={() => {
            setShowDetail(false);
            requestOrders(query);
          }}
        />
      </ItemModal>

      <Modal title="Edit Order Status *" isOpen={showEdit}>
        <OrderEdit
          order={order}
          handleClose={(result) => {
            setShowEdit(false);
            setOrder(undefined);
            if (result === true) {
              toast.success("Order save successfully.");
              requestOrders(query);
            }
          }}
        />
      </Modal>

      {listState.status === Actions.failure && (
        <Alert alertClass="alert-error mb-4" closeable>
          {parseError(listState.error)}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <div className="flex items-center">
            <h3 className="text-gray-600">Orders</h3>
          </div>
        </Card.Header>
        <Card.Body className="flex flex-col space-y-2">
          {/* <div className="flex flex-wrap items-center">
            <div className="mr-3 mb-2">
              <Select
                name="staus"
                value={query.status ?? ""}
                onChange={(e) => {
                  handleQueryChange({ status: e.target.value });
                }}
              >
                <option value={""}>All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="DELIVERING">Delivering</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>
            </div>
            <div className="mr-3 mb-2">
              <Input
                name="orderNumber"
                placeholder="By order number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setQuery((q) => ({
                      ...q,
                      orderNumber: orderNumber,
                      first: null,
                      last: null,
                    }));
                  }
                }}
              />
            </div>
            <div className="mr-3 mb-2">
              <Input
                name="phoneNumber"
                placeholder="By phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setQuery((q) => ({
                      ...q,
                      phoneNumber: phoneNumber,
                      first: null,
                      last: null,
                    }));
                  }
                }}
              />
            </div>
            <div className="mr-3 mb-2">
              <DatePickerInput
                name="orderDate"
                placeholder="By order date"
                onChange={(date) => handleQueryChange({ orderDate: date })}
              />
            </div>
          </div> */}
          <div className="overflow-x-auto">
            <Table>
              <Table.THead>
                <tr>
                  <Table.TH className="w-20">No.</Table.TH>
                  <Table.TH className="w-50 ">Name</Table.TH>
                  <Table.TH className="w-45">Contact No.</Table.TH>
                  <Table.TH className="w-40">Total Price</Table.TH>
                  <Table.TH className="w-36">Status</Table.TH>
                  <Table.TH className="w-40">Address</Table.TH>
                  <Table.TH className="w-40"></Table.TH>
                  {/* <Table.TH className="w-60">Ordered At</Table.TH> */}
                </tr>
              </Table.THead>

              <Table.TBody>
                {list.map((o,i) => {
                  return (
                    <tr key={o.id}>
                      <Table.TD>
                        {/* <Link to={`${o.id}`} className="underline"> */}
                          {i+1}
                        {/* </Link> */}
                      </Table.TD>
                      <Table.TD>{o.customerName}</Table.TD>
                      <Table.TD>{o.customerPhone}</Table.TD>
                      <Table.TD>{o.total}$</Table.TD>
                      <Table.TD>{o.status}</Table.TD>
                      <Table.TD>{o.customerAddress}</Table.TD>
                      <Table.TD>{getActionButtons(o)}</Table.TD>
                      {/* <Table.TD>{formatTimestamp(o.createdAt)}</Table.TD> */}
                    </tr>
                  );
                })}
              </Table.TBody>
            </Table>
          </div>

          <div className="flex flex-row-reverse">
          <Pagination
              list={list}
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

export default OrderList;
