# Campaign Expert Integration Guide

## Overview
The **Campaign Expert** is a senior-level subagent with authority to review, critique, and command improvements across all aspects of the crowdfunding campaign. This agent performs iterative review cycles until the campaign meets expert standards (score ≥ 90/100).

## System Changes Summary

### 1. New Subagent Added
- **File**: `campaign_expert.md`
- **Role**: Senior crowdfunding expert with 10+ years experience
- **Authority**: Can command ALL other subagents to implement improvements
- **Tools**: Playwright for visual testing, PowerShell for orchestration

### 2. Updated Workflow (Phase 7 Added)
The campaign creation workflow now includes an iterative expert review phase:

```
Phase 1: Foundation (Product Manager) → 2 hours
Phase 2: Strategy (Content/Financial/Marketing) → 3 hours
Phase 3: Visual Creation (UI/Graphics) → 4 hours  
Phase 4: Integration (Video Scripts) → 2 hours
Phase 5: Compilation (Resource Compiler) → 2 hours
Phase 6: Quality Assurance (QA Reviewer) → 1 hour
Phase 7: Expert Review & Optimization → 3-6 hours (iterative)
```

### 3. New Directory Structure
```
expert_review/
├── evaluation_reports/     # Detailed analysis reports
├── recommendations/        # Prioritized improvement suggestions
├── improvement_plans/      # Implementation roadmaps
├── iteration_logs/        # Tracking all review cycles
├── visual_analysis/       # Playwright screenshots
├── commands/              # Commands sent to other agents
└── verification/          # Before/after evidence
```

## How the Campaign Expert Works

### 1. Initial Review Process
The Campaign Expert uses Playwright to thoroughly analyze the campaign:

```javascript
// Visual impact analysis
await page.goto('file:///final_campaigns/kickstarter/index.html');
await page.screenshot({ path: 'expert_review/visual_analysis/initial_load.png' });

// Test across devices
const devices = ['iPhone 12 Pro', 'iPad', 'Galaxy S21'];
for (const device of devices) {
    await page.emulate(devices[device]);
    await page.screenshot({ path: `expert_review/visual_analysis/${device}.png` });
}
```

### 2. Multi-Dimensional Evaluation
The expert evaluates campaigns across 6 key dimensions:

| Dimension | Weight | Key Factors | Benchmark |
|-----------|--------|-------------|-----------|
| **Strategic** | 20% | Positioning, pricing, rewards | 85/100 |
| **Psychological** | 15% | Emotional triggers, social proof | 80/100 |
| **Visual** | 15% | Hierarchy, aesthetics, mobile | 85/100 |
| **Content** | 20% | Headlines, story, benefits, CTAs | 90/100 |
| **Technical** | 10% | Performance, compatibility, SEO | 90/100 |
| **Conversion** | 20% | Friction, motivation, urgency | 85/100 |

### 3. Improvement Command System
When issues are identified, the expert sends specific commands to relevant agents:

```json
{
  "improvement_request": {
    "id": "IMP-001",
    "priority": "critical",
    "category": "conversion",
    "issue": "CTA button below fold on mobile",
    "recommendation": "Reposition primary CTA above fold",
    "target_agent": "ui-developer",
    "specific_instructions": {
      "file": "mockups/dashboard.html",
      "element": ".primary-cta",
      "change": "Move to hero section, increase size by 20%"
    },
    "success_criteria": "CTA visible without scrolling on all devices",
    "deadline": "2 hours"
  }
}
```

### 4. Iterative Improvement Process

```powershell
# Expert review iteration workflow
$maxIterations = 5
$targetScore = 90
$currentIteration = 0

while ($currentIteration -lt $maxIterations) {
    $currentIteration++
    
    # 1. Run expert review
    claude-code run campaign_expert.md --iteration $currentIteration
    
    # 2. Check score
    $evaluation = Get-Content "expert_review\evaluation_report.json" | ConvertFrom-Json
    $score = $evaluation.overall_score
    
    if ($score -ge $targetScore) {
        Write-Host "✅ Campaign Approved!" -ForegroundColor Green
        break
    }
    
    # 3. Execute improvements
    $commands = Get-ChildItem "expert_review\commands\*.json"
    foreach ($command in $commands) {
        $cmd = Get-Content $command.FullName | ConvertFrom-Json
        claude-code run "$($cmd.to).md" --command $command.FullName
    }
    
    # 4. Recompile and repeat
    claude-code run resource_compiler.md --quick-update
}
```

## Expert Review Dashboard

Monitor the expert review process in real-time:

```powershell
# Run the expert review monitor
.\Monitor-ExpertReview.ps1

# Output example:
╔════════════════════════════════════════════════════════╗
║          CAMPAIGN EXPERT REVIEW DASHBOARD              ║
╚════════════════════════════════════════════════════════╝

📊 Current Status
├─ Iteration: 2 of 5
├─ Score: 84/100 (Target: 90)
└─ Status: improvements_in_progress

📈 Score Breakdown
├─ First Impression         87/100 ✓
├─ Storytelling            82/100 
├─ Trust Building          85/100 ✓
├─ Value Proposition       88/100 ✓
├─ Conversion Optimization 78/100 ⚠
├─ Technical Excellence    92/100 ✓

🔧 Active Improvements
├─ [HIGH] ui-developer: conversion
├─ [MEDIUM] content-strategist: storytelling
├─ [LOW] graphic-designer: visual

Progress to Target:
[████████████████████████████░░░░░░░░░░] 93%
```

## Orchestrator Integration

The Orchestrator has been updated to handle expert review iterations:

```powershell
function Manage-ExpertIteration {
    param(
        [int]$IterationNumber,
        [object]$ImprovementCommands
    )
    
    foreach ($command in $ImprovementCommands) {
        # Route command to specific agent
        $agent = $command.target_agent
        & claude-code run "$agent.md" --command $command --mode "improvement"
        
        # Track execution
        $tracking = @{
            iteration = $IterationNumber
            agent = $agent
            command_id = $command.id
            status = "dispatched"
        }
        $tracking | ConvertTo-Json | Add-Content "workflow\iteration_tracking.jsonl"
    }
    
    # Recompile with improvements
    & claude-code run "resource_compiler.md" --mode "incremental"
}
```

## Success Criteria

The Campaign Expert approves campaigns when:

✅ **Overall Score ≥ 90/100**  
✅ **All critical issues resolved**  
✅ **Conversion elements optimized**  
✅ **Platform compliance verified**  
✅ **Mobile experience flawless**  
✅ **Performance benchmarks met**  
✅ **Expert confidence high**

## Final Deliverable: Expert Certification

```markdown
# Campaign Expert Certification

**Campaign**: [Your Product Name]
**Date**: 2024-03-15
**Expert Score**: 92/100
**Iterations**: 3
**Improvements**: 47

## Certification Statement
This campaign has been thoroughly reviewed and optimized 
by the Campaign Expert system. It meets or exceeds industry 
best practices for crowdfunding campaigns.

## Success Probability
- **Funding Probability**: 87%
- **Exceed Goal Probability**: 64%
- **Viral Potential**: High

**Certified by**: Campaign Expert System v1.5
```

## Usage Instructions

### Running the Complete Workflow with Expert Review

```powershell
# 1. Initialize project
.\Setup-CrowdfundingProject.ps1 -ProjectName "MyProduct"

# 2. Place raw materials in raw/ folder
# - product_description.txt
# - product images
# - team photos

# 3. Run the complete workflow
claude-code run orchestrator.md --config CLAUDE.md --enable-expert-review

# 4. Monitor progress
# In a separate terminal:
.\Monitor-ExpertReview.ps1

# 5. Review final deliverables
# - final_campaigns/kickstarter/index.html (optimized)
# - final_campaigns/indiegogo/index.html (optimized)
# - expert_review/certification.md (approval document)
```

### Running Expert Review Independently

```powershell
# Review existing campaign
claude-code run campaign_expert.md --input "final_campaigns/kickstarter/index.html"

# Review with specific focus
claude-code run campaign_expert.md --focus "conversion" --target-score 95

# Review and auto-fix
claude-code run campaign_expert.md --auto-improve --max-iterations 3
```

## Key Benefits

1. **Professional Expertise**: 10+ years of crowdfunding experience built into the system
2. **Iterative Improvement**: Automatically refines campaigns until they meet expert standards
3. **Visual Testing**: Uses Playwright to verify actual visual appearance
4. **Comprehensive Analysis**: Reviews psychological, strategic, and technical aspects
5. **Authority to Command**: Can direct any agent to implement specific improvements
6. **Success Probability**: Provides data-driven success predictions
7. **Complete Documentation**: Tracks all improvements for learning and optimization

## Troubleshooting

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Expert review taking too long | Reduce max iterations or lower target score |
| Improvements not being implemented | Check agent availability and command format |
| Score not improving between iterations | Review improvement priorities and agent capabilities |
| Playwright tests failing | Ensure HTML files are accessible and valid |

### Debug Commands

```powershell
# Check expert review status
Get-Content "expert_review\iteration_log.json" | ConvertFrom-Json

# View pending commands
Get-ChildItem "expert_review\commands\*.json" | Select-Object Name, LastWriteTime

# Verify improvement implementation
claude-code verify-improvement --id "IMP-001"

# Generate detailed report
claude-code report --agent campaign-expert --format html
```

## Conclusion

The Campaign Expert elevates your crowdfunding campaigns from good to exceptional through:
- **Expert-level review** across all dimensions
- **Automated improvement** implementation
- **Iterative refinement** until excellence achieved
- **Visual verification** of all changes
- **Success probability** assessment

This ensures your campaign not only meets platform requirements but achieves the level of polish and optimization that dramatically increases funding success rates.