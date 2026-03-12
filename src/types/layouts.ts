export interface Almacen {
  ide_almacen: number;
  des_nombre: string;
  des_descripcion?: string;
  est_registro?: boolean;
  fec_registro?: string;
  usu_registro?: number;
}

export interface Layout {
  ide_layout: number;
  ide_almacen?: number; // relación opcional con almacén
  des_nombre: string;
  des_descripcion?: string;
  num_ancho_lienzo?: number;
  num_alto_lienzo?: number;
  url_fondo?: string;
  est_registro?: boolean;
  fec_registro?: string;
  usu_registro?: number;
}

export interface Bloque {
  ide_bloque: number;
  ide_layout: number;
  ide_tipo_componente: number;
  ide_bloque_padre?: number;
  des_clave_referencia?: string;
  num_pos_x?: number;
  num_pos_y?: number;
  num_rotacion_deg?: number;
  num_escala_x?: number;
  num_escala_y?: number;
  num_z_index?: number;
  flg_bloqueado?: boolean;
  flg_visible?: boolean;
  des_etiqueta?: string;
  jsn_prop_instancia?: string;
  est_registro?: boolean;
  fec_registro?: string;
  usu_registro?: number;
}