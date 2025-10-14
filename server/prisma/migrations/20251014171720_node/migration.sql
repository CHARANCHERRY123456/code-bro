/*
  Warnings:

  - You are about to drop the column `fileId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `FileAccess` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `FileVersion` table. All the data in the column will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nodeId,userId]` on the table `FileAccess` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nodeId` to the `FileAccess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nodeId` to the `FileVersion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('FILE', 'FOLDER');

-- DropForeignKey
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_fileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_folderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FileAccess" DROP CONSTRAINT "FileAccess_fileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FileVersion" DROP CONSTRAINT "FileVersion_fileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Folder" DROP CONSTRAINT "Folder_parentFolderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Folder" DROP CONSTRAINT "Folder_projectId_fkey";

-- DropIndex
DROP INDEX "public"."AuditLog_fileId_idx";

-- DropIndex
DROP INDEX "public"."FileAccess_fileId_idx";

-- DropIndex
DROP INDEX "public"."FileAccess_fileId_userId_key";

-- DropIndex
DROP INDEX "public"."FileVersion_fileId_idx";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "fileId",
ADD COLUMN     "nodeId" INTEGER;

-- AlterTable
ALTER TABLE "FileAccess" DROP COLUMN "fileId",
ADD COLUMN     "nodeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FileVersion" DROP COLUMN "fileId",
ADD COLUMN     "nodeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."File";

-- DropTable
DROP TABLE "public"."Folder";

-- CreateTable
CREATE TABLE "Node" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "content" TEXT,
    "parentId" INTEGER,
    "projectId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Node_projectId_idx" ON "Node"("projectId");

-- CreateIndex
CREATE INDEX "Node_parentId_idx" ON "Node"("parentId");

-- CreateIndex
CREATE INDEX "AuditLog_nodeId_idx" ON "AuditLog"("nodeId");

-- CreateIndex
CREATE INDEX "FileAccess_nodeId_idx" ON "FileAccess"("nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "FileAccess_nodeId_userId_key" ON "FileAccess"("nodeId", "userId");

-- CreateIndex
CREATE INDEX "FileVersion_nodeId_idx" ON "FileVersion"("nodeId");

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAccess" ADD CONSTRAINT "FileAccess_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileVersion" ADD CONSTRAINT "FileVersion_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;
