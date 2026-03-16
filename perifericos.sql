-- =============================================================================
-- 1. TABLAS PARA BALANZA TOLEDO METTLER IND560PDX
-- =============================================================================

-- Catálogo de celdas PDX (pueden ser hasta 14)
CREATE TABLE cat_balanza_celdas (
    id_celda INT PRIMARY KEY IDENTITY(1,1),
    id_dispositivo INT, -- FK a cat_dispositivos
    num_celda_index INT, -- Posición de la celda (1, 2, 3...)
    des_serie VARCHAR(50),
    CONSTRAINT FK_Balanza_Celda FOREIGN KEY (id_dispositivo) REFERENCES cat_dispositivos(id_dispositivo)
);

-- Telemetría de la Balanza (Peso, Estabilidad, Salud de Red)
CREATE TABLE tbl_balanza_telemetria (
    id_telemetria BIGINT PRIMARY KEY IDENTITY(1,1),
    id_dispositivo INT,
    fec_registro DATETIME DEFAULT GETDATE(),
    num_peso_bruto DECIMAL(18,2),
    bit_estable BIT,           -- Motion: 1=Estable, 0=Inestable
    bit_zero BIT,              -- Estado de Cero
    bit_overload BIT,          -- Alarma de sobrecarga
    num_voltaje_red_pdx DECIMAL(18,2),
    des_codigo_error VARCHAR(10),
    CONSTRAINT FK_Balanza_Telemetria FOREIGN KEY (id_dispositivo) REFERENCES cat_dispositivos(id_dispositivo)
);

-- Diagnóstico por Celda (Carga individual y salud del sello hermético)
CREATE TABLE rel_balanza_celdas_status (
    id_status BIGINT PRIMARY KEY IDENTITY(1,1),
    id_celda INT,
    fec_registro DATETIME DEFAULT GETDATE(),
    num_porcentaje_carga DECIMAL(5,2),
    num_voltaje_mv DECIMAL(10,4),
    bit_breach_seal BIT,       -- Integridad del encapsulado (0=OK, 1=Humedad/Fallo)
    CONSTRAINT FK_Celda_Status FOREIGN KEY (id_celda) REFERENCES cat_balanza_celdas(id_celda)
);

-- =============================================================================
-- 2. TABLAS PARA UPS CYBERPOWER OL3000RTXL2U
-- =============================================================================

CREATE TABLE tbl_ups_telemetria (
    id_telemetria BIGINT PRIMARY KEY IDENTITY(1,1),
    id_dispositivo INT,
    fec_registro DATETIME DEFAULT GETDATE(),
    des_modo_operacion VARCHAR(20), -- En línea, Batería, Bypass
    num_voltaje_entrada DECIMAL(10,2),
    num_voltaje_salida DECIMAL(10,2),
    num_frecuencia_hz DECIMAL(10,2),
    num_carga_porcentaje INT,
    num_bateria_capacidad INT,      -- 0-100%
    num_autonomia_minutos INT,
    num_temperatura_interna DECIMAL(5,2),
    bit_alarma_fallo BIT,
    CONSTRAINT FK_Ups_Telemetria FOREIGN KEY (id_dispositivo) REFERENCES cat_dispositivos(id_dispositivo)
);

-- =============================================================================
-- 3. TABLAS PARA SWITCH INDUSTRIAL IES-3242GC-E
-- =============================================================================

CREATE TABLE tbl_switch_telemetria (
    id_telemetria BIGINT PRIMARY KEY IDENTITY(1,1),
    id_dispositivo INT,
    fec_registro DATETIME DEFAULT GETDATE(),
    num_uptime_segundos BIGINT,
    num_cpu_uso INT,
    num_temperatura_c DECIMAL(5,2),
    bit_pwr1_fail BIT,
    bit_pwr2_fail BIT,
    bit_ring_fault BIT, -- Falla en el anillo de redundancia
    CONSTRAINT FK_Switch_Telemetria FOREIGN KEY (id_dispositivo) REFERENCES cat_dispositivos(id_dispositivo)
);

-- Detalle de puertos para detectar caídas de cámaras o sensores
CREATE TABLE rel_switch_puertos (
    id_puerto_status BIGINT PRIMARY KEY IDENTITY(1,1),
    id_dispositivo INT,
    num_puerto INT,
    bit_link_up BIT,
    num_trafico_mbps DECIMAL(10,2),
    num_errores_paquetes INT,
    CONSTRAINT FK_Switch_Puertos FOREIGN KEY (id_dispositivo) REFERENCES cat_dispositivos(id_dispositivo)
);

-- =============================================================================
-- 4. TABLAS PARA SENSORES IR TAKEX Y CÁMARA SURVISION
-- =============================================================================

-- Sensores IR (Presencia y Sabotaje)
CREATE TABLE tbl_sensor_ir_telemetria (
    id_telemetria BIGINT PRIMARY KEY IDENTITY(1,1),
    id_dispositivo INT,
    fec_registro DATETIME DEFAULT GETDATE(),
    bit_deteccion_activa BIT,
    bit_tamper_alarma BIT,      -- Sabotaje
    bit_haz_atenuado BIT,       -- Lente sucio o desalineado
    num_voltaje_alimentacion DECIMAL(5,2),
    CONSTRAINT FK_Ir_Telemetria FOREIGN KEY (id_dispositivo) REFERENCES cat_dispositivos(id_dispositivo)
);

-- Cámara LPR Survision (Reconocimiento y Salud)
CREATE TABLE tbl_camara_lpr_telemetria (
    id_telemetria BIGINT PRIMARY KEY IDENTITY(1,1),
    id_dispositivo INT,
    fec_registro DATETIME DEFAULT GETDATE(),
    num_confianza_promedio INT, -- % de éxito de lecturas
    num_temperatura_interna DECIMAL(5,2),
    num_fps_procesados INT,
    des_modo_dia_noche VARCHAR(10),
    num_consumo_watts DECIMAL(5,2),
    CONSTRAINT FK_Camara_Telemetria FOREIGN KEY (id_dispositivo) REFERENCES cat_dispositivos(id_dispositivo)
);