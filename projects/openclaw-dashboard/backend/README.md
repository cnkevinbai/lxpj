# OpenClaw Dashboard Backend - Database Setup

## Prisma Schema

The database schema is defined in `prisma/schema.prisma` and includes three main models:

1. **FileMetadata** - Stores file metadata including filename, original name, MIME type, size, path, hash, category, and status.
2. **DocumentChunk** - Stores RAG document chunks with content, token count, and embedding ID.
3. **RAGIndex** - Stores RAG index metadata including name, document count, chunk count, and status.

## Database Migration

### Prerequisites

- PostgreSQL database running locally or accessible via network
- Database URL configured in `.env` file

### Migration Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the migration:
   ```bash
   npx prisma migrate deploy
   ```

3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

4. Initialize default RAG index:
   ```bash
   npm run init:index
   ```

### Manual Migration

If automatic migration fails, you can apply the SQL migration manually:

```sql
-- Apply the SQL from prisma/migrations/20260319124100_init_file_management/migration.sql
```

## Repository Layer

The repository layer provides data access methods for each model:

- `FileRepository` - Methods for file metadata operations
- `DocumentChunkRepository` - Methods for document chunk operations  
- `RAGIndexRepository` - Methods for RAG index operations

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string

Example:
```
DATABASE_URL="postgresql://user:password@localhost:5432/openclaw_dashboard?schema=public"
```

## Scripts

- `scripts/init-index.ts` - Initializes the default RAG index