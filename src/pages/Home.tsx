import { useState, useEffect } from 'react';

import moment from 'moment';
import { toast } from 'react-hot-toast';

import PenaltisTooltip from '../components/PenaltisTooltip';

import { ClubeService } from '../services/ClubeService';
import { PartidaService } from '../services/PartidaService';
import { CampeonatoService } from '../services/CampeonatoService';

import type { Clube } from '../types/Clube';
import type { Partida } from '../types/Partida';
import type { Campeonato } from '../types/Campeonato';
import { BASE_URL } from '../services/Resources';
import type { Confronto } from '../types/Confronto';
import ResumoConfronto from '../components/ConfrontoResumo';

const INITIAL_FORM = {
  data: '',
  clubeId: '1',
  adversarioId: '',
  campeonatoId: '',
  golsClube: '',
  golsAdversario: '',
  emCasa: true,
  tevePenaltis: false,
  golsPenaltisClube: '',
  golsPenaltisAdversario: '',
};

const ID_MEU_CLUBE = 1;

const Home = () => {
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [clubes, setClubes] = useState<Clube[]>([]);
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [form, setForm] = useState(INITIAL_FORM);

  const [clubesFiltrados, setClubesFiltrados] = useState<{ id: number, nome: string }[]>([]);
  const [campoAtivo, setCampoAtivo] = useState<'clube' | 'adversario' | null>(null);
  const [nomeClubeInput, setNomeClubeInput] = useState<string>('');
  const [nomeAdversarioInput, setNomeAdversarioInput] = useState<string>('');

  const [partidaSelecionada, setPartidaSelecionada] = useState<Partida | null>(null);
  const [confronto, setConfronto] = useState<Confronto | null>(null);

  useEffect(() => {
    const buscarPartidas = async () => {
      const response = await PartidaService.getAll();
      setPartidas(response);
    };

    buscarPartidas();
    buscarClubes();
    buscarCampeonatos();
  }, []);

  const buscarClubes = async () => {
    const response = await ClubeService.getAll();
    setClubes(response);
    iniciarMeuClube(response);
  };

  const buscarCampeonatos = async () => {
    const response = await CampeonatoService.getAll();
    setCampeonatos(response);
  };

  const buscarConfrontos = async (partidaSelecionada: Partida) => {
    setPartidaSelecionada(partidaSelecionada);
    const response = await PartidaService.getConfrontos(partidaSelecionada.clube.id, partidaSelecionada.adversario.id);
    setConfronto(response);
  };

  const iniciarMeuClube = (clubes: Clube[]) => {
    const meuClube = clubes.find((c) => c.id === ID_MEU_CLUBE);
    if (meuClube) {
      setForm((prev) => ({
        ...prev,
        clubeId: meuClube?.id.toString()
      }));
      setNomeClubeInput(meuClube.nome);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      data: form.data,
      emCasa: form.emCasa,
      tevePenaltis: form.tevePenaltis,
      golsClube: parseInt(form.golsClube),
      golsAdversario: parseInt(form.golsAdversario),
      clube: { id: parseInt(form.clubeId) },
      adversario: { id: parseInt(form.adversarioId) },
      campeonato: { id: parseInt(form.campeonatoId) },
      ...(form.tevePenaltis && {
        golsPenaltisClube: parseInt(form.golsPenaltisClube || '0'),
        golsPenaltisAdversario: parseInt(form.golsPenaltisAdversario || '0')
      })
    };

    try {
      const response = await PartidaService.create(payload);
      toast.success('Partida cadastrada com sucesso!');
      setForm(INITIAL_FORM);
      setNomeAdversarioInput('');
      setPartidas((prev) => ([...prev, response]));
    } catch (error) {
      console.error(error);
    }
  };

  const filtrarClubes = async (texto: string) => {
    if (texto.length < 2) {
      setClubesFiltrados([]);
      return;
    }

    try {
      setClubesFiltrados(clubes
        .filter(c => c.nome.toLowerCase().includes(texto.toLowerCase())));
    } catch (e) {
      console.error('Erro ao buscar clubes', e);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(e);
    const { name, value, type } = e.target;

    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="flex gap-4 h-full overflow-hidden">

      <div className="w-4/5 bg-secondary p-4 rounded-xl shadow-md flex flex-col">
        <h2 className="text-lg font-bold mb-2 text-accent">Lista de Partidas</h2>
        <div className="overflow-y-auto rounded-b-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-primary sticky top-0 bg-secondary">
                <th className='text-contrast  pl-2'>DATA</th>
                <th className='text-contrast'>CAMPEONATO</th>
                <th className='text-contrast'>CASA</th>
                <th className='text-contrast'>PLACAR</th>
                <th className='text-contrast'>FORA</th>
                <th className='text-contrast'>PLACAR</th>
                <th className='text-contrast text-center'>RESULTADO</th>
                <th className='text-contrast text-center'>PÊNALTIS</th>
              </tr>
            </thead>
            <tbody>
              {partidas.map((p, i) => (
                <tr
                  key={i}
                  className={`border-b border-primary cursor-pointer transition-colors border-l-4 ${partidaSelecionada?.id === p.id
                    ? 'border-blue-700 bg-blue-100 dark:bg-blue-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-l-transparent'
                    }`}
                  onClick={async () => buscarConfrontos(p)}
                >
                  <td className='text-lightgray pl-2'>{moment(p.data).format('DD/MM/YYYY')}</td>

                  <td className='text-lightgray'>
                    <div className="flex flex-row">
                      <img
                        src={`${BASE_URL}/campeonatos/${p.campeonato.id}/emblema`}
                        alt="Emblema"
                        className="h-6 w-6 object-contain mr-1"

                      />
                      <span>{p.campeonato.nome}</span>
                    </div>
                  </td>

                  <td className='text-lightgray'>
                    <div className="flex flex-row">
                      <img
                        src={`${BASE_URL}/clubes/${p.emCasa ? p.clube.id : p.adversario.id}/emblema`}
                        alt="Emblema"
                        className="h-6 w-6 object-contain mr-1"
                      />
                      <span>{p.emCasa ? p.clube.nome : p.adversario.nome}</span>
                    </div>
                  </td>
                  <td className='text-lightgray'>{p.emCasa ? p.golsClube : p.golsAdversario}</td>
                  <td className='text-lightgray'>
                    <div className="flex flex-row">
                      <img
                        src={`${BASE_URL}/clubes/${!p.emCasa ? p.clube.id : p.adversario.id}/emblema`}
                        alt="Emblema"
                        className="h-6 w-6 object-contain mr-1"
                      />
                      <span>{!p.emCasa ? p.clube.nome : p.adversario.nome}</span>
                    </div>
                  </td>
                  <td className='text-lightgray'>{!p.emCasa ? p.golsClube : p.golsAdversario}</td>
                  <td>
                    <div className={`w-4 h-4 text-center rounded-full mx-auto ${p.golsClube === p.golsAdversario
                      ? 'bg-yellow-300'
                      : (p.emCasa ? p.golsClube > p.golsAdversario : p.golsClube > p.golsAdversario)
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      }`} />
                  </td>
                  <td className='text-center'>
                    {p.tevePenaltis && <PenaltisTooltip p={p} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



      <div className='w-1/5 flex flex-col justify-between'>
        {partidaSelecionada && confronto && (
          <ResumoConfronto partida={partidaSelecionada} confronto={confronto} />
        )}
        <div className="bg-secondary p-4 rounded-xl shadow-md max-h-fit">
          <h2 className="text-lg font-bold mb-4 text-accent">Nova Partida</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-lightgray">
            <input name="data" type="date" value={form?.data} onChange={handleChange} className="p-2 rounded bg-inputBg placeholder-lightgray  text-contrast 
               focus:outline-none focus:ring-2 focus:ring-focusBorder hover:ring hover:ring-accent transition appearance-none" required />

            <select name="campeonatoId" value={form.campeonatoId} onChange={handleChange} className="p-2 rounded bg-inputBg text-contrast placeholder-lightgray
               focus:outline-none focus:ring-2 focus:ring-accent hover:ring hover:ring-accent transition" required>
              <option value="">Selecione o campeonato</option>
              {campeonatos.map((c: any) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>

            <div className="mb-2 relative">
              <input
                type="text"
                placeholder="Clube principal"
                value={nomeClubeInput}
                disabled={true}
                onChange={(e) => {
                  setCampoAtivo('clube');
                  filtrarClubes(e.target.value);
                  setNomeClubeInput(e.target.value);
                }}
                className="p-2 rounded bg-inputBg w-full text-contrast placeholder-lightgray 
                 focus:outline-none focus:ring-2 focus:ring-accent hover:ring hover:ring-accent transition"
              />
              {campoAtivo === 'clube' && clubesFiltrados.length > 0 && (
                <ul className="absolute z-10 bg-inputBg border border-lightgray w-full mt-1 rounded shadow text-contrast">
                  {clubesFiltrados.map(clube => (
                    <li
                      key={clube.id}
                      className="p-2 hover:bg-accent hover:text-white cursor-pointer transition"
                      onClick={() => {
                        setForm(prev => ({ ...prev, clubeId: clube.id.toString() }));
                        setClubesFiltrados([]);
                        setCampoAtivo(null);
                        setNomeClubeInput(clube.nome);
                      }}
                    >
                      {clube.nome}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mb-2 relative">
              <input
                type="text"
                placeholder="Adversário"
                value={nomeAdversarioInput}
                onChange={(e) => {
                  setCampoAtivo('adversario');
                  filtrarClubes(e.target.value);
                  setNomeAdversarioInput(e.target.value);
                }}
                className="p-2 rounded bg-inputBg w-full text-contrast placeholder-lightgray 
                 focus:outline-none focus:ring-2 focus:ring-accent hover:ring hover:ring-accent transition"
              />
              {campoAtivo === 'adversario' && clubesFiltrados.length > 0 && (
                <ul className="absolute z-10 bg-inputBg border border-lightgray w-full mt-1 rounded shadow text-contrast">
                  {clubesFiltrados.map(clube => (
                    <li
                      key={clube.id}
                      className="p-2 hover:bg-accent hover:text-white cursor-pointer transition"
                      onClick={() => {
                        setForm(prev => ({ ...prev, adversarioId: clube.id.toString() }));
                        setClubesFiltrados([]);
                        setCampoAtivo(null);

                        setNomeAdversarioInput(clube.nome);
                      }}
                    >
                      {clube.nome}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-2">
              <input name="golsClube" type="number" placeholder="Gols Clube" value={form?.golsClube} onChange={handleChange} className="p-2 rounded bg-inputBg text-contrast placeholder-lightgray 
                 focus:outline-none focus:ring-2 focus:ring-accent hover:ring hover:ring-accent transition w-1/2" required />

              <input name="golsAdversario" type="number" placeholder="Gols Adversário" value={form?.golsAdversario} onChange={handleChange} className="p-2 rounded bg-inputBg text-contrast placeholder-lightgray 
                 focus:outline-none focus:ring-2 focus:ring-accent hover:ring hover:ring-accent transition w-1/2" required />
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" name="emCasa" checked={form?.emCasa} onChange={handleChange} className="accent-accent hover:accent-indigo-700" />
              Jogando em casa
            </label>

            {form.golsClube && form.golsAdversario && form.golsClube === form.golsAdversario && (
              <label className="flex items-center gap-2">
                <input type="checkbox" name="tevePenaltis" checked={form.tevePenaltis} onChange={handleChange} className="accent-accent hover:accent-indigo-700" />
                Teve pênaltis
              </label>
            )}


            {form.tevePenaltis && (
              <div className="flex gap-2">
                <input name="golsPenaltisClube" type="number" placeholder="Pênaltis Clube"
                  value={form.golsPenaltisClube} onChange={handleChange}
                  className="p-2 rounded bg-inputBg text-contrast placeholder-lightgray 
                 focus:outline-none focus:ring-2 focus:ring-accent hover:ring hover:ring-accent transition w-1/2" />
                <input name="golsPenaltisAdversario" type="number" placeholder="Pênaltis Adversário"
                  value={form.golsPenaltisAdversario} onChange={handleChange}
                  className="p-2 rounded bg-inputBg text-contrast placeholder-lightgray 
                 focus:outline-none focus:ring-2 focus:ring-accent hover:ring hover:ring-accent transition w-1/2" />
              </div>
            )}

            <button type="submit" className="bg-primary mt-2 text-white py-2 rounded hover:bg-accent transition">Salvar Partida</button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Home;
