-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "FacilityLevel" AS ENUM ('BANYAK', 'ADA', 'TIDAK_ADA');

-- CreateEnum
CREATE TYPE "ToiletType" AS ENUM ('DUDUK', 'JONGKOK', 'CAMPURAN');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('PRIA', 'WANITA', 'UNISEX');

-- CreateEnum
CREATE TYPE "Atmosphere" AS ENUM ('TENANG', 'NYAMAN', 'HIDUP', 'MODERAT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "alias" TEXT,
    "avatarUrl" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "photoUrls" TEXT[],
    "fomoScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "claimedById" TEXT,
    "priceMin" INTEGER,
    "priceMax" INTEGER,
    "openDays" TEXT,
    "openTime" TEXT,
    "closeTime" TEXT,
    "website" TEXT,
    "socialMedia" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotTag" (
    "spotId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "SpotTag_pkey" PRIMARY KEY ("spotId","tagId")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT,
    "userId" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotFacility" (
    "id" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,
    "wifi" "FacilityLevel" NOT NULL DEFAULT 'TIDAK_ADA',
    "wifiSpeed" TEXT,
    "plugs" "FacilityLevel" NOT NULL DEFAULT 'TIDAK_ADA',
    "comfyDesk" "FacilityLevel" NOT NULL DEFAULT 'TIDAK_ADA',
    "atmosphere" "Atmosphere",
    "hasIndoor" BOOLEAN NOT NULL DEFAULT false,
    "toiletLevel" "FacilityLevel" NOT NULL DEFAULT 'TIDAK_ADA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpotFacility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Toilet" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "type" "ToiletType" NOT NULL,
    "gender" "GenderType" NOT NULL,
    "cleanliness" INTEGER NOT NULL,
    "hasDisabled" BOOLEAN NOT NULL DEFAULT false,
    "hasBabyFacility" BOOLEAN NOT NULL DEFAULT false,
    "hasMusholla" BOOLEAN NOT NULL DEFAULT false,
    "hasTissue" BOOLEAN NOT NULL DEFAULT false,
    "hasSoap" BOOLEAN NOT NULL DEFAULT false,
    "hasSanitizer" BOOLEAN NOT NULL DEFAULT false,
    "hasWastafel" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Toilet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SpotFacility_spotId_key" ON "SpotFacility"("spotId");

-- CreateIndex
CREATE INDEX "Toilet_facilityId_idx" ON "Toilet"("facilityId");

-- AddForeignKey
ALTER TABLE "Spot" ADD CONSTRAINT "Spot_claimedById_fkey" FOREIGN KEY ("claimedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotTag" ADD CONSTRAINT "SpotTag_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotTag" ADD CONSTRAINT "SpotTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotFacility" ADD CONSTRAINT "SpotFacility_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Toilet" ADD CONSTRAINT "Toilet_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "SpotFacility"("id") ON DELETE CASCADE ON UPDATE CASCADE;
