import { cargoKeyFor, invoiceKeyFor } from "./shipping.ts";

export const YURTICI_TEST_URL =
  "http://testwebservices.yurticikargo.com:9090/KOPSWebServices/ShippingOrderDispatcherServices";
export const YURTICI_URL =
  "https://ws.yurticikargo.com/KOPSWebServices/ShippingOrderDispatcherServices";

export type YurticiShipment = {
  cargoKey: string;
  invoiceKey: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  town: string;
  email: string;
};

function xml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tag(source: string, name: string) {
  const match = source.match(new RegExp(`<(?:\\w+:)?${name}>([^<]*)</(?:\\w+:)?${name}>`, "i"));
  return match?.[1]?.trim() ?? "";
}

export function shipmentKeys(orderId: string) {
  return { cargoKey: cargoKeyFor(orderId), invoiceKey: invoiceKeyFor(orderId) };
}

export function createShipmentXml(auth: { user: string; password: string }, shipment: YurticiShipment) {
  const fields: Array<[string, string]> = [
    ["cargoKey", shipment.cargoKey],
    ["invoiceKey", shipment.invoiceKey],
    ["receiverCustName", shipment.name],
    ["receiverAddress", shipment.address],
    ["receiverPhone1", shipment.phone],
    ["cityName", shipment.city],
    ["townName", shipment.town],
    ["emailAddress", shipment.email],
    ["cargoCount", "1"],
  ];
  const body = fields.map(([key, value]) => `<${key}>${xml(value)}</${key}>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ship="http://yurticikargo.com.tr/ShippingOrderDispatcherServices">
<soapenv:Header/>
<soapenv:Body>
<ship:createShipment>
<wsUserName>${xml(auth.user)}</wsUserName>
<wsPassword>${xml(auth.password)}</wsPassword>
<userLanguage>TR</userLanguage>
<ShippingOrderVO>${body}</ShippingOrderVO>
</ship:createShipment>
</soapenv:Body>
</soapenv:Envelope>`;
}

export function queryShipmentXml(auth: { user: string; password: string }, cargoKey: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ship="http://yurticikargo.com.tr/ShippingOrderDispatcherServices">
<soapenv:Header/>
<soapenv:Body>
<ship:queryShipment>
<wsUserName>${xml(auth.user)}</wsUserName>
<wsPassword>${xml(auth.password)}</wsPassword>
<wsLanguage>TR</wsLanguage>
<keys>${xml(cargoKey)}</keys>
<keyType>0</keyType>
<addHistoricalData>false</addHistoricalData>
<onlyTracking>true</onlyTracking>
</ship:queryShipment>
</soapenv:Body>
</soapenv:Envelope>`;
}

export function parseCreateShipment(xmlBody: string) {
  const flag = tag(xmlBody, "outFlag");
  const jobId = tag(xmlBody, "jobId");
  return { ok: flag === "0" && jobId.length > 0, jobId };
}

export function parseQueryShipment(xmlBody: string) {
  return tag(xmlBody, "docId").replace(/\s+/g, "");
}
