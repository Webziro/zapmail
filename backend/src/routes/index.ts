import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/authController';
import { RulesController } from '../controllers/rulesController';
import { LogsController } from '../controllers/logsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

const authController = new AuthController();
const rulesController = new RulesController();
const logsController = new LogsController();

// Auth Routes
router.post(
  '/auth/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
  ],
  authController.register.bind(authController)
);

router.post(
  '/auth/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  authController.login.bind(authController)
);

router.get('/auth/profile', authMiddleware, authController.getProfile.bind(authController));

// Forwarding Rules Routes
router.post(
  '/rules',
  authMiddleware,
  [
    body('name').trim().notEmpty(),
    body('emailUser').isEmail(),
    body('emailPassword').notEmpty(),
    body('twilioAccountSid').notEmpty(),
    body('twilioAuthToken').notEmpty(),
    body('whatsappSender').notEmpty(),
    body('whatsappRecipient').notEmpty(),
  ],
  rulesController.createRule.bind(rulesController)
);

router.get('/rules', authMiddleware, rulesController.getRules.bind(rulesController));

router.get('/rules/:id', authMiddleware, rulesController.getRule.bind(rulesController));

router.put('/rules/:id', authMiddleware, rulesController.updateRule.bind(rulesController));

router.delete('/rules/:id', authMiddleware, rulesController.deleteRule.bind(rulesController));

router.patch('/rules/:id/toggle', authMiddleware, rulesController.toggleRule.bind(rulesController));

// Logs Routes
router.get('/logs', authMiddleware, logsController.getLogs.bind(logsController));

router.get('/logs/stats', authMiddleware, logsController.getLogStats.bind(logsController));

router.delete('/logs', authMiddleware, logsController.clearLogs.bind(logsController));

export default router;