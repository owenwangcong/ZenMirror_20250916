# Nano-Banana MCP Integration Guide

## Overview
The **nano-banana** MCP (Model Context Protocol) tool replaces svgmaker for all graphic and UI creation tasks in the crowdfunding campaign system.

## Updated Subagents

### 1. UI Developer (`ui_developer.md`)
**Tools**: `nano-banana` (instead of svgmaker)
**Usage**: Creating SVG interface elements, icons, and visual components for mockups

### 2. Graphic Designer (`graphic_designer.md`)
**Tools**: `nano-banana` (instead of svgmaker)
**Usage**: Designing logos, infographics, reward tier graphics, and campaign visuals

## Nano-Banana Usage Examples

### Logo Creation
```javascript
// Using nano-banana to create campaign logo
const campaignLogo = nanoBanana.create({
  type: 'logo',
  width: 300,
  height: 100,
  style: 'modern',
  elements: [
    {
      type: 'text',
      content: 'ProductName',
      font: 'Arial',
      weight: 'bold',
      color: '#2E3440'
    },
    {
      type: 'shape',
      form: 'circle',
      fill: '#88C0D0',
      position: { x: 250, y: 50 }
    }
  ]
});
```

### Infographic Generation
```javascript
// Using nano-banana for data visualization
const fundingChart = nanoBanana.create({
  type: 'infographic',
  width: 600,
  height: 400,
  data: {
    goal: 50000,
    raised: 35000,
    backers: 500,
    days_left: 15
  },
  style: 'crowdfunding_thermometer'
});
```

### UI Component Creation
```javascript
// Using nano-banana for UI elements
const ctaButton = nanoBanana.create({
  type: 'ui_element',
  component: 'button',
  text: 'Back This Project',
  style: {
    backgroundColor: '#5E81AC',
    color: '#ECEFF4',
    borderRadius: 8,
    padding: '12px 24px'
  },
  hover_effect: true
});
```

### Reward Tier Graphics
```javascript
// Using nano-banana for reward tier visualization
const rewardTier = nanoBanana.create({
  type: 'reward_card',
  tier: 'early_bird',
  price: 99,
  savings: '40%',
  visual_style: 'premium',
  includes_icons: ['product', 'shipping', 'bonus'],
  limited_quantity: 500
});
```

## Integration Points

### UI Developer Workflow
1. Use nano-banana to create UI component SVGs
2. Export as optimized SVG or PNG
3. Embed in HTML mockups
4. Test rendering with Playwright

### Graphic Designer Workflow
1. Use nano-banana for all vector graphics
2. Create consistent visual system
3. Export in multiple formats (SVG, PNG, WebP)
4. Ensure proper optimization

## Advantages of Nano-Banana MCP

1. **MCP Protocol**: Better integration with Claude
2. **Optimized Output**: Automatically optimized SVGs
3. **Consistency**: Maintains design system across all graphics
4. **Performance**: Faster generation and smaller file sizes
5. **Flexibility**: More customization options

## Configuration

Ensure nano-banana MCP is enabled in your Claude environment:

```json
{
  "mcp_tools": {
    "nano-banana": {
      "enabled": true,
      "version": "latest",
      "output_format": "png",
      "optimization": true
    }
  }
}
```

## Migration from SVGMaker

If you have existing svgmaker code:

**Before (svgmaker):**
```javascript
const graphic = svgmaker.create({...});
```

**After (nano-banana):**
```javascript
const graphic = nanoBanana.create({...});
```

The API is similar, making migration straightforward.

## Error Handling

```javascript
try {
  const graphic = nanoBanana.create({
    // graphic specifications
  });
  // Save or embed graphic
} catch (error) {
  console.error('Nano-banana creation failed:', error);
  // Fall back to placeholder or default graphic
}
```

## Output Files

Nano-banana generates files in:
- `outputs/ui_developer/graphics/` - UI components
- `outputs/graphic_designer/graphics/` - Campaign visuals
- `final_campaigns/assets/images/` - Production assets

## Best Practices

1. **Always specify dimensions** for consistent output
2. **Use style presets** for brand consistency
3. **Export multiple formats** for compatibility
4. **Optimize for web** to maintain performance
5. **Test rendering** across browsers with Playwright

This integration ensures all visual assets in your crowdfunding campaign are created efficiently using the nano-banana MCP tool.