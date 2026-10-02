# ogimg.in Feature Plan

This plan tracks what is shipped and what is next. Items already in the product are marked
as done so the list can be used as a backlog without rewriting history.

## Shipped

### Free canvas editor
- Layer based canvas for text, shapes, and images with reorder, hide, lock, duplicate, and delete.
- Drag, resize, rotate, and arrow-key nudge with snapping to canvas centres and other layer edges.
- Per-layer typography: 16 self-hosted families, weight, size, line height, tracking, case, alignment.
- Undo and redo with coalesced steps, so dragging or typing collapses into one undo.

### Uploaded canvas background
- The free canvas takes an uploaded image as its background, alongside solid, gradient, and preset fills.
- Fit, opacity, and a scrim control sit behind the existing solid colour, so type stays readable over a
  photo and no extra colour picker is introduced.
- The image is stored as a data URL and rendered as a real `img`, so it survives the export pipeline and
  the social preview without changes.

### Custom dimensions and platform presets
- Open Graph, X summary large, LinkedIn, Product Hunt, YouTube, square, and story sizes.
- Custom width and height, with existing layers rescaled proportionally when the canvas changes.

### Social preview simulator
- Renders the live canvas inside X, LinkedIn, Discord, and Slack preview cards.
- Generates the `og:image`, `og:image:width`, `og:image:height`, and `twitter:card` tags, copyable.

### Saved projects and draft recovery
- Projects, duplicates, renames, and deletes in local storage.
- The free canvas autosaves a draft, so a closed tab does not lose work.

### Brand kits
- Reusable logo, type colour, font, and background that apply in one click.
- Multiple kits for teams working across several brands.

### Template variables and layout rules
- Each template declares its fields in a control schema instead of branching on `templateId`.
- Headline size, headline tracking, image fit, and corner radius are adjustable per template.
- Each template now has its own composition and headline baseline, and the nine share one card frame
  (`TemplateCard.tsx`) so hierarchy stays consistent without repeating accent colours.

## Next

### Bulk generation
- Generate many images from CSV or JSON input.
- Map columns to template fields and export as a zip.

Why this matters:
- Unlocks programmatic SEO, blog cover generation, changelog archives, and campaign batches.

### Shareable editor state
- Encode a project in a URL or an exported config JSON so a design can be sent as an editable link.

### API and headless rendering
- Accept a template id or canvas document plus a JSON payload and return a rendered image.
- Export parity is a hard requirement so browser and server output do not drift.

### Template assets in the free canvas
- Import a template's background and palette into the canvas as a starting point, instead of only
  switching to the template editor.

### Text layout guards
- Auto-shrink or flag headlines that overflow their frame, per layer and per template. Still open: the
  editor reports a baseline but does not yet warn when a long headline runs past its slot.

### Asset library
- Reuse logos, screenshots, and canvas backgrounds already uploaded in this browser across new documents.
  The upload primitive and data URL storage now exist in three places (image layer, template slot, canvas
  background), so a shared picker is the natural next step.

### Team workspaces
- Shared kits, shared templates, and approval flow. Useful only after projects sync beyond one device.

## Notes for implementation

- Keep the no-backend editing flow as the default path.
- Prefer schema-driven configuration over `templateId === ...` conditionals.
- If persistence is added, start with local storage or IndexedDB before accounts.
- If API rendering is added, keep export parity a hard requirement.