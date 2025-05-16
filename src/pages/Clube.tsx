import { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-hot-toast';

import type { ClubeDetails } from '../types/Clube';
import { ClubeService } from '../services/ClubeService';

const INITIAL_FORM = {
  nome: '',
  emblema: null as File | null,
};

const Home = () => {

  const [clubes, setClubes] = useState<ClubeDetails[]>([]);
  const [form, setForm] = useState(INITIAL_FORM);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const buscarClubes = async () => {
      const response = await ClubeService.getAllDetails();
      setClubes(response);
    };

    buscarClubes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('nome', form.nome);
    if (form.emblema) {
      formData.append('emblema', form.emblema);
    }

    try {
      const response = await ClubeService.create(formData);
      toast.success('Clube cadastrado com sucesso!');
      setForm(INITIAL_FORM);
      setClubes((prev) => ([...prev, response]));
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (selectedId === null) return;
    try {
      await ClubeService.delete(selectedId);
      setClubes(clubes
        .filter(c => c.id !== selectedId));
      toast.success('Clube excluído com sucesso!');
    } catch (error: any) {
      console.error("Erro ao excluir:", error);
    } finally {
      setSelectedId(null);
      setShowModal(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        emblema: file,
      }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'image/png') {
      setForm(prev => ({
        ...prev,
        emblema: file,
      }));
    }
  };


  return (
    <div className="flex gap-4 h-full overflow-hidden">
      <div className="w-4/5 bg-secondary p-4 rounded-xl shadow-md flex flex-col">
        <h2 className="text-lg font-bold mb-2 text-accent">Lista de Clubes</h2>
        <div className="overflow-y-auto rounded-b-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-primary sticky top-0 bg-secondary">
                <th className='text-contrast pl-2'></th>
                <th className='text-contrast text-center'>NOME</th>
                <th className='text-contrast text-center'></th>
              </tr>
            </thead>
            <tbody>
              {clubes.map((c, i) => (
                <tr key={i} className="border-b border-primary">
                  <td className='text-lightgray pl-2 py-2 w-20'>
                    <img
                      src={`data:image/png;base64,${c.emblema}`}
                      alt="Emblema"
                      className="h-12 w-12 object-contain mx-auto"
                    />
                  </td>
                  <td className="text-lightgray text-center">{c.nome}</td>
                  <td className="text-center">
                    <FaTrash
                      className="text-red-500 cursor-pointer hover:text-red-700 inline"
                      onClick={() => confirmDelete(c.id)}
                      title="Excluir"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-1/5 bg-secondary p-4 rounded-xl shadow-md max-h-fit">
        <h2 className="text-lg font-bold mb-4 text-accent">Novo Clube</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-lightgray">
          <input
            name="nome"
            type="text"
            placeholder="Nome do clube"
            value={form.nome}
            onChange={handleChange}
            className="p-2 rounded bg-inputBg placeholder-lightgray text-contrast
        focus:outline-none focus:ring-2 focus:ring-focusBorder hover:ring hover:ring-accent transition"
            required
          />

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="relative flex items-center justify-center border-2 border-dashed border-lightgray rounded-lg p-6 bg-inputBg text-lightgray hover:border-accent transition cursor-pointer"
          >
            <input
              type="file"
              accept="image/png"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center pointer-events-none">
              <p className="font-semibold text-sm">Arraste o emblema aqui</p>
              <p className="text-xs text-lightgray">ou clique para selecionar</p>
            </div>
          </div>

          {form.emblema && (
            <img
              src={URL.createObjectURL(form.emblema)}
              alt="Pré-visualização do Emblema"
              className="w-32 h-32 object-contain mx-auto rounded-lg"
            />
          )}

          <button
            type="submit"
            className="bg-primary mt-2 text-white py-2 rounded hover:bg-accent transition"
          >
            Salvar Clube
          </button>
        </form>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-secondary rounded-xl shadow-lg p-6 w-full max-w-sm text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-semibold mb-4  text-accent">Confirmar exclusão</h2>
              <p className="mb-6 text-lightgray">Tem certeza que deseja excluir este clube?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-lightgray text-primary rounded-md hover:bg-gray-400 transition"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-accent text-white rounded-md hover:bg-focusBorder transition"
                  onClick={handleDelete}
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
