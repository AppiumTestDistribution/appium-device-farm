-- CreateTable
CREATE TABLE "TestEventJournal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "event_uuid" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_sub_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scopes" TEXT NOT NULL,
    "result" TEXT,
    "started_at" DATETIME,
    "finished_at" DATETIME,
    "start_event_doc" TEXT,
    "finished_event_doc" TEXT,
    "file" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TestEventJournal_event_uuid_key" ON "TestEventJournal"("event_uuid");
