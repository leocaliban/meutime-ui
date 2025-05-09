import { useState, useEffect } from 'react'
import type { Partida } from '../types/Partida';
import axios from 'axios';
import type { Clube } from '../types/Clube';
import type { Campeonato } from '../types/Campeonato';

const INITIAL_FORM = {
  data: '',
  clubeId: '',
  adversarioId: '',
  campeonatoId: '',
  golsClube: '',
  golsAdversario: '',
  emCasa: true,
  tevePenaltis: false,
  golsPenaltisClube: '',
  golsPenaltisAdversario: '',
};

const ID_MEU_CLUBE = 3;

const Home = () => {
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [clubes, setClubes] = useState<Clube[]>([]);
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [form, setForm] = useState(INITIAL_FORM);

  const [clubesFiltrados, setClubesFiltrados] = useState<{ id: number, nome: string }[]>([]);
  const [campoAtivo, setCampoAtivo] = useState<'clube' | 'adversario' | null>(null);
  const [nomeClubeInput, setNomeClubeInput] = useState<string>('');
  const [nomeAdversarioInput, setNomeAdversarioInput] = useState<string>('');

  useEffect(() => {
    const buscarPartidas = async () => {
      const response = await axios.get('http://localhost:8080/partidas', {
        headers: {
          'Accept': 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
        }
      });
      setPartidas(response.data);
    };
    const buscarClubes = async () => {
      const response = await axios.get('http://localhost:8080/clubes');
      setClubes(response.data);
      iniciarMeuClube(response.data);
    };
    const buscarCampeonatos = async () => {
      const response = await axios.get('http://localhost:8080/campeonatos');
      setCampeonatos(response.data);
    };
    buscarPartidas();
    buscarClubes();
    buscarCampeonatos();
  }, []);

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
      await axios.post('http://localhost:8080/partidas', payload);
      alert('Partida cadastrada com sucesso!');
      setForm(INITIAL_FORM);
    } catch (error) {
      alert('Erro ao cadastrar partida');
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

  function getClasseCores(campeonatoId: number) {
    switch (campeonatoId) {
      case 1:
        return 'bg-one-primaryDark hover:bg-one-secondaryNormal';
      case 2:
        return 'bg-facup-primaryDark hover:bg-facup-secondaryNormal';
      default:
        return '';
    }
  }

  return (
    <div className="flex gap-4">
      <div className="w-4/5 bg-secondary p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-bold mb-2 text-accent">Lista de Partidas</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-primary">
              <th className='text-contrast'>DATA</th>
              <th className='text-contrast'>CAMPEONATO</th>
              <th className='text-contrast'>CASA</th>
              <th className='text-contrast'>PLACAR</th>
              <th className='text-contrast'>FORA</th>
              <th className='text-contrast'>PLACAR</th>
            </tr>
          </thead>
          <tbody>
            {partidas.map((p, i) => (
              <tr key={i} className={`border-b border-primary ${getClasseCores(p.campeonato.id)}`}>
                <td className='text-lightgray'>{p.data}</td>
                <td className='text-lightgray'>{p.campeonato.nome}</td>
                <td className='text-lightgray'>{p.emCasa ? p.clube.nome : p.adversario.nome}</td>
                <td className='text-lightgray'>{p.emCasa ? p.golsClube : p.golsAdversario}</td>
                <td className='text-lightgray'>{!p.emCasa ? p.clube.nome : p.adversario.nome}</td>
                <td className='text-lightgray'>{!p.emCasa ? p.golsClube : p.golsAdversario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-1/5 bg-secondary p-4 rounded-xl shadow-md">
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
  );
};

export default Home;
