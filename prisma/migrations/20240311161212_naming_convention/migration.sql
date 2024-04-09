/*
  Warnings:

  - You are about to drop the column `buildId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `desiredCapabilities` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `deviceName` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `devicePlatform` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `deviceUDID` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `deviceVersion` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `failureReason` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `hasLiveVideo` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `nodeId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionCapabilities` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `videoRecording` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `commandName` on the `SessionLog` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SessionLog` table. All the data in the column will be lost.
  - You are about to drop the column `isSuccess` on the `SessionLog` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SessionLog` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Build` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Build` table. All the data in the column will be lost.
  - Added the required column `desired_capabilities` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_platform` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_udid` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_version` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `has_live_video` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `node_id` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_capabilities` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SessionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Build` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "build_id" TEXT,
    "name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'running',
    "desired_capabilities" TEXT NOT NULL,
    "session_capabilities" TEXT NOT NULL,
    "node_id" TEXT NOT NULL,
    "has_live_video" BOOLEAN NOT NULL,
    "video_recording" TEXT,
    "start_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" DATETIME,
    "failure_reason" TEXT,
    "device_udid" TEXT NOT NULL,
    "device_platform" TEXT NOT NULL,
    "device_version" TEXT NOT NULL,
    "device_name" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Session_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "Build" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("id", "name", "status") SELECT "id", "name", "status" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE TABLE "new_SessionLog" (
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
    "is_success" BOOLEAN,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "SessionLog_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SessionLog" ("body", "id", "method", "response", "screenshot", "session_id", "subtitle", "title", "url") SELECT "body", "id", "method", "response", "screenshot", "session_id", "subtitle", "title", "url" FROM "SessionLog";
DROP TABLE "SessionLog";
ALTER TABLE "new_SessionLog" RENAME TO "SessionLog";
CREATE TABLE "new_Build" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Build" ("id", "name") SELECT "id", "name" FROM "Build";
DROP TABLE "Build";
ALTER TABLE "new_Build" RENAME TO "Build";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
