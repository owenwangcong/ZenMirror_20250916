# Crowdfunding Campaign System v1.5

## System Requirements
- **OS**: Windows 10/11, PowerShell 5.1+
- **Storage**: 10GB free space
- **Dependencies**: Playwright, nano-banana (MCP), File I/O, JSON/CSV parsing

## Project Structure
```
crowdfunding_campaign/
├── raw/                    # Input (product_description.txt)
├── subagents/             # Agent definitions (12 .md files)
├── outputs/               # Agent outputs
│   └── storyboard_artist/ # Storyboard HTML pages
├── expert_review/         # Expert iterations
├── final_campaigns/       # HTML output
│   ├── kickstarter/
│   └── indiegogo/
├── qa/                    # Test reports
└── workflow/              # Logs
```

## Execution Workflow (18-21 hours)

| Phase | Duration | Agents | Dependencies |
|-------|----------|--------|--------------|
| 0 | 30min | ALL | Read product_description.txt |
| 1 | 2hr | product-manager | raw/product_description.txt |
| 2 | 3hr | content-strategist, financial-planner, marketing-strategist | Phase 1 |
| 3 | 4hr | ui-developer, graphic-designer | Phase 1 |
| 4 | 2hr | video-scriptwriter | ui-developer |
| 4b | 1hr | storyboard-artist | video-scriptwriter, ui-developer |
| 5 | 2hr | resource-compiler | All previous |
| 6 | 1hr | qa-reviewer | Phase 5 |
| 7 | 3-6hr | campaign-expert (iterative) | All, max 5 iterations |

## Core Rules

1. **Product Description = Single Source of Truth**
   - File: `raw/product_description.txt`
   - ALL agents must read completely before starting
   - EVERY detail must be implemented (100% compliance required)

2. **Output Requirements**
   - Persist all outputs to files (no in-memory only)
   - Use JSON for data exchange
   - UTF-8 encoding for all text

3. **Quality Gates**
   - Product description compliance: 100%
   - Technical validation: No errors
   - Performance: <3s load, >90 Lighthouse
   - Expert approval: ≥90/100 score

## Configuration
```json
{
  "execution_mode": "full_workflow",
  "parallel_execution": true,
  "quality_threshold": 90,
  "expert_target_score": 90,
  "expert_max_iterations": 5,
  "auto_fix": true
}
```

## Subagents (12 total)
1. **product-manager**: Market analysis, strategy
2. **content-strategist**: Copy, messaging  
3. **financial-planner**: Budget, pricing
4. **marketing-strategist**: Launch strategy
5. **ui-developer**: Mockups, prototypes
6. **graphic-designer**: Visual assets
7. **video-scriptwriter**: Scripts, shot lists
8. **storyboard-artist**: Visual storyboards
9. **resource-compiler**: Final assembly
10. **orchestrator**: Workflow coordination
11. **qa-reviewer**: Testing, validation
12. **campaign-expert**: Iterative optimization

## Platform Requirements

**Kickstarter**: Single-page, video-focused, rewards sidebar
**Indiegogo**: Multi-section, gallery emphasis, flexible funding

## Final Deliverables
- [ ] Kickstarter HTML page (optimized)
- [ ] Indiegogo HTML page (optimized)
- [ ] Shot list (75+ shots)
- [ ] B-roll list (100+ clips)
- [ ] Visual storyboards (HTML format)
- [ ] Production schedule
- [ ] Social media assets
- [ ] Expert certification (≥90/100)

## Quick Commands
```powershell
# Initialize
claude-code init crowdfunding_campaign

# Run workflow
claude-code run orchestrator.md --config CLAUDE.md

# Check specific agent
claude-code run [agent].md --input raw/

# Monitor progress
Get-Content "workflow/execution_log.json" -Wait
```

## Critical Reminders
- Product description is SACRED - implement everything
- Phase 0 mandatory - all agents read description first
- No generic templates - customize to description
- Expert review iterates until ≥90 score
- Validate outputs against description continuously

---
*Version: 1.5 | Last Updated: 2024*