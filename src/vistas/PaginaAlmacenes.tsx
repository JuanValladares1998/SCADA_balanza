import React, { useState, useEffect } from "react";
import ModalDetalle from "../components/ModalDetalle";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import FormAlmacen from "../components/FormAlmacen";
import FormLayout from "../components/FormLayout";
import FormBloque from "../components/FormBloque";
import { Almacen, Layout, Bloque } from "../types/layouts";

const PaginaAlmacenes: React.FC = () => {
    const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
    const [layouts, setLayouts] = useState<Layout[]>([]);
    const [bloques, setBloques] = useState<Bloque[]>([]);
    const [detalle, setDetalle] = useState<{ title: string; data: any } | null>(null);

    const [selectedAlmacen, setSelectedAlmacen] = useState<Almacen | null>(null);
    const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);

    // form modal state (type indicates which form to show)
    const [formModal, setFormModal] = useState<'almacen'|'layout'|'bloque' | null>(null);

    const pageSize = 5;
    const [pageAlmacenes, setPageAlmacenes] = useState(1);
    const [pageLayouts, setPageLayouts] = useState(1);
    const [pageBloques, setPageBloques] = useState(1);

    const paginate = (items: any[], page: number) => {
        const start = (page - 1) * pageSize;
        return items.slice(start, start + pageSize);
    };

    const totalPages = (items: any[]) => Math.ceil(items.length / pageSize) || 1;

    useEffect(() => {
        // 1. Generar 20 Almacenes
        const almacenesData = Array.from({ length: 20 }, (_, i) => ({
            ide_almacen: i + 1,
            des_nombre: `Almacén ${i + 1}`,
            des_descripcion: `Sede logística principal sector ${String.fromCharCode(65 + (i % 26))}`
        }));

        // 2. Generar 3 Layouts por cada Almacén (Total: 60)
        const layoutsData: Layout[] = [];
        almacenesData.forEach((almacen) => {
            for (let j = 1; j <= 3; j++) {
                layoutsData.push({
                    ide_layout: layoutsData.length + 1,
                    ide_almacen: almacen.ide_almacen,
                    des_nombre: `Layout ${j} - ${almacen.des_nombre}`,
                    des_descripcion: `Plano de distribución fase ${j}`,
                    num_ancho_lienzo: 1920,
                    num_alto_lienzo: 1080
                });
            }
        });

        // 3. Generar 3 Bloques por cada Layout (Total: 180)
        const bloquesData: Bloque[] = [];
        layoutsData.forEach((layout) => {
            const tipos = ["Sensor", "Cámara", "Rack"];
            for (let k = 1; k <= 3; k++) {
                bloquesData.push({
                    ide_bloque: bloquesData.length + 1,
                    ide_layout: layout.ide_layout,
                    ide_tipo_componente: k, // Tipos 1, 2 y 3
                    des_etiqueta: `${tipos[k - 1]} ${k} (L${layout.ide_layout})`,
                    num_pos_x: 100 * k,
                    num_pos_y: 150 * k
                });
            }
        });

        // Seteo de estados
        setAlmacenes(almacenesData);
        setLayouts(layoutsData);
        setBloques(bloquesData);
    }, []);

    const verDetalle = (title: string, data: any) => {
        setDetalle({ title, data });
    };

    const filteredLayouts = () => {
        if (!selectedAlmacen) return [];
        return layouts.filter((l) => l.ide_almacen === selectedAlmacen.ide_almacen);
    };

    const filteredBloques = () => {
        if (!selectedLayout) return [];
        return bloques.filter((b) => b.ide_layout === selectedLayout.ide_layout);
    };

    const cerrarDetalle = () => setDetalle(null);
    const abrirForm = (tipo: 'almacen'|'layout'|'bloque') => {
        setFormModal(tipo);
    };
    const cerrarForm = () => setFormModal(null);

    const handleCreateAlmacen = (data: any) => {
        const nuevo: Almacen = {
            ide_almacen: almacenes.length + 1,
            des_nombre: data.des_nombre || `Almacén ${almacenes.length + 1}`,
            des_descripcion: data.des_descripcion || "",
            est_registro: data.est_registro,
            usu_registro: data.usu_registro
        };
        setAlmacenes((prev) => [nuevo, ...prev]);
        cerrarForm();
    };

    const handleCreateLayout = (data: any) => {
        if (!selectedAlmacen) return;
        const nuevo: Layout = {
            ide_layout: layouts.length + 1,
            ide_almacen: selectedAlmacen.ide_almacen,
            des_nombre: data.des_nombre || `Layout ${layouts.length + 1}`,
            des_descripcion: data.des_descripcion || "",
            num_ancho_lienzo: data.num_ancho_lienzo || 0,
            num_alto_lienzo: data.num_alto_lienzo || 0,
            url_fondo: data.url_fondo,
            est_registro: data.est_registro,
            usu_registro: data.usu_registro
        };
        setLayouts((prev) => [nuevo, ...prev]);
        cerrarForm();
    };

    const handleCreateBloque = (data: any) => {
        if (!selectedLayout) return;
        const nuevo: Bloque = {
            ide_bloque: bloques.length + 1,
            ide_layout: selectedLayout.ide_layout,
            ide_tipo_componente: data.ide_tipo_componente || 1,
            ide_bloque_padre: data.ide_bloque_padre || undefined,
            des_clave_referencia: data.des_clave_referencia || undefined,
            num_pos_x: data.num_pos_x || 0,
            num_pos_y: data.num_pos_y || 0,
            num_rotacion_deg: data.num_rotacion_deg || 0,
            num_escala_x: data.num_escala_x || 1,
            num_escala_y: data.num_escala_y || 1,
            num_z_index: data.num_z_index || 0,
            flg_bloqueado: data.flg_bloqueado,
            flg_visible: data.flg_visible,
            des_etiqueta: data.des_etiqueta || undefined,
            jsn_prop_instancia: data.jsn_prop_instancia || "{}",
            est_registro: data.est_registro,
            usu_registro: data.usu_registro
        };
        setBloques((prev) => [nuevo, ...prev]);
        cerrarForm();
    };
    return (
        <main className="p-4 h-screen flex flex-col gap-4 bg-white">
            <header className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold scada-text-primary tracking-tight">
                    Layouts del sistema
                </h1>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-auto">
                {/* almacenes column */}
                <div className="border border-gray-300 rounded p-4 flex flex-col bg-white">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold">Almacenes</h2>
                        <button
                            title="agregar almacén"
                            className="text-secondary hover:text-secondary-dark text-lg p-2"
                            onClick={() => abrirForm('almacen')}
                        >
                            <i className="ph ph-plus h-6 w-6"></i>
                        </button>
                    </div>
                    {almacenes.length === 0 && <p>No hay almacenes.</p>}
                    {paginate(almacenes, pageAlmacenes).map((a) => (
                        <div
                            key={`${a.ide_almacen}-${pageAlmacenes}`}
                            className={`border border-gray-300 rounded p-2 mb-2 cursor-pointer bg-white hover:bg-gray-50 ${selectedAlmacen?.ide_almacen === a.ide_almacen ? "bg-blue-100" : ""
                                }`}
                            onClick={() => {
                                setSelectedAlmacen(a);
                                setSelectedLayout(null);
                                setPageLayouts(1);
                                setPageBloques(1);
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <strong className="text-lg">{a.des_nombre}</strong>
                                <button
                                    title="Ver detalle"
                                    onClick={(e) => { e.stopPropagation(); verDetalle("Almacén", a); }}
                                    className="text-secondary hover:text-secondary-dark text-lg flex items-center p-2"
                                >
                                    <i className="ph ph-eye h-8 w-8"></i>
                                </button>
                            </div>
                            {a.des_descripcion && (
                                <p className="text-sm text-gray-600 mt-1">{a.des_descripcion}</p>
                            )}
                        </div>
                    ))}
                    <Pagination
                        current={pageAlmacenes}
                        total={totalPages(almacenes)}
                        pageSize={pageSize}
                        onChange={setPageAlmacenes}
                    />
                </div>

                {/* layouts column */}
                <div className="border border-gray-300 rounded p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold">Layouts</h2>
                        <button
                            title="agregar layout"
                            className="text-secondary hover:text-secondary-dark text-lg p-2"
                            onClick={() => abrirForm('layout')}
                        >
                            <i className="ph ph-plus h-6 w-6"></i>
                        </button>
                    </div>
                    {filteredLayouts().length === 0 && <p>No hay layouts. Selecciona un almacén.</p>}
                    {paginate(filteredLayouts(), pageLayouts).map((l) => (
                        <div
                            key={l.ide_layout}
                            className={`border border-gray-300 rounded p-2 mb-2 cursor-pointer bg-gray-50 hover:bg-gray-100 ${selectedLayout?.ide_layout === l.ide_layout ? "bg-blue-100" : ""
                                }`}
                            onClick={() => {
                                setSelectedLayout(l);
                                setPageBloques(1);
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <strong className="text-lg">{l.des_nombre}</strong>
                                <button
                                    title="ver detalle"
                                    onClick={(e) => { e.stopPropagation(); verDetalle("Layout", l); }}
                                    className="text-secondary hover:text-secondary-dark text-lg flex items-center p-2"
                                >
                                    <i className="ph ph-eye h-8 w-8"></i>
                                </button>
                            </div>
                            {l.des_descripcion && (
                                <p className="text-sm text-gray-600 mt-1">{l.des_descripcion}</p>
                            )}
                        </div>
                    ))}
                    <Pagination
                        current={pageLayouts}
                        total={totalPages(filteredLayouts())}
                        pageSize={pageSize}
                        onChange={setPageLayouts}
                    />
                </div>

                {/* bloques column */}
                <div className="border border-gray-300 rounded p-4 flex flex-col bg-white">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold">Bloques</h2>
                        <button
                            title="agregar bloque"
                            className="text-secondary hover:text-secondary-dark text-lg p-2"
                            onClick={() => abrirForm('bloque')}
                        >
                            <i className="ph ph-plus h-6 w-6"></i>
                        </button>
                    </div>
                    {filteredBloques().length === 0 && <p>No hay bloques. Selecciona un layout.</p>}
                    {paginate(filteredBloques(), pageBloques).map((b) => (
                        <div
                            key={b.ide_bloque}
                            className="border border-gray-300 rounded p-2 mb-2 cursor-pointer bg-white hover:bg-gray-50"
                            onClick={() => verDetalle("Bloque", b)}
                        >
                            <div className="flex justify-between items-center">
                                <strong className="text-lg">{b.des_etiqueta || `#${b.ide_bloque}`}</strong>
                                <button
                                    title="ver detalle"
                                    onClick={(e) => { e.stopPropagation(); verDetalle("Bloque", b); }}
                                    className="text-secondary hover:text-secondary-dark text-lg flex items-center p-2"
                                >
                                    <i className="ph ph-eye h-8 w-8"></i>
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                Pos: {b.num_pos_x},{b.num_pos_y}
                            </p>
                        </div>
                    ))}
                    <Pagination
                        current={pageBloques}
                        total={totalPages(filteredBloques())}
                        pageSize={pageSize}
                        onChange={setPageBloques}
                    />
                </div>
            </section>

            <ModalDetalle
                visible={!!detalle}
                title={detalle?.title || ""}
                data={detalle?.data || null}
                onClose={cerrarDetalle}
            />

            <Modal visible={!!formModal} title={formModal ? `Nuevo ${formModal}` : ""} onClose={cerrarForm}>
                {formModal === 'almacen' && (
                    <FormAlmacen onSubmit={handleCreateAlmacen} onCancel={cerrarForm} />
                )}
                {formModal === 'layout' && (
                    <FormLayout onSubmit={handleCreateLayout} onCancel={cerrarForm} />
                )}
                {formModal === 'bloque' && (
                    <FormBloque onSubmit={handleCreateBloque} onCancel={cerrarForm} />
                )}
            </Modal>
        </main>
    );
};

export default PaginaAlmacenes;
