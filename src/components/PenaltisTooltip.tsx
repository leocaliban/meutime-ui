import * as Tooltip from '@radix-ui/react-tooltip';
import { FaCheck } from 'react-icons/fa';
import type { Partida } from '../types/Partida';

const PenaltisTooltip = ({ p }: { p: Partida }) => {

  const buildTooltipMessage = (): string => {
    if (p.golsPenaltisClube && p.golsPenaltisAdversario) {
      const message = p.golsPenaltisClube > p.golsPenaltisAdversario ? `Ganhou por ${p.golsPenaltisClube} X ${p.golsPenaltisAdversario}` : `Perdeu por ${p.golsPenaltisClube} X ${p.golsPenaltisAdversario}`;
      return message;
    } else {
      return '';
    }
  }
  return (
    <Tooltip.Provider delayDuration={100} >
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span>
            <FaCheck className="text-green-500 cursor-pointer inline" />
          </span>
        </Tooltip.Trigger>
        <Tooltip.Content
          side="top"
          align="center"
          className="rounded px-3 py-1.5 text-sm bg-black text-white shadow-lg z-50"
        >
          {buildTooltipMessage()}
          <Tooltip.Arrow className="fill-black" />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export default PenaltisTooltip;