import { FaDownload, FaPlay } from 'react-icons/fa';

const RESOURCE_IMAGES = import.meta.glob('../assets/recurso*.*', {
  eager: true,
  import: 'default',
});

const parseResourceNumber = (path) => {
  const match = path.match(/recurso(\d+)/i);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
};

const recursoMedia = Object.entries(RESOURCE_IMAGES)
  .sort(([pathA], [pathB]) => parseResourceNumber(pathA) - parseResourceNumber(pathB))
  .map(([, src]) => src);

export const DOCUMENTARY_VIDEO_ID = 'cZy5PtevwfU';
export const DOCUMENTARY_URL = `https://www.youtube.com/watch?v=${DOCUMENTARY_VIDEO_ID}`;
export const DOCUMENTARY_THUMBNAIL = `https://img.youtube.com/vi/${DOCUMENTARY_VIDEO_ID}/hqdefault.jpg`;
export const RECURSO_1_URL = 'https://www.dropbox.com/scl/fi/v2y9hkhew04dalih7z29g/caminando-sobre-gliptodontes-y-tigres-dientes-de-sable.pdf?rlkey=kd8jrowpoxmg2x4cd09guid76&dl=1';
export const RECURSO_2_URL = 'https://www.dropbox.com/scl/fi/xv653r6jcc392bvj7o6hl/Caminando-hacia-tierras-nuevas-2019.pdf?rlkey=k1y1eerl3n6ruh0p5kfcr3pdt&dl=1';

export const recursos = [
  {
    title: 'Caminando sobre gliptodontes y tigres dientes de sable',
    actionLabel: 'Descargar',
    tone: 'amber',
    actionIcon: FaDownload,
    href: RECURSO_1_URL,
    download: true,
    mediaIndex: 0,
  },
  {
    title: 'DOCUMENTAL: Caminando sobre gliptodontes y tigres dientes de sable',
    actionLabel: 'Ver',
    tone: 'crimson',
    actionIcon: FaPlay,
    href: DOCUMENTARY_URL,
    mediaSrc: DOCUMENTARY_THUMBNAIL,
  },
  {
    title: 'Caminando hacia tierras nuevas',
    actionLabel: 'Descargar',
    tone: 'gold',
    actionIcon: FaDownload,
    href: RECURSO_2_URL,
    download: true,
    mediaIndex: 1,
  },
];

export const getRecursoMedia = (mediaIndex) => recursoMedia[mediaIndex] ?? null;
