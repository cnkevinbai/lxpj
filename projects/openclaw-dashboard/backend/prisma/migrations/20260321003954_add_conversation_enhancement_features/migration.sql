-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "summary" TEXT;

-- CreateTable
CREATE TABLE "ContextCompression" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "startMessageId" TEXT NOT NULL,
    "endMessageId" TEXT NOT NULL,
    "messageCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContextCompression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentMemory" (
    "id" TEXT NOT NULL,
    "agentId" TEXT,
    "sessionId" TEXT,
    "type" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "metadata" JSONB,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentMemory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContextCompression_sessionId_idx" ON "ContextCompression"("sessionId");

-- CreateIndex
CREATE INDEX "ContextCompression_createdAt_idx" ON "ContextCompression"("createdAt");

-- CreateIndex
CREATE INDEX "AgentMemory_agentId_idx" ON "AgentMemory"("agentId");

-- CreateIndex
CREATE INDEX "AgentMemory_sessionId_idx" ON "AgentMemory"("sessionId");

-- CreateIndex
CREATE INDEX "AgentMemory_type_idx" ON "AgentMemory"("type");

-- CreateIndex
CREATE INDEX "AgentMemory_key_idx" ON "AgentMemory"("key");

-- CreateIndex
CREATE INDEX "AgentMemory_expiresAt_idx" ON "AgentMemory"("expiresAt");

-- AddForeignKey
ALTER TABLE "ContextCompression" ADD CONSTRAINT "ContextCompression_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentMemory" ADD CONSTRAINT "AgentMemory_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
