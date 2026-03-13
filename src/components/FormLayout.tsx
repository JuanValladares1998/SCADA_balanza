import React from "react";

interface FormLayoutProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    initialValues?: any;
}

const FormLayout: React.FC<FormLayoutProps> = ({ onSubmit, onCancel, initialValues }) => {
    const [values, setValues] = React.useState({
        des_nombre: initialValues?.des_nombre || "",
        des_descripcion: initialValues?.des_descripcion || "",
        num_ancho_lienzo: initialValues?.num_ancho_lienzo || 1920,
        num_alto_lienzo: initialValues?.num_alto_lienzo || 1080,
        url_fondo: initialValues?.url_fondo || "",
        est_registro: initialValues?.est_registro ?? true,
        usu_registro: initialValues?.usu_registro || 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;
        const checked = target.checked;
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
            <h3 className="text-lg font-semibold">Layout</h3>
            <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input
                    name="des_nombre"
                    value={values.des_nombre}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border rounded px-2 py-1"
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Descripción</label>
                <textarea
                    name="des_descripcion"
                    value={values.des_descripcion}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded px-2 py-1"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Ancho lienzo</label>
                    <input
                        type="number"
                        name="num_ancho_lienzo"
                        value={values.num_ancho_lienzo}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Alto lienzo</label>
                    <input
                        type="number"
                        name="num_alto_lienzo"
                        value={values.num_alto_lienzo}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-2 py-1"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium">URL fondo</label>
                <input
                    name="url_fondo"
                    value={values.url_fondo}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded px-2 py-1"
                />
            </div>
            {/* <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="est_registro"
                    checked={values.est_registro}
                    onChange={handleChange}
                    id="lay-est"
                />
                <label htmlFor="lay-est" className="text-sm">Registro activo</label>
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

export default FormLayout;
