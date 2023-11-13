import { useContext, useEffect, useState } from "react";
import Alert from "../../common/Alert";
import { Actions, useAPIRequest } from "../../common/api-request";
import Card from "../../common/Card";
import { LoadingContext } from "../../common/Contexts";
import Table from "../../common/Table";
import {  formatTimestamp, parseError } from "../../common/utils";
import { getOrder } from "../OrderRepo";
import { DefaultButton } from "../../common/Buttons";

export function OrderDetail({orderId,handleClose}) {

  const loadingContext = useContext(LoadingContext);

  const [list, setList] = useState([]);

  const [listState, requestCombos] = useAPIRequest(getOrder);

  useEffect(() => {
    requestCombos(orderId);

    return () => {
      loadingContext.setLoading(false);
    };
  }, []);

  useEffect(() => {
    loadingContext.setLoading(listState.status === Actions.loading);
    if (listState.status === Actions.success) {
      setList(listState.payload.orderDetails ?? []);
    }
  }, [listState]);

  return (
    <div className="flex flex-col space-y-4">

      {listState.status === Actions.failure && (
        <Alert alertClass="alert-error mb-4" closeable>
          {parseError(listState.error)}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <div className="flex items-center">
            <h3 className="text-gray-600">Order Detail *</h3>            
          </div>
        </Card.Header>
        <Card.Body>
          <div className="overflow-x-auto">
            <Table>
              <Table.THead>
                <tr>
                  <Table.TH className="w-25">Name</Table.TH>
                  <Table.TH className="w-22">Deposit</Table.TH>
                  <Table.TH className="w-60">Rental Price</Table.TH>
                  <Table.TH className="w-25">Status</Table.TH>
                  <Table.TH className="w-30">Due to *</Table.TH>
                  {/* <Table.TH className="w-25">Shop</Table.TH> */}
                </tr>
              </Table.THead>

              <Table.TBody>
                {list.map((c) => {
                  return (
                    <tr key={c.id}>
                      <Table.TD>{c.comboName}</Table.TD>
                      <Table.TD>{c.deposit}</Table.TD>
                      <Table.TD>{c.rentalPrice}</Table.TD>
                      <Table.TD>{c.status}</Table.TD>
                      <Table.TD>{formatTimestamp(c.dueDate)}</Table.TD>
                      {/* <Table.TD>{c.shopName}</Table.TD> */}
                    </tr>
                );
                })}
              </Table.TBody>
            </Table>
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

