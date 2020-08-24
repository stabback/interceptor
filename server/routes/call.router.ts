import {
  interceptRequest, proxyRequest, validateDomain, validateUser,
} from '@server/middleware';
import { Router } from 'express';

const router = Router();

router.all('/:user/:domain/**',
  validateUser,
  validateDomain,
  interceptRequest,
  proxyRequest);

export default router;
