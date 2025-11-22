# UI Troubleshooting Guide

## If changes are not visible in the UI:

### 1. Clear Vite Cache
```bash
rm -rf node_modules/.vite public/hot public/build/.vite
```

### 2. Rebuild Assets
```bash
npm run build
# or for development
npm run dev
```

### 3. Clear Laravel Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear
```

### 4. Restart Development Server
If using `npm run dev`, restart it:
```bash
# Stop the dev server (Ctrl+C)
npm run dev
```

### 5. Hard Refresh Browser
- Chrome/Edge: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Firefox: `Ctrl+F5` (Windows/Linux) or `Cmd+Shift+R` (Mac)

### 6. Check Browser Console
Open browser DevTools (F12) and check for:
- JavaScript errors
- 404 errors for assets
- Network errors

### 7. Verify Page Resolution
The Inertia pages should be resolved as:
- `media/index` → `resources/js/pages/media/index.tsx`
- `media/show` → `resources/js/pages/media/show.tsx`

Check in `app/Http/Controllers/Web/MediaController.php`:
```php
return Inertia::render('media/index', [...]);
return Inertia::render('media/show', [...]);
```

### 8. Check Vite Configuration
Ensure `vite.config.ts` includes the media pages in the build.

### 9. Docker Environment
If using Docker:
```bash
docker-compose exec app npm run build
docker-compose restart app
```

### 10. Check File Permissions
```bash
chmod -R 775 resources/js
chmod -R 775 public/build
```

## Common Issues

### Pages not loading
- Verify the page file exists at the correct path
- Check that the page component is exported as default
- Ensure the Inertia render name matches the file path

### Components not found
- Check import paths (should use `@/components/...`)
- Verify TypeScript path aliases in `tsconfig.json`
- Ensure components are properly exported

### Styling not applied
- Run `npm run build` to compile Tailwind CSS
- Check that `app.css` is imported in `app.tsx`
- Verify Tailwind config includes the component paths

