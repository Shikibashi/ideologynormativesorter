# v2 Web Performance

The isolated build is measured with `npm run v2:web:performance` after `npm run v2:web:build`. The command reports total asset bytes, JavaScript bytes, asset count, and the five largest assets from `v2/dist-v2/assets`.

The application keeps the first render small in structure: canonical content is bundled once, and the view-model is computed only for the active result. The UI does not run scoring layers during rendering. The full-corpus renderability test builds question view-models for every active core and specialist item without changing the canonical bundle.

Performance figures are build artifacts, not measurement claims about field devices. Any future optimization must preserve the content fingerprint and the public scoring boundary.

Latest local production-mode build measurement: 2 assets, 1,393,276 total bytes, 1,385,556 JavaScript bytes, and 7,720 CSS bytes. The bundler reports a large JavaScript chunk because the canonical content and pure engine are intentionally shipped together for this isolated Phase 11 build; this is a follow-up optimization target, not a scoring change.
