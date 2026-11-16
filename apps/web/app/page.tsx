export default function Home() {
  return (
    <main className="welcome">
      <header className="masthead">
        <p className="wordmark">
          UTPL <span>·</span> FUNDACIONES
        </p>
        <p className="edition">
          ETAPA F0 <span>MONOREPO</span>
        </p>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">Una base, tres aplicaciones</p>
        <h1 id="page-title">El juego empieza con buenos cimientos.</h1>
        <p className="lead">
          Fundaciones del sistema web de apuestas deportivas: una estructura
          común para desarrollar, validar y desplegar cada aplicación.
        </p>
      </section>

      <section className="surfaces" aria-labelledby="surfaces-title">
        <div className="section-heading">
          <h2 id="surfaces-title">El terreno de juego</h2>
          <p>Aplicaciones independientes. Una misma línea de salida.</p>
        </div>
        <div className="surface-grid">
          <article className="surface-card">
            <span className="surface-index" aria-hidden="true">
              01
            </span>
            <h3>Web</h3>
            <p>La experiencia de presentación del sistema.</p>
            <span className="technology">NEXT.JS · APP ROUTER</span>
          </article>
          <article className="surface-card">
            <span className="surface-index" aria-hidden="true">
              02
            </span>
            <h3>API</h3>
            <p>El servicio de aplicación y sus futuras reglas.</p>
            <span className="technology">NESTJS · TYPESCRIPT</span>
          </article>
          <article className="surface-card">
            <span className="surface-index" aria-hidden="true">
              03
            </span>
            <h3>Reportes</h3>
            <p>Un servicio separado para las necesidades de análisis.</p>
            <span className="technology">FASTAPI · PYTHON</span>
          </article>
        </div>
      </section>

      <footer className="footer">
        <span>F0 / FUNDACIONES DEL MONOREPO</span>
        <span>ESTRUCTURA LISTA PARA CRECER</span>
      </footer>
    </main>
  );
}
