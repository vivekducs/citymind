import express from 'express';
import { AgentController } from '../controllers/agent.controller';

const router = express.Router();

router.post(['/agent/ingestion', '/api/agent/ingestion'], AgentController.triggerIngestion);
router.post(['/agent/duplicate-detection', '/api/agent/duplicate-detection'], AgentController.triggerDuplicateDetection);
router.post(['/agent/escalation', '/api/agent/escalation'], AgentController.triggerEscalation);
router.post(['/agent/insights', '/api/agent/insights'], AgentController.triggerInsights);
router.post(['/agent/leaderboard', '/api/agent/leaderboard'], AgentController.triggerLeaderboard);
router.get(['/dashboard/insights', '/api/dashboard/insights'], AgentController.getDashboardInsights);
router.get(['/agents/registry', '/api/agents/registry'], AgentController.getRegistry);
router.get(['/agents/logs', '/api/agents/logs'], AgentController.getLogs);

// Phase 5 predictive intelligence & autonomous governance endpoints
router.get(['/predictive/twin', '/api/predictive/twin'], AgentController.getTwinData);
router.get(['/predictive/budget', '/api/predictive/budget'], AgentController.getBudgetOptimization);
router.post(['/predictive/simulate', '/api/predictive/simulate'], AgentController.simulateDecision);
router.get(['/predictive/briefing', '/api/predictive/briefing'], AgentController.getExecutiveBriefing);
router.post(['/predictive/search', '/api/predictive/search'], AgentController.searchSemantic);
router.get(['/predictive/community', '/api/predictive/community'], AgentController.getCommunityInsights);

export default router;
