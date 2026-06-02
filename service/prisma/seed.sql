-- Seed data for inventoryManager (MySQL)
-- Inserts sample data for Prisma models (excluding RequestLog)
USE inventory_manager;
SET @@session.time_zone = '+00:00';

-- Generate stable UUIDs into variables for reuse
SET @company1 = UUID();
SET @role_admin = UUID();
SET @perm_manage = UUID();
SET @roleperm1 = UUID();
SET @user1 = UUID();
SET @currency_usd = UUID();
SET @category_office = UUID();
SET @item_pen = UUID();
SET @inventory_pen = UUID();
SET @transaction1 = UUID();
SET @inventory_event1 = UUID();

-- Companies
INSERT INTO `Company` (`id`, `name`, `description`, `email`, `address`, `phone`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
  (@company1, 'Acme Co', 'Sample company for seeding', 'info@acme.example', '123 Main St', '555-0100', NOW(), NOW(), NULL);

-- Roles
INSERT INTO `Role` (`id`, `name`, `description`, `companyId`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
  (@role_admin, 'admin', 'Administrator role', @company1, NOW(), NOW(), NULL);

-- Permissions
INSERT INTO `Permission` (`id`, `name`, `description`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
  (@perm_manage, 'manage_all', 'Full access for seeding examples', NOW(), NOW(), NULL);

-- RolePermission (assign permission to role)
INSERT INTO `RolePermission` (`id`, `roleId`, `permissionId`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
  (@roleperm1, @role_admin, @perm_manage, NOW(), NOW(), NULL);

-- Users
INSERT INTO `User` (`id`, `email`, `firstName`, `lastName`, `companyId`, `roleId`, `password`, `createdAt`, `updatedAt`, `deletedAt`, `enabled`)
VALUES
  (@user1, 'mathewspaku@gmail.com', 'Matt', 'Paku', @company1, @role_admin, '$2b$10$ca.CnrQ9YOCUPdZ9HzjMBOnJKIbUvB/ZzdmrY.T5kpLlLT8iAISoi', NOW(), NOW(), NULL, TRUE);

-- Currencies
INSERT INTO `Currency` (`id`, `code`, `name`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
  (@currency_usd, 'USD', 'US Dollar', NOW(), NOW(), NULL);

-- Categories
INSERT INTO `Category` (`id`, `name`, `description`, `companyId`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
  (@category_office, 'Office Supplies', 'Pens, paper and other office items', @company1, NOW(), NOW(), NULL);

-- Items
INSERT INTO `Item` (`id`, `name`, `description`, `categoryId`, `companyId`, `currencyId`, `createdAt`, `updatedAt`, `deletedAt`, `costPrice`, `sellPrice`, `sku`, `barcode`)
VALUES
  (@item_pen, 'Ballpoint Pen', 'Smooth ink pen, blue', @category_office, @company1, @currency_usd, NOW(), NOW(), NULL, 0.5, 1.25, 'PEN-001', '0123456789012');

-- Inventory (one per item)
INSERT INTO `Inventory` (`id`, `itemId`, `quantity`, `createdAt`, `updatedAt`, `deletedAt`, `eventHash`, `companyId`)
VALUES
  (@inventory_pen, @item_pen, 100, NOW(), NOW(), NULL, CONCAT('evt_', REPLACE(UUID(), '-', '')), @company1);

-- Transactions
INSERT INTO `Transaction` (`id`, `inventoryId`, `quantity`, `type`, `createdAt`, `updatedAt`, `deletedAt`, `companyId`)
VALUES
  (@transaction1, @inventory_pen, 100, 'IN', NOW(), NOW(), NULL, @company1);

-- InventoryEvent
INSERT INTO `InventoryEvent` (`id`, `inventoryId`, `transactionId`, `eventType`, `eventHash`, `payload`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
  (@inventory_event1, @inventory_pen, @transaction1, 'INITIAL_STOCK', CONCAT('evt_', REPLACE(UUID(), '-', '')), JSON_OBJECT('note', 'Initial seed stock', 'quantity', 100), NOW(), NOW(), NULL);

-- End of seed file
