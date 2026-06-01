import './Recursos.css';
import { FaArrowLeft, FaGlobe } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight, FaDownload, FaFacebookSquare, FaInstagram, FaPlay, FaYoutube } from 'react-icons/fa';
import { getRecursoMedia, recursos } from '../data/recursos';

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/caminando_unlp/',
    icon: FaInstagram,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/CaminandoUNLP',
    icon: FaFacebookSquare,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@CaminandoUNLP',
    icon: FaYoutube,
  },
  {
    label: 'Sitio web',
    href: 'https://caminando.unlp.edu.ar/',
    icon: FaGlobe,
  },
];

function Recursos({ onBack }) {
  return (
    <div className="recursos-pagina">
      <button className="recursos-volver" type="button" onClick={onBack}>
        <FaArrowLeft /> Volver
      </button>

      <section className="recursos-panel">
        <header className="recursos-header">
          <h1 className="recursos-titulo">RECURSOS</h1>
        </header>

        <div className="recursos-lista">
          {recursos.map((resource) => {
            const mediaSrc = resource.mediaSrc ?? getRecursoMedia(resource.mediaIndex);

            return (
              <article key={resource.title} className={`recurso-card tono-${resource.tone}`}>
                <div className="recurso-media">
                  {mediaSrc ? <img src={mediaSrc} alt={resource.title} className="recurso-miniatura" /> : null}
                </div>

                <h2>{resource.title}</h2>

                {resource.href ? (
                  <a
                    className={`recurso-accion tono-${resource.tone}`}
                    href={resource.href}
                    target={resource.download ? undefined : '_blank'}
                    rel={resource.download ? undefined : 'noreferrer'}
                    download={resource.download ? '' : undefined}
                  >
                    {resource.actionIcon ? <resource.actionIcon /> : null}
                    {resource.actionLabel}
                  </a>
                ) : (
                  <button className={`recurso-accion tono-${resource.tone}`} type="button">
                    {resource.actionIcon ? <resource.actionIcon /> : null}
                    {resource.actionLabel}
                  </button>
                )}
              </article>
            );
          })}
        </div>

        <section className="recursos-inferior">
          <div className="recursos-sociales">
            <p>Seguinos en nuestras redes!</p>
            <div className="iconos-sociales">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    className="icono-social"
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          <p className="recursos-texto-secundario">
            También hacemos talleres gratuitos para estudiantes y docentes. Contactanos por nuestras redes para más
            información.
          </p>

          <div className="recursos-paginacion" aria-label="Navegación de recursos">
            <button type="button" className="paginacion-boton" aria-label="Anterior">
              <FaChevronLeft />
            </button>
            <button type="button" className="paginacion-boton" aria-label="Siguiente">
              <FaChevronRight />
            </button>
          </div>
        </section>
      </section>
    </div>
  );
}

export default Recursos;
