/**
 * Info routes
 */
const express = require('express');
const router = express.Router();
const { getProjectInfo, getProjectPath } = require('@/src/utils/pathExample');

// Get project info
router.get('/project', (req, res) => {
  res.json(getProjectInfo());
});

// Get project paths
router.get('/paths', (req, res) => {
  res.json({
    root: getProjectPath(''),
    src: getProjectPath('src'),
    routes: getProjectPath('src/routes'),
    config: getProjectPath('src/config')
  });
});

module.exports = router;