/* ============================================================
   CREACIÓN COMPLETA DE BD: automatizacion_db (SQL Server)
   Modelo SCADA Layout Editor - ARQUITECTURA DE PLANTILLAS
   ** VERSIÓN OPTIMIZADA (INT, VARCHAR) + RENOMBRAMIENTO A cat_ **
   ============================================================ */

IF DB_ID(N'automatizacion_db') IS NULL
BEGIN
    CREATE DATABASE automatizacion_db;
END
GO

USE automatizacion_db;
GO
SET NOCOUNT ON;
GO

/* ============================================================
   1) LIMPIEZA (DROP)
   ============================================================ */
IF OBJECT_ID('dbo.rel_almacen_bloque_tag', 'U') IS NOT NULL DROP TABLE dbo.rel_almacen_bloque_tag;
IF OBJECT_ID('dbo.rel_almacen_bloque_equipo', 'U') IS NOT NULL DROP TABLE dbo.rel_almacen_bloque_equipo;
IF OBJECT_ID('dbo.rel_almacen_layout', 'U') IS NOT NULL DROP TABLE dbo.rel_almacen_layout;

IF OBJECT_ID('dbo.cat_bloque', 'U') IS NOT NULL DROP TABLE dbo.cat_bloque;
IF OBJECT_ID('dbo.cat_equipo', 'U') IS NOT NULL DROP TABLE dbo.cat_equipo;
IF OBJECT_ID('dbo.cat_layout', 'U') IS NOT NULL DROP TABLE dbo.cat_layout;

IF OBJECT_ID('dbo.cat_tag', 'U') IS NOT NULL DROP TABLE dbo.cat_tag;
IF OBJECT_ID('dbo.cat_tipo_componente', 'U') IS NOT NULL DROP TABLE dbo.cat_tipo_componente;
IF OBJECT_ID('dbo.cat_almacen', 'U') IS NOT NULL DROP TABLE dbo.cat_almacen;
GO

/* ============================================================
   2) TABLAS - CATÁLOGOS BASE
   ============================================================ */

CREATE TABLE dbo.cat_almacen (
    ide_almacen           INT IDENTITY(1,1) NOT NULL,
    des_nombre            NVARCHAR(100) NOT NULL,
    des_descripcion       VARCHAR(200) NULL, 
    
    est_registro          BIT NOT NULL CONSTRAINT df_cat_alm_est DEFAULT 1,
    fec_registro          DATETIME2(0) NOT NULL CONSTRAINT df_cat_alm_fec_reg DEFAULT SYSDATETIME(),
    usu_registro          INT NOT NULL,
    
    CONSTRAINT pk_cat_almacen PRIMARY KEY CLUSTERED (ide_almacen),
    CONSTRAINT uq_cat_almacen_des_nombre UNIQUE (des_nombre)
);
GO

CREATE TABLE dbo.cat_tipo_componente (
    ide_tipo_componente    INT IDENTITY(1,1) NOT NULL,
    cod_tipo_componente    VARCHAR(50) NULL,
    des_nombre             NVARCHAR(100) NOT NULL,
    des_categoria          VARCHAR(50) NULL,
    
    des_tipo_forma         VARCHAR(20) NOT NULL, 
    jsn_forma              NVARCHAR(MAX) NOT NULL,
    jsn_prop_defecto       NVARCHAR(MAX) NOT NULL CONSTRAINT df_cat_tc_prop DEFAULT (N'{}'),
    
    est_registro          BIT NOT NULL CONSTRAINT df_cat_tc_est DEFAULT 1,
    fec_registro          DATETIME2(0) NOT NULL CONSTRAINT df_cat_tc_fec_reg DEFAULT SYSDATETIME(),
    usu_registro          INT NOT NULL,
    
    CONSTRAINT pk_cat_tipo_componente PRIMARY KEY CLUSTERED (ide_tipo_componente),
    CONSTRAINT uq_cat_tipo_componente_cod UNIQUE (cod_tipo_componente),
    CONSTRAINT ck_cat_tc_jsn_forma CHECK (ISJSON(jsn_forma) = 1),
    CONSTRAINT ck_cat_tc_jsn_prop CHECK (ISJSON(jsn_prop_defecto) = 1)
);
GO

CREATE TABLE dbo.cat_tag (
    ide_tag               INT IDENTITY(1,1) NOT NULL,
    cod_tag               VARCHAR(80) NOT NULL,
    des_nombre            NVARCHAR(120) NULL,
    des_tipo_dato         VARCHAR(20) NOT NULL,
    des_fuente            VARCHAR(30) NULL,
    des_direccion         VARCHAR(255) NULL,
    jsn_metadata          NVARCHAR(MAX) NOT NULL CONSTRAINT df_cat_tag_meta DEFAULT (N'{}'),
    
    est_registro          BIT NOT NULL CONSTRAINT df_cat_tag_est DEFAULT 1,
    fec_registro          DATETIME2(0) NOT NULL CONSTRAINT df_cat_tag_fec_reg DEFAULT SYSDATETIME(),
    usu_registro          INT NOT NULL,
    
    CONSTRAINT pk_cat_tag PRIMARY KEY CLUSTERED (ide_tag),
    CONSTRAINT uq_cat_tag_cod UNIQUE (cod_tag),
    CONSTRAINT ck_cat_tag_jsn_metadata CHECK (ISJSON(jsn_metadata) = 1)
);
GO

/* ============================================================
   3) TABLAS - PLANTILLAS Y EQUIPOS (AHORA CATÁLOGOS)
   ============================================================ */

CREATE TABLE dbo.cat_equipo (
    ide_equipo             INT IDENTITY(1,1) NOT NULL,
    ide_almacen            INT NOT NULL,
    ide_tipo_componente    INT NOT NULL,
    cod_equipo             VARCHAR(50) NOT NULL,
    des_nombre             NVARCHAR(100) NULL,
    des_estado             VARCHAR(30) NULL,
    jsn_configuracion      NVARCHAR(MAX) NOT NULL CONSTRAINT df_cat_eq_conf DEFAULT (N'{}'),
    
    est_registro          BIT NOT NULL CONSTRAINT df_cat_eq_est DEFAULT 1,
    fec_registro          DATETIME2(0) NOT NULL CONSTRAINT df_cat_eq_fec_reg DEFAULT SYSDATETIME(),
    usu_registro          INT NOT NULL,
    
    CONSTRAINT pk_cat_equipo PRIMARY KEY CLUSTERED (ide_equipo),
    CONSTRAINT fk_cat_eq_almacen FOREIGN KEY (ide_almacen) REFERENCES dbo.cat_almacen(ide_almacen),
    CONSTRAINT fk_cat_eq_tipo_comp FOREIGN KEY (ide_tipo_componente) REFERENCES dbo.cat_tipo_componente(ide_tipo_componente),
    CONSTRAINT uq_cat_eq_cod UNIQUE (cod_equipo),
    CONSTRAINT ck_cat_eq_jsn CHECK (ISJSON(jsn_configuracion) = 1)
);
GO

CREATE TABLE dbo.cat_layout (
    ide_layout            INT IDENTITY(1,1) NOT NULL,
    des_nombre            NVARCHAR(100) NOT NULL,
    des_descripcion       VARCHAR(200) NULL,
    num_ancho_lienzo      SMALLINT NOT NULL CONSTRAINT df_cat_lay_w DEFAULT (1920),
    num_alto_lienzo       SMALLINT NOT NULL CONSTRAINT df_cat_lay_h  DEFAULT (1080),
    url_fondo             VARCHAR(255) NULL,
    
    est_registro          BIT NOT NULL CONSTRAINT df_cat_lay_est DEFAULT 1,
    fec_registro          DATETIME2(0) NOT NULL CONSTRAINT df_cat_lay_fec_reg DEFAULT SYSDATETIME(),
    usu_registro          INT NOT NULL,
    
    CONSTRAINT pk_cat_layout PRIMARY KEY CLUSTERED (ide_layout),
    CONSTRAINT uq_cat_lay_des UNIQUE (des_nombre)
);
GO

CREATE TABLE dbo.cat_bloque (
    ide_bloque             INT IDENTITY(1,1) NOT NULL,
    ide_layout             INT NOT NULL,            
    ide_tipo_componente    INT NOT NULL,            
    ide_bloque_padre       INT NULL,                
    des_clave_referencia   VARCHAR(50) NULL,          
    num_pos_x              DECIMAL(8,2) NOT NULL CONSTRAINT df_cat_blo_x DEFAULT (0),
    num_pos_y              DECIMAL(8,2) NOT NULL CONSTRAINT df_cat_blo_y DEFAULT (0),
    num_rotacion_deg       DECIMAL(5,2) NOT NULL CONSTRAINT df_cat_blo_rot DEFAULT (0),
    num_escala_x           DECIMAL(6,4) NOT NULL CONSTRAINT df_cat_blo_sx DEFAULT (1),
    num_escala_y           DECIMAL(6,4) NOT NULL CONSTRAINT df_cat_blo_sy DEFAULT (1),
    num_z_index            SMALLINT NOT NULL CONSTRAINT df_cat_blo_z DEFAULT (0),
    
    flg_bloqueado          BIT NOT NULL CONSTRAINT df_cat_blo_lock DEFAULT (0),
    flg_visible            BIT NOT NULL CONSTRAINT df_cat_blo_vis DEFAULT (1),
    
    des_etiqueta           NVARCHAR(80) NULL,
    jsn_prop_instancia     NVARCHAR(MAX) NOT NULL CONSTRAINT df_cat_blo_prop DEFAULT (N'{}'),
    
    est_registro          BIT NOT NULL CONSTRAINT df_cat_blo_est DEFAULT 1,
    fec_registro          DATETIME2(0) NOT NULL CONSTRAINT df_cat_blo_fec_reg DEFAULT SYSDATETIME(),
    usu_registro          INT NOT NULL,
    
    CONSTRAINT pk_cat_bloque PRIMARY KEY CLUSTERED (ide_bloque),
    CONSTRAINT fk_cat_blo_lay FOREIGN KEY (ide_layout) REFERENCES dbo.cat_layout(ide_layout) ON DELETE CASCADE,
    CONSTRAINT fk_cat_blo_tc FOREIGN KEY (ide_tipo_componente) REFERENCES dbo.cat_tipo_componente(ide_tipo_componente),
    CONSTRAINT fk_cat_blo_padre FOREIGN KEY (ide_bloque_padre) REFERENCES dbo.cat_bloque(ide_bloque),
    CONSTRAINT ck_cat_blo_jsn CHECK (ISJSON(jsn_prop_instancia) = 1)
);
GO

/* ============================================================
   4) TABLAS - MAPEOS CONTEXTUALES
   ============================================================ */

CREATE TABLE dbo.rel_almacen_layout (
    ide_almacen_layout    INT IDENTITY(1,1) NOT NULL,
    ide_almacen           INT NOT NULL,
    ide_layout            INT NOT NULL,
    flg_principal         BIT NOT NULL CONSTRAINT df_rel_al_prin DEFAULT (0),
    
    est_registro          BIT NOT NULL CONSTRAINT df_rel_al_est DEFAULT 1,
    fec_registro          DATETIME2(0) NOT NULL CONSTRAINT df_rel_al_fec_reg DEFAULT SYSDATETIME(),
    usu_registro          INT NOT NULL,
    
    CONSTRAINT pk_rel_almacen_layout PRIMARY KEY CLUSTERED (ide_almacen_layout),
    CONSTRAINT fk_rel_al_alm FOREIGN KEY (ide_almacen) REFERENCES dbo.cat_almacen(ide_almacen) ON DELETE CASCADE,
    CONSTRAINT fk_rel_al_lay FOREIGN KEY (ide_layout) REFERENCES dbo.cat_layout(ide_layout) ON DELETE CASCADE,
    CONSTRAINT uq_rel_al_unico UNIQUE (ide_almacen, ide_layout)
);
GO

CREATE TABLE dbo.rel_almacen_bloque_equipo (
    ide_almacen_bloque_equipo INT IDENTITY(1,1) NOT NULL,
    ide_almacen               INT NOT NULL,
    ide_bloque                INT NOT NULL,
    ide_equipo                INT NOT NULL,
    
    est_registro          BIT NOT NULL CONSTRAINT df_rel_abe_est DEFAULT 1,
    fec_registro          DATETIME2(0) NOT NULL CONSTRAINT df_rel_abe_fec_reg DEFAULT SYSDATETIME(),
    usu_registro          INT NOT NULL,
    
    CONSTRAINT pk_rel_almacen_bloque_equipo PRIMARY KEY CLUSTERED (ide_almacen_bloque_equipo),
    CONSTRAINT fk_rel_abe_alm FOREIGN KEY (ide_almacen) REFERENCES dbo.cat_almacen(ide_almacen),
    CONSTRAINT fk_rel_abe_blo FOREIGN KEY (ide_bloque) REFERENCES dbo.cat_bloque(ide_bloque) ON DELETE CASCADE,
    CONSTRAINT fk_rel_abe_eq FOREIGN KEY (ide_equipo) REFERENCES dbo.cat_equipo(ide_equipo),
    CONSTRAINT uq_rel_abe_unico UNIQUE (ide_almacen, ide_bloque) 
);
GO

CREATE TABLE dbo.rel_almacen_bloque_tag (
    ide_almacen_bloque_tag INT IDENTITY(1,1) NOT NULL,
    ide_almacen            INT NOT NULL,
    ide_bloque             INT NOT NULL,
    ide_tag                INT NOT NULL,
    des_rol                VARCHAR(40) NOT NULL, 
    jsn_config             NVARCHAR(MAX) NOT NULL CONSTRAINT df_rel_abt_conf DEFAULT (N'{}'),
    
    est_registro          BIT NOT NULL CONSTRAINT df_rel_abt_est DEFAULT 1,
    fec_registro          DATETIME2(0) NOT NULL CONSTRAINT df_rel_abt_fec_reg DEFAULT SYSDATETIME(),
    usu_registro          INT NOT NULL,
    
    CONSTRAINT pk_rel_almacen_bloque_tag PRIMARY KEY CLUSTERED (ide_almacen_bloque_tag),
    CONSTRAINT fk_rel_abt_alm FOREIGN KEY (ide_almacen) REFERENCES dbo.cat_almacen(ide_almacen),
    CONSTRAINT fk_rel_abt_blo FOREIGN KEY (ide_bloque) REFERENCES dbo.cat_bloque(ide_bloque) ON DELETE CASCADE,
    CONSTRAINT fk_rel_abt_tag FOREIGN KEY (ide_tag) REFERENCES dbo.cat_tag(ide_tag),
    CONSTRAINT uq_rel_abt_unico UNIQUE (ide_almacen, ide_bloque, ide_tag, des_rol),
    CONSTRAINT ck_rel_abt_jsn CHECK (ISJSON(jsn_config) = 1)
);
GO