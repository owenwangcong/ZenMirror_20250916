# Storyboard Artist Integration Guide

## Overview
The **Storyboard Artist** is a new subagent that transforms video scripts into visual storyboards using nano-banana MCP to generate images and compile them into interactive HTML pages.

## What It Does

1. **Reads Scripts** from video-scriptwriter
2. **Generates Visual Frames** using nano-banana
3. **Creates HTML Storyboards** for each video
4. **Provides Production References** for filming

## Sample Storyboard HTML Output

When the storyboard artist completes, you'll get beautiful HTML pages like this:

```html
<!DOCTYPE html>
<html>
<head>
    <title>🎬 Main Campaign Video Storyboard</title>
</head>
<body>
    <!-- Header Section -->
    <div class="storyboard-header">
        <h1>Main Campaign Video - Complete Storyboard</h1>
        <p>Duration: 2:45 | Shots: 45 | Created: 2024-03-15</p>
    </div>

    <!-- Scene 1: Opening Hook -->
    <div class="scene-divider">━━━ SCENE 1: OPENING HOOK (0:00-0:05) ━━━</div>
    
    <div class="storyboard-grid">
        <!-- Frame 1.1 -->
        <div class="frame-card">
            <img src="assets/frame_1_1.svg" class="frame-image">
            <div class="frame-details">
                <span class="shot-number">Shot 1.1</span>
                <span class="timing">0:00-0:02</span>
                <p class="description">
                    <strong>WIDE SHOT:</strong> Product elegantly placed on minimal desk
                </p>
                <div class="technical-notes">
                    Camera: Static, eye level
                    Lighting: Soft morning light from left
                    Audio: Subtle ambient music begins
                </div>
            </div>
        </div>
        
        <!-- Frame 1.2 -->
        <div class="frame-card">
            <img src="assets/frame_1_2.svg" class="frame-image">
            <div class="frame-details">
                <span class="shot-number">Shot 1.2</span>
                <span class="timing">0:02-0:05</span>
                <p class="description">
                    <strong>CLOSE-UP:</strong> Hand reaches for product
                </p>
                <div class="technical-notes">
                    Camera: Slow dolly in
                    Focus: Rack from hand to product
                    Audio: Voiceover begins "What if..."
                </div>
            </div>
        </div>
    </div>

    <div class="transition-note">→ CUT TO:</div>

    <!-- Scene 2: Problem Statement -->
    <div class="scene-divider">━━━ SCENE 2: PROBLEM STATEMENT (0:05-0:15) ━━━</div>
    <!-- More frames... -->
</body>
</html>
```

## Nano-Banana Frame Examples

### Example 1: Product Hero Shot
```javascript
const heroShot = nanoBanana.create({
  type: 'storyboard_frame',
  dimensions: { width: 1920, height: 1080 },
  composition: {
    rule_of_thirds: true,
    focal_point: 'center-right'
  },
  elements: [
    {
      type: 'product',
      position: { x: 1200, y: 540 },
      scale: 1.5,
      lighting: 'dramatic_rim_light',
      shadow: 'soft_drop_shadow'
    },
    {
      type: 'background',
      gradient: ['#2E3440', '#434C5E'],
      blur: 'none'
    },
    {
      type: 'text_overlay',
      content: 'SHOT 1.1',
      position: 'top_left',
      style: 'production_marker'
    }
  ]
});
```

### Example 2: Testimonial Frame
```javascript
const testimonialFrame = nanoBanana.create({
  type: 'storyboard_frame',
  shot_type: 'medium_close_up',
  elements: [
    {
      type: 'character',
      appearance: 'professional_woman_30s',
      expression: 'enthusiastic',
      position: 'left_third',
      eyeline: 'off_camera_right'
    },
    {
      type: 'environment',
      setting: 'modern_home_office',
      depth_of_field: 'shallow',
      lighting: 'natural_window'
    },
    {
      type: 'lower_third_placeholder',
      text: 'Sarah Chen, Early Adopter'
    }
  ]
});
```

### Example 3: UI Demo Frame
```javascript
const uiDemoFrame = nanoBanana.create({
  type: 'storyboard_frame',
  style: 'screen_capture',
  elements: [
    {
      type: 'device_frame',
      device: 'iphone_14_pro',
      orientation: 'portrait'
    },
    {
      type: 'screen_content',
      source: 'ui_developer/dashboard.html',
      state: 'interactive_demo'
    },
    {
      type: 'hand_gesture',
      action: 'tap',
      position: { x: 960, y: 600 }
    },
    {
      type: 'callout',
      text: 'One-tap sync',
      arrow_to: { x: 960, y: 600 }
    }
  ]
});
```

## Workflow Integration

### Input Dependencies
The storyboard artist needs:
1. **Scripts** from `video_scriptwriter/scripts/`
   - product_demo.md
   - founder_story.md
   - testimonials.md
2. **UI Mockups** from `ui_developer/mockups/`
3. **Brand Guidelines** from `graphic_designer/design_system.json`

### Output Structure
```
outputs/storyboard_artist/
├── storyboards/
│   ├── main_video_storyboard.html
│   ├── product_demo_storyboard.html
│   ├── founder_story_storyboard.html
│   ├── testimonials_storyboard.html
│   └── social_media_storyboard.html
├── assets/
│   ├── frame_1_1.svg
│   ├── frame_1_2.svg
│   └── ... (all nano-banana generated frames)
├── shot_reference.json
└── print_version.pdf
```

## Usage Benefits

### For Video Production Team
- **Visual Reference**: See exactly what each shot should look like
- **Technical Specs**: Camera angles, movements, and transitions documented
- **Timing Guide**: Precise duration for each shot
- **Print Version**: Take to set for reference

### For Campaign Review
- **Visual Script**: Stakeholders can see the video before filming
- **Feedback Tool**: Make changes before expensive production
- **Alignment Check**: Ensure vision matches execution
- **Quality Control**: Verify all features are showcased

## How Frames Are Generated

### Step 1: Parse Script
```javascript
// Extract from video script
const scene = {
  description: "Product on desk with morning light",
  shot_type: "wide establishing",
  duration: "2 seconds",
  voiceover: "What if managing your tasks was effortless?"
};
```

### Step 2: Generate Visual
```javascript
// Create with nano-banana
const frame = nanoBanana.create({
  type: 'storyboard_frame',
  style: interpretSceneStyle(scene),
  composition: determineShotComposition(scene.shot_type),
  elements: extractVisualElements(scene.description)
});
```

### Step 3: Add to HTML
```javascript
// Insert into storyboard page
const frameHTML = `
  <div class="frame-card">
    <img src="${frame.path}">
    <div class="details">
      ${scene.description}
    </div>
  </div>
`;
```

## Quality Standards

Each storyboard must:
- ✅ Visualize EVERY shot from the script
- ✅ Maintain visual consistency with brand
- ✅ Include technical production notes
- ✅ Show clear scene transitions
- ✅ Indicate camera movements
- ✅ Note audio/voiceover timing
- ✅ Be printable for on-set use
- ✅ Work on mobile for remote review

## Commands to Run

### Generate Storyboards Only
```
claude-code run storyboard_artist.md --input video_scriptwriter/scripts/
```

### Regenerate Specific Video Storyboard
```
claude-code run storyboard_artist.md --video "product_demo" --style "technical"
```

### Export Print Version
```
claude-code run storyboard_artist.md --export pdf --output production/storyboards.pdf
```

## Viewing the Output

Open the HTML files directly in your browser:
1. Navigate to `outputs/storyboard_artist/storyboards/`
2. Open `main_video_storyboard.html`
3. Review frame by frame
4. Print if needed (optimized for printing)

## Customization Options

The storyboard artist can adjust:
- **Visual Style**: Sketch, detailed, technical
- **Frame Density**: Every shot vs. key frames only
- **Annotations**: Basic to comprehensive
- **Output Format**: HTML, PDF, or image sequence

## Example Complete Storyboard Stats

For a typical crowdfunding campaign:
- **Main Video**: 45 frames across 8 scenes
- **Product Demo**: 25 frames showing all features
- **Founder Story**: 20 frames for interview
- **Testimonials**: 15 frames for 3 speakers
- **Social Media**: 10 frames for short versions

Total: **115 unique storyboard frames** generated with nano-banana

## Success Metrics

The storyboard is successful when:
- Video team says "We know exactly what to shoot"
- No surprises during production
- All script elements have visual representation
- Stakeholders approve before filming
- Production runs smoothly with visual reference

This integration ensures your video production has a complete visual roadmap, saving time and money while ensuring the final video perfectly matches the scripted vision!