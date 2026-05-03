-- CreateTable
CREATE TABLE "app_user" (
    "id" SERIAL NOT NULL,
    "mask_uuid" UUID NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" SERIAL NOT NULL,
    "mask_uuid" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "land_shipment" (
    "shipment_id" INTEGER NOT NULL,
    "mask_uuid" UUID NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "vehicle_plate" VARCHAR(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "land_shipment_pkey" PRIMARY KEY ("shipment_id")
);

-- CreateTable
CREATE TABLE "port" (
    "id" SERIAL NOT NULL,
    "mask_uuid" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "location" VARCHAR(150),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "port_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "mask_uuid" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sea_shipment" (
    "shipment_id" INTEGER NOT NULL,
    "mask_uuid" UUID NOT NULL,
    "port_id" INTEGER NOT NULL,
    "fleet_number" VARCHAR(8) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "sea_shipment_pkey" PRIMARY KEY ("shipment_id")
);

-- CreateTable
CREATE TABLE "shipment" (
    "id" SERIAL NOT NULL,
    "mask_uuid" UUID NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "client_id" INTEGER NOT NULL,
    "registration_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "delivery_date" DATE NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "discount_percent" DECIMAL(5,2) DEFAULT 0,
    "discount_amount" DECIMAL(10,2) DEFAULT 0,
    "total_price" DECIMAL(10,2) NOT NULL,
    "guide_number" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_item" (
    "id" SERIAL NOT NULL,
    "mask_uuid" UUID NOT NULL,
    "shipment_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "shipment_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse" (
    "id" SERIAL NOT NULL,
    "mask_uuid" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "location" VARCHAR(150),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_user_mask_uuid_key" ON "app_user"("mask_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "app_user_email_key" ON "app_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "client_mask_uuid_key" ON "client"("mask_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "client_email_key" ON "client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "land_shipment_mask_uuid_key" ON "land_shipment"("mask_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "port_mask_uuid_key" ON "port"("mask_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "product_mask_uuid_key" ON "product"("mask_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "sea_shipment_mask_uuid_key" ON "sea_shipment"("mask_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "shipment_mask_uuid_key" ON "shipment"("mask_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "shipment_guide_number_key" ON "shipment"("guide_number");

-- CreateIndex
CREATE INDEX "idx_shipment_client" ON "shipment"("client_id");

-- CreateIndex
CREATE INDEX "idx_shipment_registration_date" ON "shipment"("registration_date");

-- CreateIndex
CREATE INDEX "idx_shipment_type" ON "shipment"("type");

-- CreateIndex
CREATE UNIQUE INDEX "shipment_item_mask_uuid_key" ON "shipment_item"("mask_uuid");

-- CreateIndex
CREATE INDEX "idx_shipment_item_product" ON "shipment_item"("product_id");

-- CreateIndex
CREATE INDEX "idx_shipment_item_shipment" ON "shipment_item"("shipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_mask_uuid_key" ON "warehouse"("mask_uuid");

-- AddForeignKey
ALTER TABLE "land_shipment" ADD CONSTRAINT "land_shipment_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "land_shipment" ADD CONSTRAINT "land_shipment_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sea_shipment" ADD CONSTRAINT "sea_shipment_port_id_fkey" FOREIGN KEY ("port_id") REFERENCES "port"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sea_shipment" ADD CONSTRAINT "sea_shipment_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shipment_item" ADD CONSTRAINT "shipment_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shipment_item" ADD CONSTRAINT "shipment_item_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
