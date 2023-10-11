-- CreateTable
CREATE TABLE "Build" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "build_id" TEXT,
    "name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'running',
    "desired_capabilities" TEXT NOT NULL,
    "session_capabilities" TEXT NOT NULL,
    "node_id" TEXT NOT NULL,
    "has_live_video" BOOLEAN NOT NULL,
    "video_recording" TEXT,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "failure_reason" TEXT,
    "device_udid" TEXT NOT NULL,
    "device_platform" TEXT NOT NULL,
    "device_version" TEXT NOT NULL,
    "device_name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "Build" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SessionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "command_name" TEXT,
    "url" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "body" TEXT,
    "response" TEXT NOT NULL,
    "screenshot" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SessionLog_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
