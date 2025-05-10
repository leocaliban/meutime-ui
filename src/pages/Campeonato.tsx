import { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";

import axios from 'axios';
import type { Campeonato } from '../types/Campeonato';

const INITIAL_FORM = {
  nome: '',
  tipo: '',
  emblema: '',
};

const Home = () => {

  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [form, setForm] = useState(INITIAL_FORM);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const buscarCampeonatos = async () => {
      const response = await axios.get('http://localhost:8080/campeonatos');
      setCampeonatos(response.data);
    };

    buscarCampeonatos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nome: form.nome,
      tipo: form.tipo,
      emblema: form.emblema,
    };

    try {
      const response = await axios.post('http://localhost:8080/campeonatos', payload);
      const campeonatoNovo: Campeonato = response.data;
      alert('Campeonato cadastrado com sucesso!');
      setForm(INITIAL_FORM);
      setCampeonatos((prev) => ([...prev, campeonatoNovo]));
    } catch (error) {
      alert('Erro ao cadastrar campeonato');
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
      await axios.delete(`http://localhost:8080/campeonatos/${selectedId}`);
      setCampeonatos(campeonatos
        .filter(c => c.id !== selectedId));
    } catch (error) {
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
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setForm(prev => ({
          ...prev,
          emblema: `${base64String}`,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'image/png') {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setForm(prev => ({
          ...prev,
          emblema: `${base64String}`,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  function getClasseCores(campeonatoId: number) {
    switch (campeonatoId) {
      case 1:
        return 'bg-one-primaryDark hover:bg-one-secondaryNormal';
      case 2:
        return 'bg-facup-primaryDark hover:bg-facup-secondaryNormal';
      default:
        return '';
    }
  };

  return (
    <div className="flex gap-4 h-full overflow-hidden">
      <div className="w-4/5 bg-secondary p-4 rounded-xl shadow-md flex flex-col">
        <h2 className="text-lg font-bold mb-2 text-accent">Lista de Campeonatos</h2>
        <div className="overflow-y-auto rounded-b-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-primary sticky top-0 bg-secondary">
                <th className='text-contrast  pl-2'></th>
                <th className='text-contrast text-center'>NOME</th>
                <th className='text-contrast text-center'>TIPO</th>
                <th className='text-contrast text-center'></th>
              </tr>
            </thead>
            <tbody>
              {campeonatos.map((c, i) => (
                <tr key={i} className={`border-b border-primary ${getClasseCores(c.id)}`}>
                  <td className='text-lightgray pl-2 w-20'>
                    <img
                      src={`data:image/png;base64,${c.emblema}`}
                      alt="Emblema"
                      className="h-10 w-10 object-contain mx-auto"
                    />
                  </td>
                  <td className='text-lightgray text-center'>{c.nome}</td>
                  <td className='text-lightgray text-center capitalize'>{c.tipo}</td>
                  <td className='text-lightgray text-center capitalize'>
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
        <h2 className="text-lg font-bold mb-4 text-accent">Novo Campeonato</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-lightgray">
          <input
            name="nome"
            type="text"
            placeholder="Nome do campeonato"
            value={form.nome}
            onChange={handleChange}
            className="p-2 rounded bg-inputBg placeholder-lightgray text-contrast
        focus:outline-none focus:ring-2 focus:ring-focusBorder hover:ring hover:ring-accent transition"
            required
          />

          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="p-2 rounded bg-inputBg text-contrast placeholder-lightgray
        focus:outline-none focus:ring-2 focus:ring-accent hover:ring hover:ring-accent transition"
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="LIGA">Liga</option>
            <option value="COPA">Copa</option>
          </select>

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
              src={`data:image/png;base64,${form.emblema}`}
              alt="Pré-visualização do Emblema"
              className="w-32 h-32 object-contain mx-auto rounded-lg"
            />
          )}

          <button
            type="submit"
            className="bg-primary mt-2 text-white py-2 rounded hover:bg-accent transition"
          >
            Salvar Campeonato
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
              <p className="mb-6 text-lightgray">Tem certeza que deseja excluir este campeonato?</p>
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
