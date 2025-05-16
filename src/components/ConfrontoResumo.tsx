import { BASE_URL } from '../services/Resources';
import type { Confronto } from '../types/Confronto';
import type { Partida } from '../types/Partida';
import moment from 'moment';

interface Props {
  partida: Partida;
  confronto: Confronto;
}

const ResumoConfronto = ({ partida, confronto }: Props) => {
  const clubePrincipal = partida.clube;
  const adversario = partida.adversario;

  const gols = partida.emCasa
    ? { clube: partida.golsClube, adversario: partida.golsAdversario }
    : { clube: partida.golsAdversario, adversario: partida.golsClube };

  const golsPenaltis = partida.tevePenaltis
    ? {
      clube: partida.golsPenaltisClube,
      adversario: partida.golsPenaltisAdversario
    }
    : null;

  function getClasseBackground(campeonatoId: number) {
    switch (campeonatoId) {
      case 1:
        return 'bg-gradient-to-b from-secondary to-two-primaryDark';
      case 2:
        return 'bg-gradient-to-b from-secondary to-carabao-primaryDark';
      case 3:
        return 'bg-gradient-to-b from-secondary to-bsm-primaryDark';
      case 4:
        return 'bg-gradient-to-b from-secondary to-facup-primaryDark';
      case 5:
        return 'bg-gradient-to-b from-secondary to-friendly-primaryDark';
      case 6:
        return '';
      default:
        return '';
    }
  };

  return (
    <div className={`bg-secondary p-4 rounded-xl shadow-md mb-4 flex-1 ${getClasseBackground(partida.campeonato.id)}`}>
      <div className='flex flex-row items-center justify-between'>
        <h3 className="text-xl text-accent font-bold mb-2">{partida.campeonato.nome}</h3>
        <img src={`${BASE_URL}/campeonatos/${partida.campeonato.id}/emblema`} className="h-8 w-8 object-contain" />
      </div>

      <div className="flex justify-around items-center mb-1">

        <div className="flex flex-col items-center flex-1">
          <img src={`${BASE_URL}/clubes/${partida.emCasa ? clubePrincipal.id : adversario.id}/emblema`} className="h-12 w-12 object-contain mb-1" />
          <span className="text-lightgray text-sm font-bold">{partida.emCasa ? clubePrincipal.nome : adversario.nome}</span>
        </div>

        <div className="text-2xl font-bold text-white">
          {gols.clube} <span className="text-accent">X</span> {gols.adversario}
          {golsPenaltis && (
            <div className="text-xs text-lightgray mt-1 flex flex-col items-center justify-center">
              <div>
                Pênaltis
              </div>
              <div>
                {partida.emCasa ? golsPenaltis.clube : golsPenaltis.adversario} x {!partida.emCasa ? golsPenaltis.clube : golsPenaltis.adversario}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center flex-1">
          <img src={`${BASE_URL}/clubes/${!partida.emCasa ? clubePrincipal.id : adversario.id}/emblema`} className="h-12 w-12 object-contain mb-1" />
          <span className="text-lightgray text-sm font-bold">{!partida.emCasa ? clubePrincipal.nome : adversario.nome}</span>
        </div>
      </div>

      <div className="flex justify-center text-lightgray mb-2">
        <div className='font-bold uppercase text-xs'>
          {partida.resultado === 'VITORIA' ? 'Vitória' : partida.resultado}
        </div>
      </div>
      <div className="flex justify-around text-lightgray mb-4">
        <div className="text-xs text-lightgray mt-1 flex flex-col items-center justify-around">
          <div>
            Partidas
          </div>
          <div>
            {confronto.partidas.length}
          </div>
        </div>
        <div className="text-xs text-lightgray mt-1 flex flex-col items-center justify-around">
          <div>
            Vitórias
          </div>
          <div>
            {confronto.vitorias}
          </div>
        </div>
        <div className="text-xs text-lightgray mt-1 flex flex-col items-center justify-around">
          <div>
            Empates
          </div>
          <div>
            {confronto.empates}
          </div>
        </div>
        <div className="text-xs text-lightgray mt-1 flex flex-col items-center justify-around">
          <div>
            Derrotas
          </div>
          <div>
            {confronto.derrotas}
          </div>
        </div>
        <div className="text-xs text-lightgray mt-1 flex flex-col items-center justify-around">
          <div>
            Pênaltis
          </div>
          <div>
            {confronto.decisoesPorPenaltis}
          </div>
        </div>
      </div>

      <h4 className="text-accent font-semibold mb-2">Histórico de Confrontos</h4>
      <div className="max-h-40 overflow-y-auto">
        <table className="w-full text-sm text-lightgray">
          <thead>
            <tr>
              <th className="text-left">Data</th>
              <th className="text-left">Placar</th>
              <th className="text-left">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {confronto.partidas.map((partida: Partida) => (
              <tr key={partida.id}>
                <td>{moment(partida.data).format('DD/MM/YYYY')}</td>
                <td>{partida.emCasa ? partida.golsClube : partida.golsAdversario} x {!partida.emCasa ? partida.golsClube : partida.golsAdversario}</td>
                <td>{partida.resultado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResumoConfronto;
