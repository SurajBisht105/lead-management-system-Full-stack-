const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { validateLead, validateStatus } = require('../middleware/validation');

// Lead routes
router.post('/leads', validateLead, leadController.createLead);
router.get('/leads', leadController.getAllLeads);
router.get('/leads/:id', leadController.getLeadById);
router.patch('/leads/:id/status', validateStatus, leadController.updateLeadStatus);
router.delete('/leads/:id', leadController.deleteLead);

module.exports = router;