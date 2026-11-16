# Desarrollo local

## Aplicaciones

- Web: `pnpm --filter @apuestasdeportivas/web dev` en `http://localhost:3000`.
- API NestJS: `pnpm --filter @apuestasdeportivas/api start:dev` en el puerto `3001`; disponibilidad en `/health`.
- Reportes FastAPI: `pnpm reports:dev` en el puerto `8000`; `REPORTS_PORT` permite elegir otro puerto. Disponibilidad en `/health`.

El servicio de reportes se administra con `uv` desde `apps/reports`; no forma parte de los paquetes JavaScript de pnpm.

## PostgreSQL y Redis locales

`docker-compose.yml` configura PostgreSQL y Redis con healthchecks de Compose. Inícialos y consulta su estado/logs con:

```bash
docker compose up -d
pnpm infra:status
pnpm infra:logs
```

Los puertos locales son `5432` para PostgreSQL y `6379` para Redis. Las credenciales de desarrollo se documentan como ejemplos en `.env.example`; los archivos `.env` permanecen ignorados.

Las rutas `/health` de API y reportes solo informan disponibilidad y no conectan con datos de negocio. La comprobación local de PostgreSQL/Redis se basa en el estado de los healthchecks de Compose.

## Controles

Los comandos comunes de instalación, lint, tipos, pruebas, formato y build están en `CONTRIBUTING.md`. La configuración de CI ejecuta lint → tipos → pruebas → análisis SonarQube; el despliegue local depende de los valores externos documentados en `specs/001-fundaciones-monorepo/tasks.md`.
