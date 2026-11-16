---
description: "Tareas de implementación para las fundaciones del monorepo"
---

# Tasks: Fundaciones del monorepo

**Input**: Design documents from `specs/001-fundaciones-monorepo/`  
**Prerequisites**: `spec.md` y `plan.md` revisados. No se requieren `research.md`, `data-model.md` ni contratos para esta spec.

**Tests**: Se incluyen pruebas de integración/E2E solicitadas para cada historia, además de los comandos por aplicación definidos en `PLAN.md`. Las pruebas de ledger, pagos, concurrencia, fraude, apuestas y liquidación quedan fuera de F0 y corresponden a sus specs.

**Organization**: Fases de setup y fundación bloquean las historias. Después, las tareas se agrupan por historia de usuario de `spec.md`.

## Formato

Cada tarea usa `- [ ] T### [P?] [US#?] Descripción y ruta exacta`. `[P]` se reserva para trabajo independiente en archivos distintos. Los IDs siguen el orden de ejecución y las dependencias se explican abajo.

## Phase 1: Setup — workspace

**Purpose**: Crear la raíz ejecutable del monorepo y fijar las herramientas descritas por el plan.

- [x] T001 Crear `package.json` raíz con nombre privado del workspace, scripts comunes mínimos, `engines` de Node.js y versión de pnpm fijada en `packageManager`; seleccionar versiones compatibles de Node.js, pnpm y Turborepo sin asumir versiones ausentes de los documentos.
- [x] T002 Crear `pnpm-workspace.yaml` declarando `apps/*` y `packages/*`.
- [x] T003 Crear `turbo.json` con tareas de lint, tipos, pruebas y build que deleguen en los scripts de cada paquete sin asumir que el servicio Python es un paquete JavaScript.
- [x] T004 Crear `packages/shared/package.json` como paquete interno del workspace, sin lógica de dinero, apuestas ni reglas de dominio.

**Checkpoint**: pnpm reconoce los workspaces previstos y Turborepo puede leer la configuración. No hay aplicaciones fuera de `apps/web`, `apps/api` y `apps/reports`.

## Phase 2: Foundational — aplicaciones y servicios locales

**Purpose**: Inicializar el esqueleto tecnológico de las tres aplicaciones y los recursos locales que bloquean las historias.

- [x] T005 Inicializar `apps/web/package.json` y `apps/web/app/` como aplicación Next.js App Router con TypeScript, enlazada al workspace raíz.
- [x] T006 Inicializar `apps/api/package.json` y `apps/api/src/` como aplicación NestJS con TypeScript, enlazada al workspace raíz.
- [x] T007 Crear `apps/reports/pyproject.toml` para Python 3.12, FastAPI, pandas, Ruff y gestión con `uv`, sin añadir lógica de reportes ni conexión a datos de negocio.
- [x] T008 Crear `docker-compose.yml` en la raíz con servicios locales PostgreSQL y Redis, sin credenciales reales.
- [x] T009 Configurar ESLint y TypeScript estricto en `eslint.config.mjs` y `tsconfig.json` raíz para los paquetes TypeScript.
- [x] T010 Configurar Prettier en `.prettierrc.json` y `.prettierignore` para el monorepo.
- [x] T011 Configurar Ruff en `apps/reports/pyproject.toml` y dejar disponibles comandos de lint/formato del servicio Python.
- [x] T012 Configurar Commitlint en `commitlint.config.cjs` y el hook de mensaje en `.husky/commit-msg` para validar mensajes Conventional Commits.
- [x] T013 Añadir `.env.example` con nombres y valores de ejemplo no secretos requeridos para desarrollo local; verificar que `.env` y `.env.*` siguen ignorados por `.gitignore` y que ningún secreto real se incorpora al repositorio.

**Checkpoint**: Existen los esqueletos de las tres apps, el paquete compartido y PostgreSQL/Redis local; las herramientas comunes están configuradas. Aún no hay funciones de negocio.

## Phase 3: User Story 1 — Preparar la base del proyecto (Priority: P1) 🎯 MVP

**Goal**: Un integrante puede reconocer y ejecutar la base del monorepo, y las aplicaciones requeridas tienen su comprobación de disponibilidad.

**Independent Test**: Instalar desde el lockfile, ejecutar las comprobaciones del workspace, iniciar API y reportes, consultar sus `/health` y abrir la página inicial web.

### Tests de integración/E2E de US1

- [x] T014 [US1] Añadir prueba de integración de `/health` de API en `apps/api/test/health.e2e-spec.ts` usando Jest y Supertest; esperar respuesta disponible y que no contenga secretos ni datos de negocio.
- [x] T015 [US1] Añadir prueba pytest de `/health` en `apps/reports/tests/test_health.py`; esperar respuesta disponible y sin datos de negocio.
- [x] T016 [US1] Añadir prueba E2E de la página inicial web en `apps/web/e2e/home.spec.ts` con Playwright, comprobando que la aplicación carga sin errores.

### Implementación de US1

- [x] T017 [US1] Implementar la ruta `/health` de API en `apps/api/src/health/health.controller.ts` para informar únicamente disponibilidad.
- [x] T018 [US1] Implementar la ruta `/health` de reportes en `apps/reports/src/main.py` para informar únicamente disponibilidad, sin consultar ni escribir en PostgreSQL.
- [x] T019 [US1] Implementar la pantalla mínima de bienvenida de F0 en `apps/web/app/page.tsx`, sin cálculos ni lógica de negocio; cumplir uso desde 360 px y requisitos WCAG 2.1 AA aplicables.
- [x] T020 [US1] Añadir scripts de lint, tipos, pruebas y build a `apps/web/package.json` y `apps/api/package.json`; centralizar `reports:lint`, `reports:test` y `reports:dev` en el `package.json` raíz, y conservar dependencias/configuración Python en `apps/reports/pyproject.toml`.
- [x] T021 [US1] Añadir `apps/web/playwright.config.ts` y configurar la ejecución de la prueba E2E de la página inicial.
- [x] T022 [US1] Ejecutar instalación reproducible y los scripts locales desde `package.json`; registrar los comandos reales de build, lint y pruebas en `CLAUDE.md` cuando estén definidos, como pide la guía del proyecto.

**Acceptance Criteria**:

- Existen `apps/web`, `apps/api`, `apps/reports` y `packages/shared` bajo el workspace pnpm/Turborepo.
- API y reportes responden `/health`; la web presenta la página mínima de F0.
- ESLint, Prettier, TypeScript estricto, Ruff, Commitlint y Husky pueden ejecutarse con la configuración del proyecto.
- Docker Compose permite iniciar PostgreSQL y Redis localmente; no se versionan secretos.
- Las pruebas de integración/E2E de esta historia pasan.

**Checkpoint**: El monorepo y sus tres aplicaciones están inicializados y comprobados por separado.

## Phase 4: User Story 2 — Validar y desplegar cambios (Priority: P1)

**Goal**: Un PR dirigido a `develop` pasa controles bloqueantes y despliega las tres aplicaciones a staging; `main` queda asociado a producción.

**Independent Test**: Abrir un PR de validación hacia `develop`, comprobar orden y obligatoriedad de cada etapa, y verificar que el despliegue de staging y health checks ocurren solo tras pasar los gates.

### Pruebas de integración/E2E de US2

- [x] T023 [US2] Definir el smoke check del despliegue de staging en `.github/workflows/deploy.yml` para comprobar disponibilidad de web, API `/health` y reportes `/health` después del despliegue.
- [x] T024 [US2] Configurar validación del workflow en `.github/workflows/ci.yml` para fallar el PR si lint, tipos, pruebas o quality gate de SonarQube falla.

### Implementación de US2

- [x] T025 [US2] Crear `.github/workflows/ci.yml` con etapas GitHub Actions en orden: lint, verificación de tipos y pruebas; ejecutar los scripts disponibles de cada aplicación.
- [x] T026 [US2] Añadir análisis SonarQube y quality gate bloqueante a `.github/workflows/ci.yml`, con la configuración requerida en `sonar-project.properties` si corresponde a la integración seleccionada.
- [x] T027 [US2] Configurar `.github/workflows/deploy.yml` para desplegar web a Vercel y API/reportes a Render, con `develop` asociado a staging y `main` a producción; impedir despliegue si no pasan los controles previos.
- [ ] T028 [US2] Configurar los secretos requeridos en los entornos de GitHub Actions, Vercel y Render; comprobar que son referencias a secretos y que no se escriben valores reales en archivos versionados ni en el bundle web.
- [ ] T029 [US2] Configurar reglas de protección de `main` y `develop` en GitHub Settings > Branches para exigir PR revisado y checks CI aprobados antes de integrar.
- [ ] T030 [US2] Ejecutar un PR de validación a `develop` y verificar en `.github/workflows/ci.yml` y `.github/workflows/deploy.yml` el orden de gates, el bloqueo ante fallo y la disponibilidad de las tres aplicaciones de staging.
- [ ] T031 [US2] Configurar y verificar el despliegue a producción desde `main` en Vercel y Render, sin realizar un despliegue real hasta que existan las cuentas y autorización del equipo.

**Acceptance Criteria**:

- El PR a `develop` ejecuta lint → tipos → pruebas → SonarQube y no pasa si una etapa falla.
- Tras superar controles, las tres aplicaciones se despliegan a staging y sus comprobaciones de disponibilidad responden.
- `main` se asocia con producción en Vercel/Render; las reglas de GitHub exigen PR revisado y CI.
- Secretos de CI/despliegue están configurados fuera del repositorio y no aparecen en la app web.
- Se verifica la configuración de producción sin desplegarla antes de disponer de cuentas/accesos y aprobación del equipo.

**Checkpoint**: El flujo de integración F0 demuestra CI bloqueante y despliegue a staging; producción tiene su asociación configurada.

## Phase 5: User Story 3 — Organizar contribuciones y ver trazabilidad (Priority: P2)

**Goal**: El equipo encuentra plantillas y tablero en GitHub y puede consultar en Grafana las señales acordadas del proceso.

**Independent Test**: Crear un evento de prueba de colaboración/despliegue y comprobar que las plantillas y tablero están disponibles y que Grafana recibe la actividad requerida desde GitHub.

### Implementación de US3

- [x] T032 [P] [US3] Crear plantilla de issue en `.github/ISSUE_TEMPLATE/` con los campos de reporte necesarios para el proyecto, sin añadir requisitos de producto nuevos.
- [x] T033 [P] [US3] Crear plantilla de PR en `.github/PULL_REQUEST_TEMPLATE.md` con resumen, validaciones y revisión de calidad requeridas por el flujo existente.
- [ ] T034 [US3] Crear el tablero de proyecto del equipo en GitHub y verificar que permite organizar issues/PRs del repositorio.
- [ ] T035 [US3] Configurar Grafana Cloud en Connections > Data sources con datasource GitHub y dashboard para las seis clases de información de FR-009/SC-005, sin añadir fórmulas o métricas no acordadas.

### Prueba de integración de US3

- [ ] T036 [US3] Generar actividad de prueba en el repositorio y verificar en el dashboard de Grafana que aparecen commits, PRs, tiempo de revisión, despliegues, fallos del pipeline y métricas DORA; registrar cualquier acceso externo pendiente en el resultado de revisión del PR.

**Acceptance Criteria**:

- El repositorio ofrece plantilla de issue y PR y el equipo cuenta con un tablero de GitHub.
- Grafana Cloud está conectado al repositorio y hace visibles commits, PRs, tiempo de revisión, despliegues, fallos del pipeline y métricas DORA.
- La integración se comprueba con actividad real de GitHub; los accesos que falten quedan registrados sin incluir secretos.

**Checkpoint**: Se puede seguir el trabajo del equipo usando los artefactos y señales especificados.

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificar seguridad, accesibilidad, alcance y criterio de cierre global de F0.

- [ ] T037 Revisar archivos versionados y configuración de CI/plataformas para confirmar que no contienen secretos ni exponen credenciales a `apps/web`.
- [ ] T038 Revisar la pantalla de `apps/web/app/page.tsx` desde 360 px y comprobar contraste, foco de teclado, movimiento reducido y nombres claros conforme a WCAG 2.1 AA.
- [ ] T039 Revisar el árbol del repositorio y confirmar que solo existen tres aplicaciones desplegables y que no se adelantaron funciones de Specs #002–#013.
- [ ] T040 Ejecutar desde el workspace todas las validaciones de CI y los smoke checks de staging; confirmar que el PR a `develop` despliega las tres apps solo cuando los gates pasan.
- [ ] T041 Actualizar el estado de Spec #001 en `specs/README.md` a `Terminada` únicamente después de aprobar el PR, desplegar/verificar staging y cumplir la definición de terminado del proyecto.

**Checkpoint F0**: PR revisado, CI y quality gate aprobados, despliegue de las tres aplicaciones a staging verificado, y trazabilidad/artefactos de equipo disponibles.

## Dependencies & Execution Order

### Dependencias entre fases

- **Setup (Phase 1)**: T001 → T002/T003 → T004. El workspace precede a cualquier paquete de aplicación.
- **Foundational (Phase 2)**: depende de la raíz del workspace. T005–T007 inicializan apps distintas; T008 es independiente de esas apps; T009–T012 configuran herramientas sobre los manifiestos existentes; T013 protege la configuración de entorno.
- **US1 (Phase 3)**: depende de T005–T013. En cada app, crear primero prueba (T014–T016) y luego ruta/página (T017–T019). T020–T022 cierran scripts, ejecución y comandos documentados.
- **US2 (Phase 4)**: depende de que los scripts de apps y pruebas existan (US1). T025–T026 preparan checks; T027–T029 requieren secretos y configuración de cuentas administradas por el equipo; T023/T030 verifican el despliegue de staging. T031 depende de permisos y configuración de producción.
- **US3 (Phase 5)**: las plantillas y el tablero pueden prepararse una vez disponible el repo. La integración y dashboard de Grafana dependen de accesos de GitHub/Grafana y de actividad de CI/despliegue (US2).
- **Polish (Phase 6)**: depende de que US1, US2 y US3 estén completos. T041 es el último paso y solo se marca al cumplir el criterio F0.

### Dependencias por historia

- **US1 (P1)**: Setup y Foundational completos. Validación independiente local de estructura, página inicial y health checks.
- **US2 (P1)**: US1 completa para ejecutar scripts reales; depende además de cuentas y secretos externos. No se despliega a producción durante validación de staging.
- **US3 (P2)**: las plantillas/tablero son independientes una vez existe GitHub; T035 y T036 dependen de CI/despliegues funcionales de US2 y de los accesos externos.

### Oportunidades de paralelismo

- Tras T001–T003, T005, T006, T007 y T008 pueden prepararse en paralelo en sus rutas distintas.
- T009–T012 pueden trabajarse en paralelo si cada tarea mantiene sus archivos/configuración separados; T013 puede avanzar en paralelo con ellas.
- En US1, las pruebas T014–T016 pertenecen a aplicaciones distintas; tras su definición, implementaciones T017–T019 pueden avanzar en paralelo.
- En US3, T032 y T033 son independientes por usar archivos distintos. El tablero y Grafana requieren accesos externos, pero no comparten archivos locales.

### Bloqueos y prerrequisitos pendientes

- **T028**: no hay sesión autenticada ni herramienta conectada para configurar GitHub Actions. Faltan la cuenta/proyecto de SonarQube Cloud y `SONAR_TOKEN`, `SONAR_ORGANIZATION`, `SONAR_PROJECT_KEY`; Vercel y `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_WEB`; los hooks de Render `RENDER_API_DEPLOY_HOOK_STAGING/PRODUCTION` y `RENDER_REPORTS_DEPLOY_HOOK_STAGING/PRODUCTION`; y las URLs `WEB_URL_*`, `API_URL_*`, `REPORTS_URL_*`. Los valores deben ingresarse en GitHub Environments/Secrets/Variables, nunca en archivos.
- **T029**: requiere permisos de administrador del repositorio en GitHub para proteger `main` y `develop` y exigir el check de CI.
- **T030**: requiere publicar la rama y abrir/ejecutar un PR para que GitHub ejecute los workflows, además de las URLs y servicios de staging. La instrucción vigente prohíbe commits, push y merges, por lo que esta validación remota no puede realizarse en esta sesión.
- **T031**: faltan acceso a las cuentas/proyectos de producción de Vercel y Render y sus valores de entorno. No se hizo ningún despliegue de producción.
- **T034**: requiere permisos para crear y administrar GitHub Projects en la organización/repositorio.
- **T035**: requiere una organización/cuenta de Grafana Cloud y permisos para conectar GitHub como datasource y crear el dashboard.
- **T036**: depende de T030 y T035; no hay staging ni datasource de Grafana para verificar actividad real.
- **T037–T039**: están pendientes por la dependencia de fase declarada: Polish empieza después de completar US2 y US3.
- **T040–T041**: requieren CI/quality gate remoto, PR aprobado y staging verificado; no se ejecutan ni se cambia el estado del catálogo mientras esos prerrequisitos falten.

## Implementation Strategy

### MVP first

1. Completar Setup y Foundational para tener workspace, aplicaciones y servicios locales.
2. Completar US1 con pruebas de health y smoke web; validar la ejecución local.
3. Completar US2 hasta staging: CI bloqueante, SonarQube y despliegue de las tres aplicaciones.
4. Completar US3 con plantillas, tablero y trazabilidad en Grafana.
5. Completar Polish y cerrar F0 solo cuando un PR revisado a `develop` supere los gates y las tres apps estén verificadas en staging.

### Estrategia incremental

- La primera entrega demostrable es US1 (P1): base del monorepo y apps ejecutables localmente.
- US2 (P1) convierte la base en una entrega integrada y desplegable, criterio central de cierre F0.
- US3 (P2) completa la gestión del equipo y trazabilidad sin bloquear el diseño de apps, aunque es requisito para cerrar el alcance total de F0.

## Notes

- `[P]` solo indica tareas paralelizables en distintos archivos; las dependencias externas pueden impedir su cierre aunque no compartan archivos.
- Cada tarea de historia incluye `[US#]` para trazabilidad con `spec.md`; Setup, Foundational y Polish no llevan etiqueta de historia.
- Los nombres de workflows y archivos de configuración corresponden al árbol acordado en `plan.md`; si el proveedor requiere otro archivo de configuración, conservar el mismo requisito y actualizar la ruta al implementar.
- No se crean aquí los archivos enumerados: este documento define tareas futuras; no implementa código ni configuración.
