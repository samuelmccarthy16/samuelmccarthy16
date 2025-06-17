type TOrderItem = {
  id: number,
  name: string,
  price: number,
  quantity: number,
  status: string,
}

export type TOrder = {
  id: number,
  createdAt: string,
  items: TOrderItem[],
  status: string,
  tableNumber: number,
}
