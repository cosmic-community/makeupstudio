// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Look Presets
export interface LookPreset extends CosmicObject {
  type: 'look-presets';
  metadata: {
    name: string;
    description: string;
    category?: {
      key: string;
      value: string;
    };
    layers: LayerConfig[];
    color_palette?: ColorPalette;
    preview_image?: {
      url: string;
      imgix_url: string;
    };
    complexity?: {
      key: string;
      value: string;
    };
    popular?: boolean;
  };
}

// Color Palettes
export interface ColorPalette extends CosmicObject {
  type: 'color-palettes';
  metadata: {
    name: string;
    swatches: string[];
    category?: {
      key: string;
      value: string;
    };
    notes?: string;
    occasion?: string;
  };
}

// Lessons
export interface Lesson extends CosmicObject {
  type: 'lessons';
  metadata: {
    title: string;
    description: string;
    skill?: {
      key: string;
      value: string;
    };
    difficulty?: {
      key: string;
      value: string;
    };
    duration_minutes?: number;
    steps: LessonStep[];
    preview_image?: {
      url: string;
      imgix_url: string;
    };
    featured?: boolean;
  };
}

// Tips & Guides
export interface TipGuide extends CosmicObject {
  type: 'tips-guides';
  metadata: {
    title: string;
    category?: {
      key: string;
      value: string;
    };
    content: string;
    is_quick_tip?: boolean;
    difficulty?: {
      key: string;
      value: string;
    };
    related_skills?: string[];
    illustration?: {
      url: string;
      imgix_url: string;
    };
  };
}

// Gallery Showcases
export interface GalleryShowcase extends CosmicObject {
  type: 'gallery-showcases';
  metadata: {
    title: string;
    description: string;
    showcase_type?: {
      key: string;
      value: string;
    };
    featured_images?: {
      url: string;
      imgix_url: string;
    }[];
    techniques?: string[];
    inspiration?: string;
    homepage_featured?: boolean;
  };
}

// User Projects
export interface UserProject extends CosmicObject {
  type: 'user-projects';
  metadata: {
    title: string;
    created_at: string;
    photo_source?: {
      key: string;
      value: string;
    };
    canvas_resolution?: {
      key: string;
      value: string;
    };
    look_preset?: LookPreset;
    symmetry_enabled?: boolean;
    notes?: string;
    export_settings?: Record<string, any>;
    has_share_link?: boolean;
  };
}

// Application Types
export interface LayerConfig {
  type: LayerType;
  region: FaceRegion;
  opacity: number;
  blendMode: BlendMode;
  color: string;
  hardness: number;
  sizePx: number;
  ordering: number;
}

export interface LessonStep {
  overlayRegion: string;
  instruction: string;
  recommendedLayerType: string;
  defaultBrush: {
    sizePx: number;
    hardness: number;
    opacity: number;
  };
}

export interface BrushStroke {
  id: string;
  points: number[][];
  pressure: number[];
  spacing: number;
  jitter: number;
  timestamp: string;
}

export interface Layer {
  id: string;
  type: LayerType;
  region: FaceRegion;
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  color: string;
  hardness: number;
  sizePx: number;
  strokes: BrushStroke[];
  ordering: number;
  autoMask?: Mask;
}

export interface Mask {
  id: string;
  polygon: number[][];
  featherPx: number;
  fromRegion: boolean;
}

export interface Project {
  id: string;
  title: string;
  createdAt: string;
  photoId: string;
  landmarksId?: string;
  layers: Layer[];
  symmetryGuide: boolean;
  lookPresetId?: string;
  notes?: string;
}

export interface Photo {
  id: string;
  source: 'upload' | 'webcam';
  blobRef: string;
  width: number;
  height: number;
  capturedAt: string;
  exif?: Record<string, any>;
}

export interface Landmarks {
  id: string;
  model: string;
  points: number[][];
  meshTriangles: number[][];
  qualityScore: number;
}

// Type literals
export type LayerType = 
  | 'foundation' 
  | 'concealer' 
  | 'contour' 
  | 'blush' 
  | 'highlight' 
  | 'eyeshadow' 
  | 'eyeliner' 
  | 'eyebrow' 
  | 'mascara' 
  | 'lipstick' 
  | 'custom';

export type FaceRegion = 
  | 'fullFace' 
  | 'underEye' 
  | 'cheeks' 
  | 'nose' 
  | 'forehead' 
  | 'chin' 
  | 'upperLid' 
  | 'lowerLid' 
  | 'lashLine' 
  | 'brow' 
  | 'lips' 
  | 'custom';

export type BlendMode = 
  | 'normal' 
  | 'multiply' 
  | 'screen' 
  | 'overlay' 
  | 'softLight' 
  | 'darken' 
  | 'lighten' 
  | 'color' 
  | 'burn' 
  | 'dodge';

export type ToolType = 'brush' | 'eraser' | 'dropper';

// API Response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Type guards
export function isLookPreset(obj: CosmicObject): obj is LookPreset {
  return obj.type === 'look-presets';
}

export function isLesson(obj: CosmicObject): obj is Lesson {
  return obj.type === 'lessons';
}

export function isColorPalette(obj: CosmicObject): obj is ColorPalette {
  return obj.type === 'color-palettes';
}

export function isTipGuide(obj: CosmicObject): obj is TipGuide {
  return obj.type === 'tips-guides';
}

export function isGalleryShowcase(obj: CosmicObject): obj is GalleryShowcase {
  return obj.type === 'gallery-showcases';
}

// Utility types
export type CreateProjectData = Omit<Project, 'id' | 'createdAt'>;
export type UpdateProjectData = Partial<Omit<Project, 'id'>>;
export type ExportSettings = {
  format: 'png' | 'jpg';
  beforeAfter: boolean;
  timelapse: boolean;
  maxEdge: number;
  quality?: number;
};

// Canvas and graphics types
export interface CanvasState {
  width: number;
  height: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  showBeforeAfter: boolean;
}

export interface BrushSettings {
  size: number;
  hardness: number;
  opacity: number;
  color: string;
  blendMode: BlendMode;
}

export interface EditorState {
  currentTool: ToolType;
  currentLayer?: Layer;
  brushSettings: BrushSettings;
  symmetryEnabled: boolean;
  selectedRegion: FaceRegion;
  isDrawing: boolean;
  undoStack: Layer[][];
  redoStack: Layer[][];
}