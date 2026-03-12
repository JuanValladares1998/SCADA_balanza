import React from "react";

interface FormBloqueProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    initialValues?: any;
}

const FormBloque: React.FC<FormBloqueProps> = ({ onSubmit, onCancel, initialValues }) => {
    const [values, setValues] = React.useState({
        ide_tipo_componente: initialValues?.ide_tipo_componente || 1,
        ide_bloque_padre: initialValues?.ide_bloque_padre || "",
        des_clave_referencia: initialValues?.des_clave_referencia || "",
        num_pos_x: initialValues?.num_pos_x || 0,
        num_pos_y: initialValues?.num_pos_y || 0,
        num_rotacion_deg: initialValues?.num_rotacion_deg || 0,
        num_escala_x: initialValues?.num_escala_x || 1,
        num_escala_y: initialValues?.num_escala_y || 1,
        num_z_index: initialValues?.num_z_index || 0,
        flg_bloqueado: initialValues?.flg_bloqueado ?? false,
        flg_visible: initialValues?.flg_visible ?? true,
        des_etiqueta: initialValues?.des_etiqueta || "",
        jsn_prop_instancia: initialValues?.jsn_prop_instancia || "{}",
        est_registro: initialValues?.est_registro ?? true,
        usu_registro: initialValues?.usu_registro || 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target;
        setValues((v) => ({
            ...v,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold">Bloque</h3>
            <div>
                <label className="block text-sm font-medium">Tipo componente</label>
                <input
                    type="number"
                    name="ide_tipo_componente"
                    value={values.ide_tipo_componente}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded px-2 py-1"
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Bloque padre (id)</label>
                <input
                    name="ide_bloque_padre"
                    value={values.ide_bloque_padre}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded px-2 py-1"
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Clave referencia</label>
                <input
                    name="des_clave_referencia"
                    value={values.des_clave_referencia}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded px-2 py-1"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Pos X</label>
                    <input
                        type="number"
                        step="0.01"
                        name="num_pos_x"
                        value={values.num_pos_x}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Pos Y</label>
                    <input
                        type="number"
                        step="0.01"
                        name="num_pos_y"
                        value={values.num_pos_y}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-2 py-1"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Rotación (deg)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="num_rotacion_deg"
                        value={values.num_rotacion_deg}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Escala X</label>
                    <input
                        type="number"
                        step="0.0001"
                        name="num_escala_x"
                        value={values.num_escala_x}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-2 py-1"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Escala Y</label>
                    <input
                        type="number"
                        step="0.0001"
                        name="num_escala_y"
                        value={values.num_escala_y}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Z-index</label>
                    <input
                        type="number"
                        name="num_z_index"
                        value={values.num_z_index}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-2 py-1"
                    />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="flg_bloqueado"
                    checked={values.flg_bloqueado}
                    onChange={handleChange}
                    id="bloq-lock"
                />
                <label htmlFor="bloq-lock" className="text-sm">Bloqueado</label>
                <input
                    type="checkbox"
                    name="flg_visible"
                    checked={values.flg_visible}
                    onChange={handleChange}
                    id="bloq-vis"
                />
                <label htmlFor="bloq-vis" className="text-sm">Visible</label>
            </div>
            <div>
                <label className="block text-sm font-medium">Etiqueta</label>
                <input
                    name="des_etiqueta"
                    value={values.des_etiqueta}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded px-2 py-1"
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Propiedades (JSON)</label>
                <textarea
                    name="jsn_prop_instancia"
                    value={values.jsn_prop_instancia}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded px-2 py-1 h-24"
                />
            </div>
            {/* <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="est_registro"
                    checked={values.est_registro}
                    onChange={handleChange}
                    id="bloq-est"
                />
                <label htmlFor="bloq-est" className="text-sm">Registro activo</label>
            </div>
            <div>
                <label className="block text-sm font-medium">Usuario registro</label>
                <input
                    type="number"
                    name="usu_registro"
                    value={values.usu_registro}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded px-2 py-1"
                />
            </div> */}
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">
                    Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Guardar
                </button>
            </div>
        </form>
    );
};

export default FormBloque;
