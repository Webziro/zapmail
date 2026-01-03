import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { validationResult } from 'express-validator';
import { encryptPassword, decryptPassword } from '../utils/encryption';

const prisma = new PrismaClient();

export class RulesController {
  async createRule(req: AuthRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.userId!;
      const {
        name,
        emailUser,
        emailPassword,
        emailHost,
        emailPort,
        emailTls,
        filterSubjects,
        filterSenders,
        filterHours,
        twilioAccountSid,
        twilioAuthToken,
        whatsappSender,
        whatsappRecipient,
        cronSchedule,
      } = req.body;

      const encryptedEmailPassword = encryptPassword(emailPassword);
      const encryptedTwilioToken = encryptPassword(twilioAuthToken);

      const rule = await prisma.forwardingRule.create({
        data: {
          userId,
          name,
          emailUser,
          emailPassword: encryptedEmailPassword,
          emailHost: emailHost || 'imap.gmail.com',
          emailPort: emailPort || 993,
          emailTls: emailTls !== false,
          filterSubjects: filterSubjects || [],
          filterSenders: filterSenders || [],
          filterHours: filterHours || 24,
          twilioAccountSid,
          twilioAuthToken: encryptedTwilioToken,
          whatsappSender,
          whatsappRecipient,
          cronSchedule: cronSchedule || '*/10 * * * *',
          isActive: true,
        },
      });

      res.status(201).json({
        message: 'Forwarding rule created successfully',
        rule: this.sanitizeRule(rule),
      });
    } catch (error) {
      console.error('Create rule error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRules(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const rules = await prisma.forwardingRule.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        rules: rules.map(rule => this.sanitizeRule(rule)),
      });
    } catch (error) {
      console.error('Get rules error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRule(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const rule = await prisma.forwardingRule.findFirst({
        where: { id, userId },
      });

      if (!rule) {
        return res.status(404).json({ error: 'Rule not found' });
      }

      res.json({ rule: this.sanitizeRule(rule) });
    } catch (error) {
      console.error('Get rule error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateRule(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const rule = await prisma.forwardingRule.findFirst({
        where: { id, userId },
      });

      if (!rule) {
        return res.status(404).json({ error: 'Rule not found' });
      }

      const updateData: any = { ...req.body };

      if (updateData.emailPassword) {
        updateData.emailPassword = encryptPassword(updateData.emailPassword);
      }

      if (updateData.twilioAuthToken) {
        updateData.twilioAuthToken = encryptPassword(updateData.twilioAuthToken);
      }

      const updatedRule = await prisma.forwardingRule.update({
        where: { id },
        data: updateData,
      });

      res.json({
        message: 'Rule updated successfully',
        rule: this.sanitizeRule(updatedRule),
      });
    } catch (error) {
      console.error('Update rule error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteRule(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const rule = await prisma.forwardingRule.findFirst({
        where: { id, userId },
      });

      if (!rule) {
        return res.status(404).json({ error: 'Rule not found' });
      }

      await prisma.forwardingRule.delete({
        where: { id },
      });

      res.json({ message: 'Rule deleted successfully' });
    } catch (error) {
      console.error('Delete rule error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async toggleRule(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const rule = await prisma.forwardingRule.findFirst({
        where: { id, userId },
      });

      if (!rule) {
        return res.status(404).json({ error: 'Rule not found' });
      }

      const updatedRule = await prisma.forwardingRule.update({
        where: { id },
        data: { isActive: !rule.isActive },
      });

      res.json({
        message: `Rule ${updatedRule.isActive ? 'activated' : 'deactivated'}`,
        rule: this.sanitizeRule(updatedRule),
      });
    } catch (error) {
      console.error('Toggle rule error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  private sanitizeRule(rule: any) {
    const { emailPassword, twilioAuthToken, ...sanitized } = rule;
    return {
      ...sanitized,
      hasEmailPassword: !!emailPassword,
      hasTwilioToken: !!twilioAuthToken,
    };
  }

  private decryptRuleCredentials(rule: any) {
    return {
      ...rule,
      emailPassword: decryptPassword(rule.emailPassword),
      twilioAuthToken: decryptPassword(rule.twilioAuthToken),
    };
  }
}