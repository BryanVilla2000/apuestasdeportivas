# Colaboración y flujo de Git

## Antes de trabajar

1. Consulta `promtp.md`, `PLAN.md`, la constitución y la Spec activa antes de cambiar alcance o arquitectura.
2. Sigue `tasks.md` en orden y respeta sus dependencias. No marques una tarea hasta completarla y validarla.
3. Mantén el cambio dentro de la Spec aprobada. Las funcionalidades fuera de F0 necesitan su propia Spec.

## Ramas e integración

- `main` representa producción y `develop` integración.
- Las features parten de `develop` y entran mediante Pull Request; no se integra directamente en `main` ni `develop`.
- Para las ramas de Specs nuevas, la constitución establece `feature/NNN-nombre-corto`.
- `release/*` y `hotfix/*` siguen Git Flow y también se integran mediante Pull Request.
- Los mensajes de commit usan Conventional Commits; Husky ejecuta Commitlint al crear el commit.

## Validación local

Desde la raíz, ejecuta los controles pertinentes al cambio:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm reports:lint
pnpm reports:test
pnpm run format:check
pnpm build
```

`pnpm test` cubre Jest/Supertest para la API y Playwright para web. Las pruebas de reportes se ejecutan con pytest mediante `pnpm reports:test`.

## Pull Requests

Usa `.github/PULL_REQUEST_TEMPLATE.md` y enlaza la issue o Spec relacionada. Resume el alcance, enumera las validaciones ejecutadas y señala cualquier control que no haya podido verificarse. Los checks de CI y el quality gate de SonarQube deben aprobarse antes de integrar.

## Secretos

No guardes tokens, URLs de deploy hooks ni credenciales en archivos versionados o en el frontend. Configura los valores requeridos en los secretos/variables del entorno correspondiente y no los incluyas en issues ni Pull Requests.
