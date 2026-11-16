# Feature Specification: Fundaciones del monorepo

**Feature Branch**: `[feature/spec-1]`  
**Created**: 2026-11-15  
**Status**: Draft  
**Input**: User description: "Crear las fundaciones del monorepo para las tres aplicaciones del sistema, con controles de calidad, CI/CD, despliegue y trazabilidad del equipo, conforme a F0 de PLAN.md."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Preparar la base del proyecto (Priority: P1)

Como integrante del equipo, quiero trabajar desde una estructura común para las aplicaciones web, API y reportes, para que las siguientes fases puedan desarrollarse dentro de la arquitectura acordada.

**Why this priority**: Las fases posteriores dependen de que exista la estructura de monorepo y sus aplicaciones base.

**Independent Test**: Revisar el repositorio y confirmar que contiene las tres aplicaciones previstas, el espacio compartido definido en el plan y las herramientas comunes de calidad; comprobar que API y reportes exponen su ruta `/health`.

**Acceptance Scenarios**:

1. **Given** un repositorio recién preparado para F0, **When** un integrante revisa la estructura, **Then** encuentra `apps/web`, `apps/api`, `apps/reports` y `packages/shared` dentro del monorepo definido por el proyecto.
2. **Given** que las aplicaciones API y reportes están disponibles, **When** se consulta `/health` en cada una, **Then** cada aplicación responde indicando que está disponible.
3. **Given** la base del proyecto configurada, **When** se verifica la calidad del código, **Then** están disponibles ESLint, Prettier, TypeScript estricto y Ruff según el plan, además de Commitlint y Husky para Conventional Commits.

---

### User Story 2 - Validar y desplegar cambios de integración (Priority: P1)

Como integrante del equipo, quiero que los cambios propuestos a `develop` pasen los controles acordados y se desplieguen a staging, para validar las tres aplicaciones de forma integrada.

**Why this priority**: El criterio de cierre de F0 exige que un PR a `develop` despliegue automáticamente las tres aplicaciones en staging.

**Independent Test**: Abrir un PR dirigido a `develop` y verificar que el flujo ejecuta lint, tipos, pruebas y análisis de SonarQube con quality gate bloqueante, y que tras cumplir los controles despliega las tres aplicaciones a staging.

**Acceptance Scenarios**:

1. **Given** un PR dirigido a `develop`, **When** se ejecuta CI, **Then** se realizan lint, verificación de tipos, pruebas y análisis de SonarQube en ese orden, y el quality gate bloquea la integración si no se aprueba.
2. **Given** que el PR a `develop` cumple los controles requeridos, **When** termina el flujo de integración, **Then** las tres aplicaciones quedan desplegadas en staging.
3. **Given** un cambio integrado en `main`, **When** se ejecuta el flujo de despliegue, **Then** se despliega a producción conforme a la estrategia descrita en los documentos del proyecto.
4. **Given** que `main` y `develop` son ramas de integración protegidas, **When** se propone integrar un cambio, **Then** se requiere un PR revisado y los controles CI definidos.

---

### User Story 3 - Organizar contribuciones y ver trazabilidad (Priority: P2)

Como integrante del equipo, quiero disponer de convenciones de contribución y una vista de actividad del desarrollo, para coordinar el trabajo y seguir los cambios, revisiones, despliegues y métricas DORA.

**Why this priority**: Las plantillas, el tablero y Grafana forman parte de F0 y permiten seguir el trabajo del equipo durante las fases posteriores.

**Independent Test**: Revisar que existen plantillas para issues y PRs y un tablero de proyecto de GitHub; comprobar que el dashboard de Grafana está conectado a GitHub y presenta la trazabilidad acordada.

**Acceptance Scenarios**:

1. **Given** un colaborador que abre una issue o prepara un PR, **When** consulta el repositorio, **Then** encuentra las plantillas correspondientes y el proyecto cuenta con un tablero en GitHub.
2. **Given** la actividad del repositorio y sus despliegues, **When** el equipo consulta el dashboard de Grafana, **Then** puede revisar commits, PRs, tiempo de revisión, despliegues, fallos del pipeline y métricas DORA.

### Edge Cases

- Si un control de lint, tipos, pruebas o SonarQube falla, el PR no debe superar el quality gate ni activar el despliegue que depende de ese flujo.
- Si una de las tres aplicaciones no puede desplegarse a staging desde el PR a `develop`, F0 no satisface su criterio de cierre.
- Si falta configuración o acceso a un servicio externo requerido por CI, despliegue o Grafana, el flujo debe dejar visible el fallo; la forma de provisionar esos accesos no está especificada en los documentos fuente.
- Si se propone añadir una aplicación distinta de `apps/web`, `apps/api` y `apps/reports`, la propuesta debe respetar la constitución, que exige enmendarla antes de añadir un servicio nuevo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El repositorio MUST organizar el producto como monorepo con `apps/web`, `apps/api`, `apps/reports` y `packages/shared`, conforme a `PLAN.md` y a los límites de servicio de la constitución.
- **FR-002**: `apps/web` MUST corresponder a la aplicación Next.js con TypeScript; `apps/api` MUST corresponder a la API NestJS con TypeScript; `apps/reports` MUST corresponder al servicio Python con FastAPI y pandas.
- **FR-003**: `apps/api` y `apps/reports` MUST exponer una ruta `/health` como comprobación básica de disponibilidad en F0.
- **FR-004**: El monorepo MUST usar pnpm workspaces y Turborepo, y MUST contar con ESLint, Prettier, TypeScript estricto, Ruff, Commitlint y Husky según el plan.
- **FR-005**: El repositorio MUST aplicar Git Flow con `main`, `develop`, `feature/*`, `release/*` y `hotfix/*`; `main` y `develop` MUST requerir PR revisado y CI antes de integrar cambios.
- **FR-006**: El flujo CI MUST ejecutar lint, verificación de tipos, pruebas y análisis de SonarQube, con quality gate bloqueante.
- **FR-007**: Los cambios integrados desde `develop` MUST desplegar las tres aplicaciones a staging; los cambios integrados desde `main` MUST desplegar a producción en Vercel y Render conforme al despliegue por rama descrito en los documentos.
- **FR-008**: El entorno local MUST permitir levantar PostgreSQL y Redis mediante Docker Compose, según F0.
- **FR-009**: El proyecto MUST contar con Grafana Cloud conectado al repositorio para mostrar commits, PRs, tiempo de revisión, despliegues, fallos del pipeline y métricas DORA.
- **FR-010**: El repositorio MUST incluir plantillas de issue y PR, además de un tablero de proyecto en GitHub.
- **FR-011**: Los secretos de despliegue e integración MUST mantenerse fuera del frontend y del repositorio, en variables de entorno conforme a la constitución y a las instrucciones del proyecto.
- **FR-012**: F0 MUST limitarse a las fundaciones del monorepo y su entrega automatizada; autenticación, dinero, apuestas, partidos, liquidación, promociones y reportes funcionales pertenecen a fases y specs posteriores.

### Key Entities

- **Monorepo**: Repositorio que contiene las tres aplicaciones del producto y el paquete compartido previsto por el plan.
- **Aplicación**: Componente desplegable del producto: web, API o reportes, con la tecnología y destino definidos en los documentos fuente.
- **Flujo CI/CD**: Controles automatizados de calidad e integración, junto con el despliegue que corresponde a la rama.
- **Entorno de despliegue**: Destino staging o producción asociado a `develop` o `main` respectivamente.
- **Dashboard de trazabilidad**: Vista del equipo en Grafana sobre actividad GitHub, despliegues, fallos del pipeline y métricas DORA.
- **Artefactos de colaboración**: Plantillas de issue/PR y tablero de proyecto de GitHub.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El repositorio presenta las tres rutas de aplicación requeridas y el paquete compartido previsto en el plan.
- **SC-002**: Las comprobaciones `/health` de API y reportes responden satisfactoriamente cuando cada aplicación está disponible.
- **SC-003**: Un PR a `develop` ejecuta todos los controles CI especificados y, al aprobarlos, despliega las tres aplicaciones a staging.
- **SC-004**: Un cambio integrado a `main` tiene configurado el despliegue de producción correspondiente a las aplicaciones web y servicios desplegados en Vercel y Render.
- **SC-005**: El equipo puede localizar en Grafana las seis clases de información acordadas: commits, PRs, tiempo de revisión, despliegues, fallos de pipeline y métricas DORA.
- **SC-006**: El repositorio contiene plantillas de issue y PR y un tablero de proyecto de GitHub.

## Assumptions

- F0 se limita al alcance descrito en `PLAN.md` y en la fila 001 del catálogo; no implementa funcionalidades de apuestas ni de dinero.
- Las decisiones técnicas explícitas de `PLAN.md` y `CLAUDE.md` son restricciones de esta spec, aunque la especificación de usuario no define detalles de implementación adicionales.
- El despliegue automatizado de `develop` a staging es el criterio de cierre de F0; el despliegue de `main` a producción queda configurado según la estrategia de ramas de los documentos.
- Los proyectos y credenciales necesarios de GitHub, SonarQube, Vercel, Render y Grafana estarán disponibles cuando se configure la entrega. Los documentos no especifican quién los provisiona ni cómo se administran.
