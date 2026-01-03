import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class LogsController {
  async getLogs(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { ruleId, status, limit = '50', offset = '0' } = req.query;

      const where: any = { userId };

      if (ruleId) {
        where.ruleId = ruleId as string;
      }

      if (status) {
        where.status = status as string;
      }

      const [logs, total] = await Promise.all([
        prisma.forwardingLog.findMany({
          where,
          include: {
            rule: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: parseInt(limit as string),
          skip: parseInt(offset as string),
        }),
        prisma.forwardingLog.count({ where }),
      ]);

      res.json({
        logs,
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
    } catch (error) {
      console.error('Get logs error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getLogStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { ruleId } = req.query;

      const where: any = { userId };
      if (ruleId) {
        where.ruleId = ruleId as string;
      }

      const [total, successful, failed] = await Promise.all([
        prisma.forwardingLog.count({ where }),
        prisma.forwardingLog.count({ where: { ...where, status: 'success' } }),
        prisma.forwardingLog.count({ where: { ...where, status: 'failed' } }),
      ]);

      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);

      const recentLogs = await prisma.forwardingLog.count({
        where: {
          ...where,
          createdAt: {
            gte: last24Hours,
          },
        },
      });

      res.json({
        total,
        successful,
        failed,
        successRate: total > 0 ? ((successful / total) * 100).toFixed(2) : 0,
        last24Hours: recentLogs,
      });
    } catch (error) {
      console.error('Get log stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async clearLogs(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { ruleId } = req.query;

      const where: any = { userId };
      if (ruleId) {
        where.ruleId = ruleId as string;
      }

      const result = await prisma.forwardingLog.deleteMany({ where });

      res.json({
        message: 'Logs cleared successfully',
        deletedCount: result.count,
      });
    } catch (error) {
      console.error('Clear logs error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}