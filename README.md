# MakeupStudio

![App Preview](https://imgix.cosmicjs.com/27849e70-7c86-11f0-8dcc-651091f6a7c0-photo-1487412947147-5cebf100ffc2-1755557607710.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A privacy-first web application for practicing makeup techniques on your own photos using realistic digital brushes, AI-powered face detection, and professional blend modes. Practice looks, learn techniques, and export your results—all while keeping your photos secure on your device.

## ✨ Features

- **Smart Photo Import**: Upload photos or capture with webcam with automatic face landmark detection
- **Professional Brush Engine**: Realistic makeup brushes with pressure, hardness, opacity, and blend mode controls
- **Region-Aware Masking**: AI-generated masks that constrain strokes to facial regions (lips, eyes, cheeks, etc.)
- **Interactive Lessons**: Step-by-step tutorials with live overlays teaching makeup techniques
- **Look Presets**: Pre-configured makeup looks that can be applied and customized
- **Layer System**: Professional layer management with visibility, opacity, and blend mode controls
- **Export Options**: High-quality PNG/JPG export with before/after comparison and optional timelapse
- **Symmetry Mode**: Mirror brush strokes across the face for even application
- **Color Sampling**: Eyedropper tool to sample natural skin tones and colors from photos
- **PWA Support**: Install as a native app with offline functionality

## Clone this Bucket and Code Repository

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Bucket and Code Repository](https://img.shields.io/badge/Clone%20this%20Bucket-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=68a3abba93b14acea3074f1f&clone_repository=68a3b51593b14acea3074f47)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Here's clean, production-ready UI copy for MakeupStudio, organized by screen. It's concise, inclusive, and neutral so it can drop straight into your build."

### Code Generation Prompt

> Build the complete MakeupStudio application as described in the content model context, implementing all the core features including the makeup editor, lessons system, presets gallery, and export functionality.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠 Technologies Used

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS
- **Graphics**: Canvas2D with WebGL blend modes for realistic makeup rendering
- **AI/ML**: MediaPipe FaceMesh for 468-point facial landmark detection
- **State Management**: Zustand for application state
- **Storage**: IndexedDB for local project storage, localStorage for preferences
- **CMS**: Cosmic for content management (lessons, presets, color palettes)
- **Performance**: Web Workers for face detection and image processing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket

### Installation

1. Clone this repository
```bash
git clone <repository-url>
cd makeup-studio
```

2. Install dependencies
```bash
bun install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Add your Cosmic credentials:
```
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Cosmic SDK Examples

### Fetching Look Presets
```typescript
import { cosmic } from '@/lib/cosmic'

export async function getLookPresets() {
  try {
    const response = await cosmic.objects
      .find({ type: 'look-presets' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    throw error
  }
}
```

### Fetching Lessons with Steps
```typescript
export async function getLessons() {
  try {
    const response = await cosmic.objects
      .find({ type: 'lessons' })
      .props(['id', 'title', 'slug', 'metadata'])
      .sort('metadata.difficulty')
      
    return response.objects
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    throw error
  }
}
```

### Getting Color Palettes by Category
```typescript
export async function getColorPalettes(category?: string) {
  try {
    const query: any = { type: 'color-palettes' }
    if (category) {
      query['metadata.category'] = category
    }
    
    const response = await cosmic.objects
      .find(query)
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    throw error
  }
}
```

## 🎯 Cosmic CMS Integration

This application integrates with several Cosmic content types:

- **Look Presets**: Pre-configured makeup looks with layer settings and color information
- **Lessons**: Step-by-step makeup tutorials with interactive instructions
- **Color Palettes**: Curated color collections organized by category (neutral, warm, cool, editorial)
- **Tips & Guides**: Educational content and troubleshooting help
- **Gallery Showcases**: Before/after transformations and technique examples
- **User Projects**: Saved user projects with metadata and settings

The app uses Cosmic's depth parameter to fetch related content efficiently and implements proper error handling for empty results.

## 🚀 Deployment Options

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Netlify
1. Connect your repository to Netlify
2. Add environment variables in Netlify dashboard
3. Set build command: `bun build`
4. Set publish directory: `.next`

### Environment Variables
Set these in your deployment platform:
- `COSMIC_BUCKET_SLUG`
- `COSMIC_READ_KEY`
- `COSMIC_WRITE_KEY`

## 🎨 Customization

The application is built with a modular architecture that makes customization straightforward:

- **Brush Presets**: Modify default brush settings in `lib/brushPresets.ts`
- **Color Palettes**: Customize default color schemes in `lib/colorPalettes.ts`
- **Face Regions**: Adjust masking regions in `lib/faceLandmarks.ts`
- **Blend Modes**: Add custom blend modes in `lib/blendModes.ts`

## 🔒 Privacy & Security

- **Local Processing**: All image processing happens in the browser
- **No Server Storage**: Photos never leave your device unless you create a share link
- **Optional Sharing**: Share links are encrypted and expire after 7 days
- **GDPR Compliant**: No tracking or data collection without consent

## 📱 PWA Features

- **Offline Support**: Works without internet connection after initial load
- **App Installation**: Install as native app on desktop and mobile
- **Background Processing**: Face detection runs in Web Workers for smooth performance
- **Local Storage**: Projects saved locally using IndexedDB

## 🎓 Educational Features

The application includes comprehensive educational content:

- **Interactive Lessons**: Step-by-step tutorials with live overlays
- **Technique Guides**: Written guides for different makeup techniques
- **Color Theory**: Tips on color selection and harmony
- **Tool Usage**: Detailed explanations of brush and tool functionality

## 🔧 Advanced Features

- **Face Landmark Detection**: 468-point facial mesh for precise masking
- **Professional Blend Modes**: Multiply, overlay, soft light, color, and more
- **Brush Dynamics**: Pressure-sensitive brushes with adjustable hardness
- **Layer System**: Non-destructive editing with full layer control
- **Export Options**: PNG, JPG, timelapse video, and look recipe generation

<!-- README_END -->