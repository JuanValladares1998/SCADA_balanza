-- =========================
-- 0) Esquema (opcional)
-- =========================
-- CREATE SCHEMA IF NOT EXISTS scm_pesaje;
-- SET search_path TO scm_pesaje;

-- =========================
-- 1) Catálogos básicos
-- =========================

CREATE TABLE IF NOT EXISTS tbl_usuario (
  ide_usuario        bigserial PRIMARY KEY,
  des_usuario        varchar(120) NOT NULL,
  des_alias          varchar(80),
  des_email          varchar(180),
  fec_creacion       timestamptz NOT NULL DEFAULT now(),
  fec_inactivacion   timestamptz
);

CREATE TABLE IF NOT EXISTS tbl_puerta (
  ide_puerta         bigserial PRIMARY KEY,
  des_puerta         varchar(80) NOT NULL UNIQUE,
  des_ubicacion      varchar(160),
  fec_creacion       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tbl_balanza (
  ide_balanza        bigserial PRIMARY KEY,
  des_balanza        varchar(80) NOT NULL UNIQUE,
  des_modelo         varchar(120),
  des_ubicacion      varchar(160),
  num_capacidad_kg   numeric(12,3),
  fec_creacion       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tbl_camion (
  ide_camion         bigserial PRIMARY KEY,
  des_placa          varchar(12) NOT NULL UNIQUE,
  des_transportista  varchar(160),
  fec_creacion       timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- 2) Visita (ciclo dentro de planta)
-- =========================
CREATE TABLE IF NOT EXISTS tbl_visita_planta (
  ide_visita_planta        bigserial PRIMARY KEY,
  ide_camion               bigint NOT NULL REFERENCES tbl_camion(ide_camion),
  fec_ingreso_planta       timestamptz NOT NULL,
  fec_salida_planta        timestamptz,
  ide_seguridad_ingreso    bigint UNIQUE, -- se llena al crear registro de seguridad
  des_estado_visita        varchar(20) NOT NULL DEFAULT 'ABIERTA',
  -- ABIERTA / CERRADA / ANULADA (si lo necesitas luego)

  CONSTRAINT chk_visita_estado
    CHECK (des_estado_visita IN ('ABIERTA','CERRADA','ANULADA')),

  CONSTRAINT chk_visita_fechas
    CHECK (fec_salida_planta IS NULL OR fec_salida_planta >= fec_ingreso_planta)
);

-- =========================
-- 3) Seguridad (ingreso a planta)
-- =========================
CREATE TABLE IF NOT EXISTS tbl_seguridad_ingreso (
  ide_seguridad_ingreso   bigserial PRIMARY KEY,
  ide_visita_planta       bigint NOT NULL UNIQUE REFERENCES tbl_visita_planta(ide_visita_planta),
  des_placa_declarada     varchar(12) NOT NULL,
  fec_evento              timestamptz NOT NULL,
  ide_puerta              bigint NOT NULL REFERENCES tbl_puerta(ide_puerta),
  ide_usuario_registro    bigint NOT NULL REFERENCES tbl_usuario(ide_usuario)
);

-- Vincular en visita (FK diferida opcional)
ALTER TABLE tbl_visita_planta
  ADD CONSTRAINT fk_visita_seguridad
  FOREIGN KEY (ide_seguridad_ingreso)
  REFERENCES tbl_seguridad_ingreso(ide_seguridad_ingreso);

-- =========================
-- 4) Sensores de plataforma
-- =========================
CREATE TABLE IF NOT EXISTS tbl_sensor_plataforma (
  ide_sensor_plataforma   bigserial PRIMARY KEY,
  ide_visita_planta       bigint NOT NULL REFERENCES tbl_visita_planta(ide_visita_planta),
  fec_ingreso_plataforma  timestamptz NOT NULL,
  fec_salida_plataforma   timestamptz,
  des_origen_sensor       varchar(60), -- opcional: nombre/código de sensor

  CONSTRAINT chk_sensor_fechas
    CHECK (fec_salida_plataforma IS NULL OR fec_salida_plataforma >= fec_ingreso_plataforma)
);

-- Alertas 0..n asociadas a un evento de sensores
CREATE TABLE IF NOT EXISTS tbl_sensor_alerta (
  ide_sensor_alerta       bigserial PRIMARY KEY,
  ide_sensor_plataforma   bigint NOT NULL REFERENCES tbl_sensor_plataforma(ide_sensor_plataforma) ON DELETE CASCADE,
  des_alerta              varchar(220) NOT NULL,
  des_nivel               varchar(20) DEFAULT 'INFO',
  fec_alerta              timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT chk_alerta_nivel
    CHECK (des_nivel IN ('INFO','WARN','CRIT'))
);

-- =========================
-- 5) Cámara OCR
-- =========================
CREATE TABLE IF NOT EXISTS tbl_captura_ocr (
  ide_captura_ocr         bigserial PRIMARY KEY,
  ide_visita_planta       bigint NOT NULL REFERENCES tbl_visita_planta(ide_visita_planta),
  des_placa_detectada     varchar(12) NOT NULL,
  fec_evento              timestamptz NOT NULL,
  num_confianza_pct       numeric(5,2) NOT NULL,
  bin_imagen              bytea,          -- almacena bytes de imagen
  des_ruta_imagen         text,           -- alternativa/extra: si guardas en disco/blob storage
  des_fuente              varchar(60),    -- cámara/posición (opcional)

  CONSTRAINT chk_confianza
    CHECK (num_confianza_pct >= 0 AND num_confianza_pct <= 100)
);

-- =========================
-- 6) Pesajes (balanza)
-- =========================
CREATE TABLE IF NOT EXISTS tbl_pesaje (
  ide_pesaje              bigserial PRIMARY KEY,
  ide_visita_planta       bigint NOT NULL REFERENCES tbl_visita_planta(ide_visita_planta),
  num_peso_kg             numeric(12,3) NOT NULL,
  fec_evento              timestamptz NOT NULL,
  ide_usuario_intervino   bigint REFERENCES tbl_usuario(ide_usuario), -- opcional
  ide_balanza             bigint NOT NULL REFERENCES tbl_balanza(ide_balanza),
  des_estabilidad         varchar(20) NOT NULL,
  des_tipo_pesaje         varchar(20) NOT NULL DEFAULT 'INTERNO',

  CONSTRAINT chk_tipo_pesaje
    CHECK (des_tipo_pesaje IN ('ENTRADA','SALIDA','INTERNO')),

  CONSTRAINT chk_estabilidad
    CHECK (des_estabilidad IN ('ESTABLE','INESTABLE','DESCONOCIDA')),

  CONSTRAINT chk_peso
    CHECK (num_peso_kg >= 0)
);

-- =========================
-- 7) Índices recomendados
-- =========================

-- búsquedas por placa
CREATE INDEX IF NOT EXISTS idx_camion_placa
  ON tbl_camion (des_placa);

-- por visita y fecha
CREATE INDEX IF NOT EXISTS idx_visita_ingreso
  ON tbl_visita_planta (fec_ingreso_planta);

-- pesajes por visita y tipo/fecha
CREATE INDEX IF NOT EXISTS idx_pesaje_visita_tipo_fecha
  ON tbl_pesaje (ide_visita_planta, des_tipo_pesaje, fec_evento);

-- OCR por visita/fecha y placa detectada
CREATE INDEX IF NOT EXISTS idx_ocr_visita_fecha
  ON tbl_captura_ocr (ide_visita_planta, fec_evento);

CREATE INDEX IF NOT EXISTS idx_ocr_placa_detectada
  ON tbl_captura_ocr (des_placa_detectada);

-- sensores por visita/fecha
CREATE INDEX IF NOT EXISTS idx_sensor_visita_fecha
  ON tbl_sensor_plataforma (ide_visita_planta, fec_ingreso_plataforma);