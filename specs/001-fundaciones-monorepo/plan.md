# Implementation Plan: Fundaciones del monorepo

**Branch**: `[feature/spec-1]` | **Date**: 2026-11-15 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/001-fundaciones-monorepo/spec.md`

## Summary

Establecer el monorepo pnpm/Turborepo con las tres aplicaciones definidas por el proyecto y el paquete compartido previsto en `PLAN.md`. La entrega incluye los esqueletos web, API y reportes; controles locales y CI; infraestructura local PostgreSQL/Redis; despliegue a Vercel y Render por rama; SonarQube con quality gate bloqueante; y los elementos de colaboración y trazabilidad de GitHub/Grafana.

La secuencia prioriza una base reproducible, después valida los controles y despliegues, y finalmente configura los elementos de colaboración. El criterio de cierre es el de F0: un PR a `develop` supera los controles y despliega las tres aplicaciones a staging. No se implementan funcionalidades de autenticación, dinero, apuestas, partidos, liquidación, promociones ni reportes de negocio.

## Technical Context

**Language/Version**: TypeScript para web y API; Python 3.12 para reportes. La versión de Node.js y las versiones exactas de pnpm/Turborepo no están especificadas y deben seleccionarse compatibles al preparar el repositorio.  
**Primary Dependencies**: pnpm workspaces, Turborepo, Next.js (App Router), NestJS, FastAPI, pandas y `uv` para gestionar el proyecto Python. ESLint, Prettier, TypeScript estricto, Ruff, Commitlint y Husky para calidad y Conventional Commits.  
**Storage**: PostgreSQL y Redis ejecutados localmente mediante Docker Compose; su uso funcional queda para fases posteriores.  
**Testing**: Jest + Supertest para API, Testing Library y Playwright para web, pytest para reportes, según `PLAN.md`. Los comandos concretos se documentarán cuando existan los manifiestos de cada aplicación, como indica `CLAUDE.md`.  
**Target Platform**: Web en Vercel; API NestJS y servicio Python en Render; desarrollo local con Docker Compose. CI en GitHub Actions.  
**Project Type**: Monorepo con tres aplicaciones desplegables (`apps/web`, `apps/api`, `apps/reports`) y `packages/shared`.  
**Performance Goals**: No se define un objetivo de rendimiento para F0. Los objetivos de tiempo real pertenecen a las fases de resultados y liquidación.  
**Constraints**: Respetar exactamente los tres servicios de la constitución; `packages/shared` es un paquete de código y no una aplicación/servicio adicional. Mantener secretos fuera del frontend y del repositorio. No usar Java ni Rust. No implementar dominios de negocio de fases futuras.  
**Scale/Scope**: Una base monorepo académica, tres aplicaciones iniciales, despliegues staging/producción y trazabilidad del equipo; sin funcionalidades de apuestas.

## Constitution Check

*Gate previo a investigación y diseño. Revisión posterior al diseño incluida al final de esta sección.*

- [x] **I. Seguridad y antifraude**: F0 no implementa dinero, apuestas, identidad ni endpoints de negocio. Los secretos de CI/despliegue se gestionan fuera del repositorio y no se exponen al frontend. Cualquier endpoint `/health` solo informa disponibilidad y no revela secretos ni datos de negocio.
- [x] **II. Integridad financiera**: No hay operaciones monetarias en F0. No se implementa saldo ni se crean registros financieros; los requisitos de ledger, transacción, bloqueo e idempotencia quedan para sus specs posteriores y no se relajan.
- [x] **III. Servidor como autoridad**: La web es solo presentación; no se le asigna lógica de negocio. API y reportes se mantienen como aplicaciones separadas, y las reglas de servidor serán abordadas en las fases correspondientes.
- [x] **IV. Pruebas primero**: El pipeline incluye la etapa de pruebas indicada por el proyecto. F0 no toca los dominios financieros que requieren Red-Green-Refactor ni inventa sus pruebas; esas obligaciones se aplicarán antes de implementar sus respectivas features.
- [x] **V. Tiempo real confiable**: F0 prepara la infraestructura común, pero no sincroniza API-Football ni procesa resultados. Worker, cola persistente, cuota de llamadas y objetivo ≤ 5 s se reservan a las specs de partidos y tiempo real.
- [x] **VI. Simplicidad**: Se mantienen exactamente `apps/web`, `apps/api` y `apps/reports`; `packages/shared` es el paquete previsto en `PLAN.md`, no un servicio desplegable adicional. No se agrega otra aplicación. El reporte inicial no escribe datos de negocio.
- [x] **VII. UX**: El esqueleto web se limita a la pantalla inicial necesaria para el despliegue de F0. Cualquier interfaz incluida debe ser mobile-first desde 360 px y cumplir WCAG 2.1 AA; se aplicará `frontend-design` cuando se diseñe UI.

**Revisión posterior al diseño**: La arquitectura mantiene los límites de servicio, no introduce excepciones a I o II y no adelanta funcionalidades de negocio. Se conservan las mismas siete compuertas.

## Architecture and Technical Decisions

| Área | Decisión | Motivo y límite |
|------|----------|-----------------|
| Workspace | pnpm workspaces coordinado con Turborepo; tres aplicaciones y `packages/shared` | Es la decisión explícita de `PLAN.md`; permite compartir comandos y coordinar tareas sin sumar otro servicio. |
| Web | Next.js App Router con TypeScript, desplegado en Vercel | Stack definido en `promtp.md`, `PLAN.md` y `CLAUDE.md`. En F0 solo se prepara el esqueleto. |
| API | NestJS con TypeScript, desplegada en Render, con `/health` | Stack y destino definidos por los documentos; no se agrega lógica de dinero ni apuestas. |
| Reportes | Python 3.12, FastAPI, pandas y `uv`, desplegado en Render, con `/health` | Stack definido por `PLAN.md`; en F0 es solo un esqueleto, sin consultas ni escritura de negocio. |
| Datos locales | PostgreSQL y Redis mediante Docker Compose | Requerido por F0. No se diseñan todavía esquemas de dominio, colas ni acceso de reportes. |
| Calidad | ESLint, Prettier, TypeScript estricto, Ruff, Commitlint y Husky | Herramientas indicadas para F0. Los comandos se exponen desde el workspace y se concretan en los manifiestos al implementarlos. |
| CI y análisis | GitHub Actions con lint → tipos → pruebas → SonarQube y quality gate bloqueante | Sigue el orden de `promtp.md`, `PLAN.md` y la spec. `PLAN.md` propone SonarQube Cloud; disponibilidad/licencia depende de la configuración del repositorio. |
| Despliegue | Vercel para web; Render para API y reportes. `develop` corresponde a staging y `main` a producción | Respeta el stack y Git Flow definidos. Un PR dirigido a `develop` debe desplegar a staging solo después de superar los controles requeridos. |
| Trazabilidad | Grafana Cloud con datasource de GitHub | Debe presentar commits, PRs, tiempo de revisión, despliegues, fallos del pipeline y métricas DORA. No se fijan paneles ni fórmulas no especificadas. |
| Colaboración | Plantillas de issue/PR y tablero de proyecto en GitHub | Requisitos explícitos de F0. |
| Versiones de herramientas | Fijar versiones compatibles al crear los manifiestos, documentando los valores elegidos | Las fuentes no fijan versión de Node.js, pnpm, Turborepo ni versiones de dependencias JS; no se inventan aquí. |

### Límites de arquitectura

- `apps/web` presenta información y no calcula ni decide saldos, cuotas o liquidaciones.
- `apps/api` será dueña de la lógica de negocio cuando se implementen las fases posteriores. En F0 solo contiene su esqueleto y `/health`.
- `apps/reports` es un servicio separado; su futura conexión a datos de negocio deberá respetar el usuario de base de datos de solo lectura establecido en la constitución. F0 no implementa reportes ni consulta PostgreSQL.
- `packages/shared` no se convierte en un servicio desplegable. Su contenido inicial se limita a la configuración mínima para que forme parte del workspace; no se adelantan modelos o contratos de dominios futuros.
- Los secretos de proveedores se configuran como secretos/variables del entorno de CI o de cada plataforma y nunca se incluyen en código cliente ni en el repositorio.

## Implementation Strategy

La implementación se organiza en bloques secuenciales. Cada bloque conserva el alcance de F0 y debe quedar cubierto por el pipeline definido antes de avanzar al despliegue integrado.

### 1. Workspace y herramientas comunes

- Crear los manifiestos raíz de pnpm workspaces y Turborepo, con tareas para las aplicaciones y el paquete compartido.
- Incorporar ESLint, Prettier, TypeScript estricto, Ruff, Commitlint y Husky de acuerdo con los lenguajes y scripts disponibles.
- Mantener comandos por aplicación cuando los entornos sean distintos; no forzar que el proyecto Python se ejecute como paquete JavaScript.
- Fijar versiones compatibles y reproducibles de herramientas y dependencias al crear los manifiestos; documentar los comandos reales en `CLAUDE.md` cuando estos archivos existan.

### 2. Esqueletos de las aplicaciones

- Inicializar `apps/web` con Next.js App Router y TypeScript para la pantalla mínima de bienvenida de F0.
- Inicializar `apps/api` con NestJS y una ruta `/health`.
- Inicializar `apps/reports` con Python 3.12, FastAPI gestionado por `uv` y una ruta `/health`.
- Crear `packages/shared` como paquete del workspace sin mover lógica de dinero, apuestas o autoridad del servidor al frontend.
- Verificar que las aplicaciones y paquete pueden resolverse desde el workspace sin crear aplicaciones adicionales.

### 3. Desarrollo local

- Añadir Docker Compose en la raíz para PostgreSQL y Redis.
- Mantener credenciales locales fuera del control de versiones; proporcionar solo valores de ejemplo si hacen falta y sin incluir secretos reales.
- Verificar que los servicios locales inician y que API y reportes responden en `/health`.

### 4. CI, calidad y protección de integración

- Configurar GitHub Actions con las etapas en orden: lint, verificación de tipos, pruebas y análisis SonarQube.
- Hacer que el quality gate de SonarQube sea condición bloqueante del flujo.
- Aplicar el flujo Git indicado; `main` y `develop` requieren PR revisado y CI aprobado, sin integración directa.
- No ejecutar despliegues si falla una etapa previa. Para el PR a `develop`, el despliegue de staging queda condicionado al éxito de todos los gates.
- Mantener las credenciales necesarias como secretos de CI/plataforma y restringirlas al propósito de despliegue. No incluirlas en archivos del frontend ni en el repositorio.

### 5. Plataformas y despliegues

- Crear/configurar los proyectos de Vercel y Render para las aplicaciones previstas en cada plataforma.
- Asociar `develop` con staging y `main` con producción.
- Configurar el despliegue de las tres aplicaciones a staging tras superar los controles del PR a `develop`, de acuerdo con el criterio de cierre de F0.
- Configurar despliegue a producción desde `main` conforme a la estrategia por rama documentada.
- Verificar despliegue y disponibilidad de las tres aplicaciones en staging. La spec no determina los identificadores, responsables ni valores de configuración de las cuentas; deben provenir del equipo.

### 6. Colaboración y trazabilidad

- Añadir plantillas de issue y PR y crear el tablero de proyecto en GitHub.
- Configurar Grafana Cloud con datasource de GitHub y las señales de trazabilidad requeridas.
- Confirmar que el equipo puede consultar las seis clases de información descritas en la spec, sin definir métricas nuevas ni fórmulas que no estén acordadas.

### 7. Cierre de F0

- Ejecutar el flujo CI en un PR dirigido a `develop` y confirmar todos los gates.
- Comprobar el despliegue a staging de web, API y reportes y las rutas `/health` de API y reportes.
- Confirmar las ramas protegidas, los recursos de colaboración, Grafana y que no hay secretos en los artefactos versionados.
- La fase se considera cerrada cuando el PR a `develop` despliega las tres aplicaciones en staging y los controles están aprobados.

## Validation Strategy

| Requisito/spec | Validación prevista | Criterio de aprobación |
|----------------|---------------------|------------------------|
| FR-001, FR-002, SC-001 | Inspección del workspace y de sus manifiestos | Están `apps/web`, `apps/api`, `apps/reports`, `packages/shared` y sus stacks coinciden con los documentos. |
| FR-003, SC-002 | Llamada a `/health` en API y reportes localmente y tras despliegue | Ambas rutas responden disponible sin revelar datos o secretos. |
| FR-004 | Ejecución de los comandos de calidad desde el workspace | Las herramientas requeridas están configuradas y los comandos terminan correctamente. |
| FR-005 | Inspección de reglas de ramas y prueba del flujo por PR | `main` y `develop` requieren PR revisado y CI; no hay ruta de integración directa configurada. |
| FR-006 | Revisión/ejecución del workflow de GitHub Actions | Orden lint → tipos → pruebas → SonarQube y quality gate obligatorio. |
| FR-007, SC-003, SC-004 | PR a `develop` y flujo de despliegue desde `main` | Las tres aplicaciones llegan a staging tras los gates; producción se asocia con `main`. |
| FR-008 | Arranque de servicios con Docker Compose | PostgreSQL y Redis quedan disponibles para desarrollo local. |
| FR-009, SC-005 | Revisión del dashboard y datasource de Grafana | Se pueden localizar commits, PRs, tiempo de revisión, despliegues, fallos CI y métricas DORA. |
| FR-010, SC-006 | Inspección del repositorio y proyecto GitHub | Existen plantillas de issue/PR y tablero de proyecto. |
| FR-011 | Revisión de archivos versionados y configuración de secretos de plataformas | No hay secretos reales en archivos versionados ni en el cliente; secretos externos usan configuración de entorno. |
| FR-012 | Revisión de estructura y funcionalidades entregadas | No se añadieron dominios fuera de F0 ni servicios adicionales. |

**Pruebas**: El pipeline debe ejecutar las pruebas definidas por los scripts de cada aplicación: Jest + Supertest para API, Testing Library/Playwright para web y pytest para reportes según `PLAN.md`. Los comandos exactos se determinarán al existir los manifiestos, siguiendo `CLAUDE.md`. Las pruebas específicas de fraude, concurrencia, idempotencia y dinero se planifican con las specs de sus dominios y no se simulan en este alcance.

Cada historia de usuario debe tener una comprobación de integración o E2E, conforme a la constitución: US1 verifica el workspace levantando las aplicaciones y consultando sus health checks; US2 verifica el flujo PR→quality gates→staging y disponibilidad desplegada; US3 verifica que la actividad del repositorio llegue al datasource/dashboard de Grafana. Las comprobaciones externas de plataforma se registran como criterios de aceptación del despliegue, además de las pruebas automatizadas de cada aplicación.

## Project Structure

### Documentation (this feature)

```text
specs/001-fundaciones-monorepo/
├── spec.md
├── plan.md
└── checklists/
    └── requirements.md
```

No se generan `research.md`, `data-model.md`, `quickstart.md`, contratos ni `tasks.md` como parte de este documento. Las tareas vendrán después de revisar/aprobar el plan.

### Source Code (repository root)

```text
.
├── apps/
│   ├── web/                 # Next.js App Router + TypeScript
│   ├── api/                 # NestJS + TypeScript; incluye /health
│   └── reports/             # Python 3.12 + FastAPI + pandas; incluye /health
├── packages/
│   └── shared/              # Paquete del workspace, no servicio desplegable
├── .github/
│   ├── workflows/           # CI y despliegues por rama
│   ├── ISSUE_TEMPLATE/      # Plantillas de issues
│   └── PULL_REQUEST_TEMPLATE.md
├── docker-compose.yml       # PostgreSQL y Redis locales
├── package.json             # Workspace JS raíz y scripts compartidos
├── pnpm-workspace.yaml
├── turbo.json
├── sonar-project.properties # Configuración del análisis, si la integración elegida lo requiere
└── apps/reports/pyproject.toml # Metadatos del proyecto Python y configuración de uv/Ruff
```

Los nombres indicados expresan una organización propuesta a partir de las herramientas y requisitos existentes; las opciones exactas de configuración de Vercel, Render, SonarQube y Grafana se concretarán según las cuentas disponibles y no requieren añadir servicios al producto.

**Structure Decision**: Aplicación web, API y servicio de reportes en `apps/`, coordinados por pnpm/Turborepo según `PLAN.md`, con un paquete `packages/shared`. La separación preserva la autoridad de `apps/api`, mantiene `apps/web` como presentación y conserva el servicio de reportes aparte. GitHub Actions y plantillas se ubican en `.github/`; PostgreSQL y Redis locales se describen desde el Compose raíz.

## Decisions and Open Dependencies

- **Versiones de Node.js, pnpm y Turborepo**: no aparecen fijadas en las fuentes. Seleccionar versiones compatibles y soportadas al crear los manifiestos; registrarlas allí para instalaciones reproducibles.
- **Contenido inicial de `packages/shared`**: las fuentes definen el paquete pero no especifican qué módulos contiene. Mantenerlo mínimo durante F0 y dejar contratos/modelos de dominio para specs posteriores.
- **Cuentas y credenciales externas**: la spec registra como prerrequisito que el equipo provea accesos a GitHub, SonarQube, Vercel, Render y Grafana. Los responsables y secretos concretos no están definidos.
- **SonarQube Cloud**: es la opción de calidad indicada en `PLAN.md`; su disponibilidad y condición de repositorio público deben confirmarse al habilitar la integración. El gate no se considera opcional.
- **Detalle del dashboard DORA**: las seis clases de señal están enumeradas por los documentos, pero no están definidos paneles, cálculos o fórmulas. Implementar únicamente visibilidad de esas señales; no inventar métricas adicionales.
- **Configuración de proyectos/proveedores**: las fuentes fijan los proveedores y el mapeo de ramas, no el número de proyectos, identificadores de servicio, regiones ni opciones específicas de cada cuenta. Resolver esos valores durante la configuración con los responsables del equipo.

## Complexity Tracking

No hay violaciones a la constitución que requieran excepción. `packages/shared` está previsto en `PLAN.md` y no representa una cuarta aplicación; no se añaden servicios desplegables.
