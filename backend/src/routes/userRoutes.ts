import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { getRepository } from "typeorm";
import { User } from '../entities/User';
import { RegisterRequestBodyDto, UserDto, ErrorDto, LoginRequestBodyDto } from '../types';

const router = express.Router();

/**
 * @openapi
 * /api/user/register:
 *  post:
 *    summary: Register a new user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RegisterRequestBody'
 *    responses:
 *      201:
 *        description: User created
 *        content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/User'
 *      400:
 *        $ref: '#/components/responses/BadRequestError'
 *      500:
 *        $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/register',
  [
    body('login'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req: Request<RegisterRequestBodyDto, UserDto | ErrorDto>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { login, password } = req.body;

    try {
      const userRepository = getRepository(User);

      // Checking if a user with the given login already exists
      const existingUser = await userRepository.findOneBy({ login });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      // Hashing password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creating a new user
      const newUser = userRepository.create({
        login,
        passwordHash: hashedPassword,
        role: 'user',
      });

      // Saving a user to DB
      await userRepository.save(newUser);

      res.status(201).json({ id: newUser.id, login: newUser.login, role: newUser.role });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

/**
 * @openapi
 * /api/user/login:
 *  post:
 *    summary: Login
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginRequestBody'
 *    responses:
 *      200:
 *        description: User logged in
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      400:
 *        $ref: '#/components/responses/BadRequestError'
 *      500:
 *        $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/login',
  [
    body('login'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request<LoginRequestBodyDto, UserDto | ErrorDto>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { login, password } = req.body;

    try {
      const userRepository = getRepository(User);

      // Searching for a user by login
      const user = await userRepository.findOneBy({ login });
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      // Checking password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      // Creating JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      // Sending token
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.json({ id: user.id, login: user.login, role: user.role });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
