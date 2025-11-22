# Distributed Media Library & Processing System

A production-ready Laravel application for uploading, processing, and managing media files (images and videos) with distributed processing capabilities.

## 🚀 Features

- **Media Upload**: Upload photos and videos with automatic processing
- **Queue Processing**: Asynchronous media compression, thumbnail generation, and metadata extraction
- **Advanced Search**: Full-text search with Meilisearch integration
- **Real-time Status**: Track processing status of uploaded media
- **Admin Dashboard**: Comprehensive admin interface with filters, sorting, and pagination
- **Microservice Ready**: Structured for easy service separation
- **Load Testing**: Included k6 and Artillery scripts for performance testing

## 📋 Tech Stack

- **Laravel 12** (Latest)
- **PHP 8.2+**
- **PostgreSQL** (Main database)
- **Redis** (Queue + Caching)
- **Meilisearch** (Search indexing)
- **FFmpeg** (Video processing)
- **Docker & Docker Compose** (Containerization)
- **Nginx** (Reverse proxy)
- **Laravel Scout** (Search integration)

## 🏗️ Architecture

### Folder Structure

```
app/
├── Repositories/          # Repository interfaces and implementations
│   ├── MediaRepositoryInterface.php
│   ├── MediaRepository.php
│   ├── TagRepositoryInterface.php
│   └── TagRepository.php
├── Services/              # Business logic layer
│   └── MediaService.php
├── Http/
│   ├── Controllers/       # API controllers
│   │   ├── MediaController.php
│   │   ├── MediaStatusController.php
│   │   └── Admin/
│   │       └── AdminMediaController.php
│   └── Middleware/        # Custom middleware
│       ├── ApiKeyMiddleware.php
│       ├── LogRequestMiddleware.php
│       └── ValidateMediaTypeMiddleware.php
├── Jobs/                  # Queue jobs
│   ├── MediaProcessJob.php
│   ├── ThumbnailJob.php
│   └── MetadataJob.php
├── Events/                # Event classes
│   └── MediaProcessed.php
├── Listeners/             # Event listeners
│   ├── SendMediaProcessedNotification.php
│   └── IndexMediaInSearch.php
└── Models/                # Eloquent models
    ├── MediaFile.php
    ├── MediaMetadata.php
    └── Tag.php
```

### Design Patterns

- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic encapsulation
- **Dependency Injection**: Used throughout controllers and services
- **Event-Driven**: Events and listeners for media processing notifications

## 🐳 Docker Setup

### Prerequisites

- Docker & Docker Compose installed
- At least 4GB RAM available

### Quick Start

1. **Clone and navigate to the project:**
   ```bash
   cd distributed-photo-compresser
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` file with your configuration:**
   ```env
   APP_NAME="Distributed Media Library"
   APP_ENV=local
   APP_KEY=
   APP_DEBUG=true
   APP_URL=http://localhost:8080

   DB_CONNECTION=pgsql
   DB_HOST=postgres
   DB_PORT=5432
   DB_DATABASE=distributed_media
   DB_USERNAME=postgres
   DB_PASSWORD=postgres

   REDIS_HOST=redis
   REDIS_PORT=6379

   QUEUE_CONNECTION=redis

   MEILISEARCH_HOST=http://meilisearch:7700
   MEILISEARCH_KEY=masterKey

   SCOUT_DRIVER=meilisearch

   API_KEY=your-secret-api-key-here
   ```

4. **Build and start containers:**
   ```bash
   docker-compose up -d --build
   ```

5. **Install dependencies:**
   ```bash
   docker-compose exec app composer install
   ```

6. **Generate application key:**
   ```bash
   docker-compose exec app php artisan key:generate
   ```

7. **Run migrations:**
   ```bash
   docker-compose exec app php artisan migrate
   ```

8. **Create additional indexes (optional but recommended):**
   ```bash
   docker-compose exec postgres psql -U postgres -d distributed_media -f /path/to/indexes.sql
   ```

9. **Access the application:**
   - API: http://localhost:8080/api
   - Health check: http://localhost:8080/up

### Docker Services

- **app**: Laravel PHP-FPM application
- **nginx**: Reverse proxy server
- **postgres**: PostgreSQL database
- **redis**: Redis cache and queue
- **meilisearch**: Search engine
- **queue**: Queue worker container
- **scheduler**: Laravel scheduler container

## 📊 Database Schema

### Tables

- **users**: User accounts
- **media_files**: Main media file records
- **media_metadata**: Extracted metadata (JSONB)
- **tags**: Media tags
- **media_tag**: Pivot table for media-tag relationships
- **jobs**: Queue jobs table
- **failed_jobs**: Failed queue jobs

### Indexes

- **Fulltext indexes**: For name and tag search (GIN indexes)
- **B-tree indexes**: For created_at, type, status, size
- **GIN indexes**: For JSONB metadata queries
- **Composite indexes**: For common query patterns (user_id + type, etc.)
- **Partial indexes**: For pending and failed media

See `database/indexes.sql` for all index definitions.

## 🔌 API Endpoints

### Authentication Required

All endpoints require authentication via Laravel Sanctum.

### Media Endpoints

#### Upload Media
```http
POST /api/media/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- file: (required) Media file
- tags[]: (optional) Array of tag names
```

#### List User Media
```http
GET /api/media?per_page=15&type=image&status=completed&sort_by=created_at&sort_order=desc
Authorization: Bearer {token}
```

#### Get Media File
```http
GET /api/media/{id}
Authorization: Bearer {token}
```

#### Search Media
```http
GET /api/media/search?query=nature&type=image&status=completed&per_page=15
Authorization: Bearer {token}
```

#### Get Processing Status
```http
GET /api/media/{id}/status
Authorization: Bearer {token}
```

#### Delete Media
```http
DELETE /api/media/{id}
Authorization: Bearer {token}
```

### Admin Endpoints

Requires API key in header: `X-API-Key: {api_key}`

#### List All Media (Admin)
```http
GET /api/admin/media?per_page=15&type=video&status=processing&user_id=1
Authorization: Bearer {token}
X-API-Key: {api_key}
```

#### Get Statistics
```http
GET /api/admin/media/statistics
Authorization: Bearer {token}
X-API-Key: {api_key}
```

## 🔧 Configuration

### CORS

CORS is configured in `config/cors.php`:
- Allows all origins (`*`)
- Allows all methods (GET, POST, PUT, DELETE, etc.)
- Allows all headers

### Middleware

#### ApiKeyMiddleware
Validates API key for internal microservice communication.

#### LogRequestMiddleware
Logs all HTTP requests with method, URL, IP, status, and duration.

#### ValidateMediaTypeMiddleware
Validates uploaded files are images or videos only.

### Queue Configuration

Queue jobs are processed asynchronously using Redis:
- **MediaProcessJob**: Main processing job (1 hour timeout)
- **ThumbnailJob**: Generates thumbnails (10 minutes timeout)
- **MetadataJob**: Extracts metadata (5 minutes timeout)

## 🎬 Media Processing

### Image Processing

- **Compression**: Scales down to max 1920x1080, 85% JPEG quality
- **Thumbnails**: Generates 3 sizes (150x150, 300x300, 800x800)
- **Metadata**: Extracts width, height, format, colorspace

### Video Processing

- **Compression**: FFmpeg with H.264 codec, CRF 28, AAC audio
- **Thumbnails**: Extracts frame at 1 second, generates 3 sizes
- **Metadata**: Extracts width, height, duration, codec, bitrate, FPS

### Processing Flow

1. User uploads media → `MediaService::uploadMedia()`
2. Media file record created with status `pending`
3. `MediaProcessJob` dispatched to queue
4. Job updates status to `processing`
5. Parallel jobs dispatched:
   - `ThumbnailJob` → Generates thumbnails
   - `MetadataJob` → Extracts metadata
6. Main job compresses media
7. Status updated to `completed`
8. `MediaProcessed` event fired
9. Listeners:
   - `SendMediaProcessedNotification` → Logs completion
   - `IndexMediaInSearch` → Indexes in Meilisearch

## 🔍 Search

Search is powered by Meilisearch via Laravel Scout:

- **Indexed fields**: name, original_name, type, mime_type, status
- **Filterable**: type, status, user_id
- **Sortable**: created_at, size
- **Searchable**: name, original_name

## 📈 Load Testing

### K6 (Upload Testing)

```bash
# Install k6
# macOS: brew install k6
# Linux: https://k6.io/docs/getting-started/installation/

# Run upload test
k6 run --vus 10 --duration 60s load-testing/k6-upload.js

# With custom base URL and token
BASE_URL=http://localhost:8080 API_TOKEN=your-token k6 run load-testing/k6-upload.js
```

**Thresholds:**
- 95% of requests < 2s
- Error rate < 1%
- Throughput > 5 req/s

### Artillery (Search Testing)

```bash
# Install Artillery
npm install -g artillery

# Run search test
artillery run load-testing/artillery-search.yml

# With custom token
API_TOKEN=your-token artillery run load-testing/artillery-search.yml
```

**Test Phases:**
- Warm-up: 2 req/s for 30s
- Ramp up: 5-20 req/s over 60s
- Sustained: 20 req/s for 120s
- Spike: 50 req/s for 30s
- Cool down: 5 req/s for 30s

## 🚀 Query Optimization

### Repository Pattern Benefits

- **Select only needed fields**: Reduces memory usage
- **Eager loading**: Prevents N+1 queries
- **Indexed queries**: Uses database indexes efficiently

### Example Optimized Query

```php
MediaFile::select(['id', 'name', 'type', 'status', 'created_at'])
    ->where('user_id', $userId)
    ->where('type', 'image')
    ->with(['metadata:id,media_file_id,width,height'])
    ->orderBy('created_at', 'desc')
    ->paginate(15);
```

This query:
- Selects only required columns
- Uses indexes on `user_id`, `type`, and `created_at`
- Eager loads metadata to prevent N+1
- Uses pagination to limit results

## 🔐 Security

- **Authentication**: Laravel Sanctum
- **API Key**: For internal microservice communication
- **File Validation**: MIME type validation middleware
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Request validation on all endpoints

## 🧪 Testing

```bash
# Run tests
docker-compose exec app php artisan test

# Run specific test suite
docker-compose exec app php artisan test --testsuite=Feature
```

## 📝 Environment Variables

Key environment variables (see `.env.example`):

```env
# Application
APP_NAME="Distributed Media Library"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080
API_KEY=your-secret-api-key

# Database
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=distributed_media
DB_USERNAME=postgres
DB_PASSWORD=postgres

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Queue
QUEUE_CONNECTION=redis

# Meilisearch
MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_KEY=masterKey
SCOUT_DRIVER=meilisearch
```

## 🏭 Production Deployment

### Recommendations

1. **Set `APP_DEBUG=false`** in production
2. **Use strong `API_KEY`** for admin endpoints
3. **Configure proper CORS origins** (not `*`)
4. **Set up proper logging** (Laravel Log, Sentry, etc.)
5. **Use S3 or similar** for media storage
6. **Scale queue workers** based on load
7. **Monitor queue failures** regularly
8. **Set up database backups**
9. **Use CDN** for serving media files
10. **Enable Redis persistence** for queue reliability

### Scaling

The architecture supports horizontal scaling:

- **Upload Service**: Can be separated into its own service
- **Processor Service**: Queue workers can run on separate servers
- **Search Service**: Meilisearch can be scaled independently

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Scout](https://laravel.com/docs/scout)
- [Meilisearch Documentation](https://www.meilisearch.com/docs)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [K6 Documentation](https://k6.io/docs/)
- [Artillery Documentation](https://www.artillery.io/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🐛 Troubleshooting

### Queue not processing

```bash
# Check queue worker logs
docker-compose logs queue

# Restart queue worker
docker-compose restart queue
```

### FFmpeg not working

```bash
# Check if FFmpeg is installed in container
docker-compose exec app ffmpeg -version

# If not, rebuild container
docker-compose up -d --build app
```

### Meilisearch connection issues

```bash
# Check Meilisearch logs
docker-compose logs meilisearch

# Test connection
docker-compose exec app php artisan scout:sync "App\Models\MediaFile"
```

### Database connection issues

```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec app php artisan migrate:status
```

## 📞 Support

For issues and questions, please open an issue on the repository.

