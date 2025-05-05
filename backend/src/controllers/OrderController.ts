import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { MenuItem } from "../entities/MenuItem";
import { ErrorDto, OrderDto, OrderRequestBodyDto } from "../types";

export const createOrder = async (req: Request<OrderRequestBodyDto, OrderDto | ErrorDto>, res: Response) => {
  try {
    const orderRepository = getRepository(Order);
    const orderItemsRepository = getRepository(OrderItem);
    try {
      const { items, tableNumber } = req.body;

      if (!items || !tableNumber) {
        res.status(400).send({ message: 'Unable to create order' });
        return;
      }

      const newOrder = orderRepository.create({
        tableNumber,
      });
      const result = await orderRepository.save(newOrder);

      const menuRepository = getRepository(MenuItem);

      const savedOrderItems: Omit<OrderItem, 'order'>[] = [];
      for (const item of items) {
        const { name, quantity } = item;
        const menuItem = await menuRepository.findOne({ where: { name } });
        if (!menuItem) {
          throw new Error(`Menu item with name ${name} not found`);
        }
        const orderItem = orderItemsRepository.create({
          name,
          quantity,
          price: menuItem.price,
          status: 'pending',
          order: newOrder,
        });
        const { order, ...savedOrderItem } = await orderItemsRepository.save(orderItem);
        savedOrderItems.push(savedOrderItem);
      }

      res.status(201).json({...formatOrderToResponse(result), items: savedOrderItems});
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'unknown error' });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'unknown error' });
    }
  }
};

export const getOrders = async (req: Request<{}, OrderDto[] | ErrorDto>, res: Response) => {
  try {
    const orderRepository = getRepository(Order);
    const orders = await orderRepository.find({ relations: ["items"] });

    const { filter } = req.query;

    if (!filter) {
      res.json(orders.map(o => formatOrderToResponse(o)));
      return;
    }

    if (typeof filter !== 'string' || !["pending", "preparing", "ready", "served"].includes(filter)) {
      res.status(400).send({ message: 'Incorrect filter' });
      return;
    }

    res.json(orders.filter(o => o.status === filter).map(o => formatOrderToResponse(o)));
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'unknown error' });
    }
  }
};

export const getOrderById = async (req: Request<{id: string}, OrderDto | ErrorDto>, res: Response) => {
  try {
    const orderRepository = getRepository(Order);
    const orders = await orderRepository.find({ relations: ["items"] });
    const foundOrder = orders.find(order => order.id === Number(req.params.id));
    if (!foundOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json(formatOrderToResponse(foundOrder));
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'unknown error' });
    }
  }
};

const formatOrderToResponse = (order: Order): OrderDto => {
  return {
    ...order,
    createdAt: order.createdAt.toString(),
  };
}
