# ZenMirror Asset Directory Structure

## Organized Asset Hierarchy

The following directory structure will house all nano-banana generated graphics for the ZenMirror campaign:

```
final_campaigns/
├── indiegogo/
│   └── assets/
│       ├── zenmirror-logo.svg                    # Main logo with Chinese characters
│       ├── zenmirror-main.jpg                    # Hero product shot
│       ├── og-image.jpg                          # Social media preview
│       ├── video-thumbnail.jpg                   # Main video preview
│       ├── traditional-wearables.jpg             # Comparison: old way
│       ├── zenmirror-setup.jpg                   # Comparison: new way
│       ├── tech-diagram.svg                      # Technology overview
│       ├── closed-loop-diagram.svg               # Learning system
│       │
│       ├── gallery/                              # Product and app images
│       │   ├── setup-view.svg                    # Setup visualization
│       │   ├── app-interface.jpg                 # App overview
│       │   ├── mentor-selection.jpg              # Mentor interface
│       │   ├── data-visualization.jpg            # Analytics view
│       │   ├── product-front.jpg                 # Product front view
│       │   ├── product-side.jpg                  # Product side view
│       │   ├── product-detail.jpg                # Product detail shot
│       │   ├── product-packaging.jpg             # Packaging design
│       │   ├── app-dashboard.jpg                 # Main dashboard
│       │   ├── mentor-interface.jpg              # Mentor selection
│       │   ├── analytics-view.jpg                # Data analytics
│       │   ├── achievements-view.jpg             # Achievement system
│       │   ├── home-meditation.jpg               # Home use scenario
│       │   ├── studio-use.jpg                    # Studio scenario
│       │   ├── office-meditation.jpg             # Office scenario
│       │   └── travel-setup.jpg                  # Travel scenario
│       │
│       ├── mentors/                              # Mentor personalities
│       │   ├── zen-master-detailed.jpg           # Zen master portrait
│       │   ├── yogi-master.jpg                   # Yogi portrait
│       │   ├── chaplain.jpg                      # Chaplain portrait
│       │   ├── spiritual-guide.jpg               # Spiritual mentor
│       │   ├── stoic-philosopher.jpg             # Stoic philosopher
│       │   ├── vedanta-acharya.jpg               # Vedanta teacher
│       │   ├── zen-master.jpg                    # Zen (grid version)
│       │   ├── yogi.jpg                          # Yogi (grid version)
│       │   ├── spiritual-mentor.jpg              # Spiritual (grid)
│       │   ├── stoic.jpg                         # Stoic (grid version)
│       │   └── vedanta.jpg                       # Vedanta (grid)
│       │
│       ├── tech/                                 # Technology diagrams
│       │   └── radar-visualization.jpg           # Radar tech explanation
│       │
│       ├── story/                                # Narrative graphics
│       │   ├── traditional-problems.jpg          # Problem illustration
│       │   ├── zenmirror-solution.jpg            # Solution illustration
│       │   └── cultural-mentors.jpg              # Cultural wisdom
│       │
│       ├── videos/                               # Video thumbnails
│       │   ├── hero-demo-thumb.jpg               # Main demo thumbnail
│       │   ├── tech-demo-thumb.jpg               # Tech demo thumbnail
│       │   ├── mentor-demo-thumb.jpg             # Mentor demo thumbnail
│       │   ├── setup-guide-thumb.jpg             # Setup guide thumbnail
│       │   ├── user-stories-thumb.jpg            # User stories thumbnail
│       │   └── comparison-thumb.jpg              # Comparison thumbnail
│       │
│       ├── icons/                                # SVG icon library
│       │   ├── hrv-research.svg                  # HRV research icon
│       │   ├── meditation-research.svg           # Meditation research icon
│       │   ├── rsa-research.svg                  # RSA research icon
│       │   ├── radar-waves.svg                   # Radar waves icon
│       │   ├── heart-monitoring.svg              # Heart monitoring icon
│       │   ├── privacy-shield.svg                # Privacy shield icon
│       │   ├── real-time.svg                     # Real-time icon
│       │   ├── scoring.svg                       # Scoring system icon
│       │   ├── achievements.svg                  # Achievements icon
│       │   ├── multi-mode.svg                    # Multi-mode icon
│       │   ├── closed-loop.svg                   # Closed-loop icon
│       │   ├── analytics.svg                     # Analytics icon
│       │   ├── zen-circle.svg                    # Zen tradition icon
│       │   ├── lotus.svg                         # Yoga tradition icon
│       │   ├── dove.svg                          # Christian tradition icon
│       │   ├── tree-of-life.svg                  # Universal tradition icon
│       │   ├── column.svg                        # Stoic tradition icon
│       │   └── om-symbol.svg                     # Vedanta tradition icon
│       │
│       └── updates/                              # Campaign updates
│           └── manufacturing-facility.jpg        # Manufacturing facility
│
└── kickstarter/                                  # Mirror structure for Kickstarter
    └── assets/                                   # (Same structure as above)
        └── [identical file organization]
```

## File Naming Conventions

### Image Files
- Product shots: `product-[view].jpg` (front, side, detail, packaging)
- Mentor images: `[tradition]-[type].jpg` (zen-master-detailed.jpg)
- App screenshots: `app-[feature].jpg` (dashboard, interface, analytics)
- Usage scenarios: `[location]-[usage].jpg` (home-meditation.jpg)
- Technology: `[tech-type]-[description].jpg` (radar-visualization.jpg)

### Icon Files
- All icons: `[function-name].svg` (heart-monitoring.svg)
- Tradition symbols: `[tradition-symbol].svg` (zen-circle.svg)
- Technology icons: `[tech-feature].svg` (radar-waves.svg)

## Quality Standards

### Resolution Requirements
- Hero images: 1920x1080 minimum
- Product shots: 1200x800 minimum
- App screenshots: 375x812 (mobile) or 1024x768 (tablet)
- Mentor portraits: 800x800 square
- Icons: 128x128 minimum, scalable SVG preferred
- Video thumbnails: 640x360 (16:9 aspect ratio)

### File Size Limits
- JPG images: < 500KB for web optimization
- SVG files: < 100KB for fast loading
- PNG files: < 300KB (when transparency needed)

### Color Consistency
- Primary: Deep blue (#1a365d), Zen orange (#ff6b35)
- Secondary: Warm gray (#4a5568), Light gray (#e2e8f0)
- Background: White (#ffffff), Off-white (#f7fafc)

## Brand Guidelines Compliance

### Visual Style
- Minimalist, zen-inspired aesthetic
- Professional product photography
- Cultural sensitivity in mentor representations
- Technical accuracy in diagrams
- Peaceful, contemplative mood

### Typography Integration
- Primary: Inter (clean, modern)
- Secondary: Noto Serif (traditional, readable)
- Consistent hierarchy and spacing

### Accessibility Requirements
- High contrast ratios (4.5:1 minimum)
- Alternative text for all images
- Scalable for different screen sizes
- Color-blind friendly palette

This structure ensures organized, consistent, and easily maintainable graphics across both crowdfunding platforms while supporting the overall ZenMirror brand experience.