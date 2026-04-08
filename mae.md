# Mirador-Annotation-Editor

[source code](https://github.com/TETRAS-IIIF/mirador-annotation-editor)

## `maeData`

`maeData` is a field added to each annotation created in MAE that is used to store the annotation's internal state. In MAE, the `maeData` is used whenever possible, and converted to a IIIF annotation when saving the annotation.

Here is the structure of `maeData`:

```typescript
{
  // Which template was used to create the annotation
  // Values: 'multiple_body' | 'tagging' | 'text' | 'iiif'
  templateType: string,

  // The rich-text body of the annotation (present in MULTIPLE_BODY_TYPE and TEXT_TYPE)
  textBody: {
    purpose: 'describing',       // always this value
    type: 'TextualBody',         // always this value
    value: string,               // HTML string (from Quill editor)
  },

  // Tags (only present in MULTIPLE_BODY_TYPE)
  tags: Array<{
    label: string,               // display label
    value: string,               // tag value (same as label)
  }>,

  // URI of a linked IIIF manifest (only used in "network of manifests" feature)
  // stored as a URL string, appended to annotation.id on save as `id#manifestNetwork`
  manifestNetwork?: string,

  // Spatial/temporal target — where on the canvas the annotation points to
  target: {
    // Konva drawing state — JSON-stringified when persisted, object in memory
    // Contains the shapes drawn by the user
    drawingState: string | {     // string at rest (JSON), object in memory
      currentShape: Shape | null,
      isDrawing: boolean,
      shapes: Shape[],
    },

    // Full canvas dimensions: "x,y,width,height" — e.g. "0,0,1200,800"
    // Set for IMAGE media type
    fullCanvaXYWH?: string,

    // SVG string generated from the Konva stage on save
    // Used when target is complex (non-simple rectangle)
    svg?: string,

    // Scale factor: mediaHeight / displayedHeight * zoom
    // Computed on save
    scale?: number,

    // Temporal fields (video/audio only, from MAEV extension)
    tstart?: number,             // start time in seconds
    tend?: number,               // end time in seconds
  },
}
```

Here is where `maeData` is modified in the source code:

| File | What it does |
|------|--------------|
|`plugins/annotationCreationCompanionWindow.js` | Bootstraps empty `maeData`: `{ templateType: null }` for new annotations |
| `annotationForm/MultipleBodyTemplate.jsx` | Initializes full `maeData` for `MULTIPLE_BODY_TYPE`; hydrates `textBody` and `tags` from existing IIIF body on load; updates `textBody`, `tags`, `target` in state |
| `annotationForm/TaggingTemplate.jsx` | Initializes `maeData` for `TAGGING_TYPE`; updates `target` |
| `annotationForm/TextCommentTemplate.jsx` | Initializes `maeData` for `TEXT_TYPE` (legacy, kept for backwards compat); updates `target` |
| `annotationForm/TargetFormSection.jsx` | Computes the default `target` object (`drawingState`, `fullCanvaXYWH`) when none exists |
`IIIFUtils.js` →  `convertAnnotationStateToBeSaved()` | Finalizes `maeData` on save: cleans `target` to only allowed fields, computes `svg` from Konva stage, computes `scale`, JSON-stringifies `drawingState` |
`IIIFUtils.js` →  `convertIIIFAnnoToMaeData()` | Generates `maeData` from scratch for annotations that were not created by MAE (imported/external annotations)

