import {
  interceptRequest, proxyRequest,
} from '@server/middleware';
import { Router } from 'express';

const router = Router();

router.all('/:user/:domain/**',
  interceptRequest,
  proxyRequest);

export default router;
