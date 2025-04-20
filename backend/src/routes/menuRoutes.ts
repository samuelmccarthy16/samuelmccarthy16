import { Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import { MenuItem } from "../entities/MenuItem";
import {authorize} from "../middlewares/auth";
import { MenuItemDto, ErrorDto, MenuItemRequestBodyDto } from "../types";

const router = Router();

/**
  * @openapi
  * /api/menu:
  *   get:
  *     summary: Get all menu items
  *     tags: [Menu]
  *     responses:
  *       200:
  *         description: List of menu items
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/MenuItem'
  *       500:
  *         $ref: '#/components/responses/InternalServerError'
  */
router.get("/", async (req: Request<{}, MenuItemDto[] | ErrorDto>, res: Response) => {
  try {
    const menuRepository = getRepository(MenuItem);
    const menuItems = await menuRepository.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu items" });
  }
});

/**
  * @openapi
  * /api/menu:
  *   post:
  *     summary: Add a new menu item
  *     tags: [Menu]
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/MenuItemRequestBody'
  *     responses:
  *       201:
  *         description: Menu item created
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/MenuItem'
  *       401:
  *         $ref: '#/components/responses/UnauthorizedError'
  *       403:
  *         $ref: '#/components/responses/ForbiddenError'
  *       500:
  *         $ref: '#/components/responses/InternalServerError'
  */
router.post("/", authorize('staff'), async (req: Request<{}, MenuItemDto | ErrorDto>, res: Response) => {
  try {
    const menuRepository = getRepository(MenuItem);
    const newItem = menuRepository.create(req.body as MenuItem);
    const result = await menuRepository.save(newItem);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: `Error creating menu item: ${error instanceof Error ? error.message : 'unknown error'}` });
  }
});

/**
  * @openapi
  * /api/menu/{id}:
  *   put:
  *     summary: Update a menu item
  *     tags: [Menu]
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/MenuItemRequestBody'
  *     responses:
  *       200:
  *         description: Updated menu item
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/MenuItem'
  *       401:
  *         $ref: '#/components/responses/UnauthorizedError'
  *       404:
  *         $ref: '#/components/responses/NotFoundError'
  *       500:
  *         $ref: '#/components/responses/InternalServerError'
  */
router.put("/:id", authorize('staff'), async (req: Request<{id: string}, MenuItemDto>, res: Response) => {
  try {
    const menuRepository = getRepository(MenuItem);
    console.log('>>> req', req);
    const item = await menuRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (item) {
      menuRepository.merge(item, req.body);
      const result = await menuRepository.save(item);
      res.json(result);
    } else {
      res.status(404).json({ message: "Menu item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating menu item" });
  }
});

/**
* @openapi
* /api/menu/{id}:
*   delete:
*     summary: Delete a menu item
*     tags: [Menu]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*     responses:
*       204:
*         description: Menu item deleted
*       401:
*         $ref: '#/components/responses/UnauthorizedError'
*       404:
*         $ref: '#/components/responses/NotFoundError'
*       500:
*         $ref: '#/components/responses/InternalServerError'
*/
router.delete("/:id", authorize('staff'), async (req, res) => {
  try {
    const menuRepository = getRepository(MenuItem);
    const result = await menuRepository.delete(req.params.id);
    if (result.affected === 0) {
      res.status(404).json({ message: "Menu item not found" });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting menu item" });
  }
});

export default router;
