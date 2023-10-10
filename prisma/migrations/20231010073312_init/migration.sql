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
    "title" TEXT,
    "desired_capabilities" TEXT NOT NULL,
    "session_capabilities" TEXT NOT NULL,
    "node_id" TEXT NOT NULL,
    "has_live_video" BOOLEAN NOT NULL,
    "has_session_video" BOOLEAN NOT NULL,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "device_udid" TEXT NOT NULL,
    "device_platform" TEXT NOT NULL,
    "device_version" TEXT NOT NULL,
    "device_name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "Build" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
