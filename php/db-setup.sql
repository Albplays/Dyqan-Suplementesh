
CREATE DATABASE IF NOT EXISTS powerfit_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE powerfit_db;

-- ===== TABELA E POROSIVE =====
CREATE TABLE IF NOT EXISTS orders (
  id                  INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_number        VARCHAR(50)   NOT NULL UNIQUE,
  payment_intent_id   VARCHAR(255)  NOT NULL,
  customer_name       VARCHAR(150)  NOT NULL,
  customer_email      VARCHAR(255)  NOT NULL,
  customer_phone      VARCHAR(50)   DEFAULT '',
  shipping_address    TEXT          DEFAULT '',
  items_json          LONGTEXT      NOT NULL,     -- JSON e produkteve
  subtotal            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  shipping            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total               DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status              ENUM('pending','paid','shipped','delivered','cancelled','refunded')
                                    NOT NULL DEFAULT 'pending',
  notes               TEXT          DEFAULT '',
  created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME      ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email     (customer_email),
  INDEX idx_status    (status),
  INDEX idx_created   (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== TABELA E PËRDORUESVE =====
CREATE TABLE IF NOT EXISTS users (
  id            INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== TABELA E NEWSLETTER =====
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id           INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email        VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active    TINYINT(1)  NOT NULL DEFAULT 1,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== SHEMBULL POROSI (TEST) =====
INSERT INTO orders (order_number, payment_intent_id, customer_name, customer_email,
                    customer_phone, shipping_address, items_json, subtotal, shipping, total, status)
VALUES (
  'PF-TEST001',
  'pi_test_example',
  'Albion Çaushi',
  'albion@test.al',
  '+355 69 111 2233',
  'Rruga Dëshmorët e Kombit, Nr. 1, Tiranë',
  '[{"id":1,"name":"Whey Protein Gold","qty":2,"price":35.99},{"id":2,"name":"Kreatinë Monohidrat","qty":1,"price":18.99}]',
  90.97,
  0.00,
  90.97,
  'paid'
);
