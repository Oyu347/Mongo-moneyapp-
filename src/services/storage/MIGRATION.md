# Storage migration — Phase 1

Source baseline: uploaded Möngö V44.12.5 `index.html`.

Phase 1 keeps the existing stored keys and JSON format unchanged.

Migrated core operations:
- main financial state save → `MongoStorage.setJSON(getDBKey(), data)`
- main financial state load → `MongoStorage.get(getDBKey(), null)`
- clear local financial state → `MongoStorage.remove(getDBKey())`
- backup export read → `MongoStorage.get(getDBKey(), null)`
- backup restore write → `MongoStorage.setJSON(getDBKey(), clean)`

The storage service must be loaded before the main inline application script:

```html
<script src="src/services/storage/storage.js"></script>
```

Firebase/cloud sync storage mirrors are intentionally not moved in Phase 1. They belong to the Firebase service migration and should be separated only after the local compatibility layer is verified.
