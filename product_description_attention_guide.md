# Product Description as Single Source of Truth - Implementation Guide

## Core Principle
The product description document (`raw/product_description.txt`) contains **all ideas, insights, requirements, and vision** for the campaign. Every subagent must **carefully read, understand, and implement** everything mentioned in this document, whether explicitly stated or implied.

## Updated Subagent Instructions

### For ALL Subagents - Universal Protocol

Add this instruction block to the beginning of each subagent's workflow:

```markdown
## CRITICAL: Product Description Compliance

When invoked, your FIRST action must be:
1. **READ COMPLETELY**: Read the entire product description document (`raw/product_description.txt`) from start to finish
2. **EXTRACT EVERYTHING**: Note ALL of the following:
   - Product features mentioned (even in passing)
   - Benefits claimed (explicit and implied)
   - Target audience descriptions
   - Pain points identified
   - Use cases described
   - Competitor comparisons made
   - Pricing hints or requirements
   - Timeline mentions
   - Quality standards implied
   - Brand personality hints
   - Success metrics mentioned
   - Customer quotes or testimonials
   - Technical specifications
   - Design preferences hinted at
   - Marketing angles suggested
   - Unique selling propositions
   - Risk factors mentioned
   - Compliance needs
   - Platform preferences
   - Any other ideas, insights, or requirements

3. **IMPLEMENT FAITHFULLY**: Ensure your output reflects and respects EVERYTHING from the product description
4. **VALIDATE ALIGNMENT**: Before finalizing, re-read the product description to verify nothing was missed
5. **DOCUMENT COMPLIANCE**: List which requirements from the product description you've addressed

Remember: If something is mentioned in the product description, it's important and must be reflected in your work.
```

## Specific Subagent Attention Points

### Product Manager
```markdown
When reading the product description, pay special attention to:
- ANY mention of competitors or market positioning
- ALL product features, even those mentioned casually
- Every benefit or outcome promised
- Any pricing information or value propositions
- Market insights or customer feedback mentioned
- Timeline or milestone references
- Quality or performance standards implied
- Business goals stated or implied

Your analysis must incorporate EVERY insight from the product description, not just the obvious ones.
```

### UI Developer
```markdown
When reading the product description, pay special attention to:
- Any mention of user experience or interface
- Features that need visual representation
- User workflows described or implied
- Accessibility mentions
- Device or platform requirements
- Performance expectations
- Visual style hints (modern, classic, minimal, etc.)
- Competitor UI references
- User pain points that the UI should solve

Every screen you create must support the vision in the product description.
```

### Content Strategist
```markdown
When reading the product description, pay special attention to:
- The exact language and terminology used
- Tone and voice implied by the writing style
- Key messages and value propositions
- Customer quotes or testimonials mentioned
- Pain points described
- Benefits emphasized
- Proof points or evidence cited
- Emotional triggers used
- Storytelling elements present
- Call-to-action phrases suggested

Your copy must use the language and ideas from the product description as the foundation.
```

### Video Scriptwriter
```markdown
When reading the product description, pay special attention to:
- Stories or scenarios described
- Problems and solutions mentioned
- Customer experiences shared
- Emotional journey implied
- Key moments or features to highlight
- Demonstrations suggested
- Testimonial opportunities mentioned
- Visual metaphors or analogies used
- Before/after scenarios described
- The "why" behind the product

Your script and shot list must bring to life EVERY compelling element from the product description.
```

### Graphic Designer
```markdown
When reading the product description, pay special attention to:
- Brand personality traits mentioned
- Visual metaphors or imagery described
- Quality level implied (premium, accessible, innovative)
- Competitor positioning hints
- Target audience lifestyle descriptions
- Color or style preferences hinted at
- Product attributes to visualize
- Emotional tone to convey
- Professional level expected

Your visuals must reflect the brand essence captured in the product description.
```

### Marketing Strategist
```markdown
When reading the product description, pay special attention to:
- Target audience segments identified
- Marketing channels mentioned or implied
- Competitive advantages highlighted
- Growth strategies suggested
- Partnership opportunities mentioned
- Community building ideas
- Launch timing considerations
- PR angles available
- Influencer types relevant
- Success metrics defined

Your strategy must leverage EVERY marketing opportunity identified in the product description.
```

### Financial Planner
```markdown
When reading the product description, pay special attention to:
- Pricing information or constraints
- Cost structures mentioned
- Value propositions stated
- Market size implications
- Unit economics hinted at
- Funding goals suggested
- Manufacturing details mentioned
- Shipping or fulfillment notes
- Timeline and cash flow implications
- Risk factors identified

Your financial model must align with ALL economic realities in the product description.
```

### Campaign Expert
```markdown
When reading the product description, pay special attention to:
- The overall vision and goals
- Success criteria mentioned
- Quality standards expected
- Competitive positioning desired
- Customer experience priorities
- Risk factors to mitigate
- Compliance requirements
- Platform-specific mentions
- Long-term objectives beyond funding
- Brand promise to uphold

Your review must ensure the campaign fulfills EVERY aspect of the vision in the product description.
```

## Validation Checklist for Each Agent

After completing their work, each agent should complete this checklist:

```markdown
## Product Description Compliance Checklist

### Ideas Implemented
- [ ] List each idea from the product description
- [ ] Confirm it's reflected in your output
- [ ] Note where/how it's implemented

### Insights Applied
- [ ] List each insight from the product description
- [ ] Confirm it influenced your decisions
- [ ] Explain how it shaped your output

### Requirements Met
- [ ] List each requirement (explicit or implied)
- [ ] Confirm it's been satisfied
- [ ] Provide evidence of compliance

### Nothing Missed
- [ ] Re-read the product description
- [ ] Confirm no detail was overlooked
- [ ] List any edge cases addressed

### Alignment Score
Rate your output's alignment with the product description: ___/100
If below 95, iterate until improved.
```

## Examples of Catching Subtle Requirements

### Example 1: Implied Quality Standard
**Product Description Says**: "We're creating the Tesla of kitchen gadgets"
**Agents Should Understand**: 
- Premium positioning required
- Innovative technology focus
- Minimalist, modern design
- High price point justified by quality
- Environmental consciousness important
- Direct-to-consumer model preferred
- Tech-savvy early adopters as target

### Example 2: Casual Mention of Feature
**Product Description Says**: "Oh, and it also works with Alexa"
**Agents Should Understand**:
- Smart home integration is a feature
- Voice control should be highlighted
- Tech compatibility is a selling point
- May appeal to existing Alexa users
- Should be demonstrated in video
- Needs to be in technical specifications

### Example 3: Emotional Undertone
**Product Description Says**: "Tired of products that break after a month?"
**Agents Should Understand**:
- Durability is a key differentiator
- Customer frustration with competitors
- Warranty/guarantee important
- Quality testing should be shown
- Long-term value messaging needed
- Build quality visuals required

## Integration with Workflow

### Phase 0: Document Study (NEW - 30 minutes)
Before ANY agent begins work:
1. All agents read the complete product description
2. Each agent creates notes on relevant sections
3. Orchestrator confirms all agents understand the vision

### During Execution
Each agent should:
1. Keep product description open for reference
2. Check alignment after each major decision
3. Quote directly from product description when relevant
4. Flag any conflicts for resolution

### Review Points
- Resource Compiler: Ensures final campaign reflects everything from product description
- QA Reviewer: Validates all requirements are met
- Campaign Expert: Confirms vision is fully realized

## Common Pitfalls to Avoid

1. **Selective Reading**: Don't just look for your specific section - read EVERYTHING
2. **Assumption Making**: Don't assume something is unimportant if it's mentioned
3. **Generic Solutions**: Don't use templates that ignore unique aspects in the description
4. **Missing Subtleties**: Pay attention to adjectives, emotions, and implications
5. **Forgetting Context**: Remember how different parts of the description connect

## Success Metrics

A campaign successfully implements the product description when:
- ✅ Every feature mentioned is showcased
- ✅ Every benefit claimed is communicated
- ✅ Every requirement stated is met
- ✅ The tone matches the description's voice
- ✅ The visuals align with implied brand personality
- ✅ The strategy leverages all mentioned opportunities
- ✅ No reviewer can find missing elements
- ✅ The creator recognizes their complete vision

## Conclusion

The product description is not just a brief - it's the **complete blueprint** for the campaign. Every word matters. Every idea counts. Every requirement must be met. When all agents treat the product description with this level of attention and respect, the resulting campaign will perfectly reflect the creator's vision and maximize the probability of funding success.