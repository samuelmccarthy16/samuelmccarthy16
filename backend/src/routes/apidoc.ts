import path from 'path';
import express, { Router } from 'express';
import swaggerUI from 'swagger-ui-express';
import openapiDoc from '../schemas/openapi.json';

export const router = Router();

router.use('/', swaggerUI.serve);
router.get('/', swaggerUI.setup(openapiDoc));

router.use('/openapi.json', express.static(path.join(__dirname, '../schemas/openapi.json')));

export default router;
