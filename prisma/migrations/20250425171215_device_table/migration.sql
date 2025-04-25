/*
  Warnings:

  - You are about to drop the `DeviceAllocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DeviceAllocation";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TeamDevice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "device_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "TeamDevice_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamDevice_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "udid" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tags" TEXT,
    "real" BOOLEAN NOT NULL DEFAULT false,
    "usage" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamDevice_device_id_team_id_key" ON "TeamDevice"("device_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "Device_udid_host_key" ON "Device"("udid", "host");
