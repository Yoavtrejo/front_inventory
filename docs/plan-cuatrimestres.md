# Plan: cierre de cuatrimestre y paso al siguiente

> Estado: **listo para implementar**. No se ha empezado.
> Backend: `~/Proyectos/Backlab/back_inventario` (rama `v1.0`, preparado sobre `a668a80`).
> Frontend: este repo (rama `moduloDocenteAlumno`).
> Para arrancar, envía la sección **Backend** a la sesión del backend. El frontend se hace cuando el backend confirme el contrato.

## Contexto y decisiones

Hoy un cuatrimestre (`Term`) solo tiene `name` y `description`. No existe la noción de cuatrimestre activo ni de cierre. Por eso:

- Las actividades de cuatrimestres pasados se mezclan con las actuales en las vistas del alumno y del docente.
- Los grupos viejos siguen abiertos: se puede entregar y calificar en ellos.
- "Unirme a un grupo" ofrece grupos de todos los cuatrimestres.
- No hay pantalla para crear cuatrimestres, materias ni grupos (solo `/admin/` de Django o la API).

Decisiones tomadas con el usuario:

1. **El historial no es una copia.** Son los mismos registros marcados como cerrados. Actividades, entregas, calificaciones y préstamos se conservan siempre.
2. **El docente vive en el grupo.** Un cuatrimestre nuevo implica grupos nuevos, cada uno con su materia y su docente. El docente de un grupo se puede cambiar a mitad del cuatrimestre sin perder datos.
3. **Tanto el admin como los docentes pueden pasar alumnos al siguiente cuatrimestre**, pero los docentes solo lo pueden hacer **durante la ventana de cierre**.
4. **Los docentes ven los grupos ajenos solo de forma limitada:** nombre, materia, docente y número de alumnos. Nunca ven actividades, entregas ni calificaciones de otros.
5. **Importar crea un grupo nuevo del docente que importa**; el grupo de origen no se toca. Un mismo grupo de origen lo pueden importar varios docentes, uno por materia.
6. **Retención de archivos:** los archivos de entregas y actividades de cuatrimestres cerrados hace más de N meses (por defecto 12) se pueden borrar. Los datos y las calificaciones se quedan. Antes de borrar, el admin descarga un .zip por cuatrimestre.

Estimación de peso: con 500 alumnos, 6 materias y unas 20 actividades por materia, un cuatrimestre son unas 60 mil filas (~15 MB en PostgreSQL) más unos ~6 GB de archivos. Lo que pesa son los archivos, no la BD.

---

## Backend

### 1. Modelos

**`academic.Term`**, agregar:

| Campo | Tipo | Notas |
|---|---|---|
| `start_date` | DateField | obligatorio |
| `end_date` | DateField | obligatorio, mayor que `start_date` |
| `is_active` | BooleanField | solo uno activo a la vez (validar al guardar) |
| `closed_at` | DateTimeField null | se llena al cerrar |
| `rollover_opens` | DateField null | inicio de la ventana para docentes; por defecto `end_date − 14 días` |
| `rollover_closes` | DateField null | fin de la ventana; por defecto `start_date` del siguiente + 14 días, o `end_date + 30 días` si aún no hay siguiente |

- Propiedad `is_closed = closed_at is not None`.
- Migración de datos: los terms existentes quedan con fechas razonables (inicio = hoy, fin = hoy + 4 meses) y el más reciente con `is_active=True`.

**`academic.ClassGroup`**, agregar:

- `source_group` = FK a sí mismo, null, `on_delete=SET_NULL`, `related_name='continuations'`: el grupo del que se importaron los alumnos.

**`users.UserProfile`**, agregar:

- `cuatrimestre` = `PositiveSmallIntegerField(null=True)`: el cuatrimestre que cursa el alumno (3, 4, …). Es informativo y sirve para filtrar.

### 2. Reglas de cierre

- **Cuatrimestre cerrado → solo lectura** para docentes y alumnos:
  - No se crean, editan ni borran actividades, equipos ni entregas en sus grupos → 400 `"El cuatrimestre <nombre> está cerrado."`.
  - Calificar (PATCH a submissions) también se bloquea.
  - `join` a grupos de un cuatrimestre cerrado → 400.
  - El admin sí puede editar, para corregir calificaciones después del cierre.
- **Recordatorios por correo** (`enviar_recordatorios`): ignorar actividades de cuatrimestres cerrados.

### 3. Endpoints

**Cuatrimestres** — `/api/academic/terms/`

- `GET` (autenticado): lista con `{id, name, description, start_date, end_date, is_active, is_closed, closed_at, rollover_opens, rollover_closes, rollover_open_now}`.
  - `rollover_open_now` indica si la ventana está abierta en este momento.
- `POST` / `PATCH` / `DELETE`: **solo admin**. Hoy `IsTeacherOrReadOnly` deja escribir al docente, y eso debe cambiar. No se puede borrar un term que tenga grupos (PROTECT → 400 legible).
- `POST /api/academic/terms/{id}/activate/`: solo admin. Lo marca activo y desactiva el anterior.
- `POST /api/academic/terms/{id}/close/`: solo admin.
  - Pone `closed_at`.
  - Si `{"avanzar_alumnos": true}`, suma 1 al `cuatrimestre` de los alumnos inscritos en grupos de ese term (sin pasar de un tope configurable, por ejemplo 12).
  - Responde un resumen: `{grupos, alumnos_avanzados}`.

**Materias** — `/api/academic/subjects/`

- Escritura **solo admin**; lectura para autenticados.

**Grupos** — `/api/academic/classgroups/`

- Filtro `?term=<id>` y `?term=active` (por defecto las vistas del frontend piden `active`).
- En la respuesta, agregar `term_is_active`, `term_is_closed` y `source_group` (id o null).
- **Admin:** CRUD completo, incluido cambiar `teacher` a mitad del cuatrimestre.
- **Docente:** crea grupos propios (ya existe); edita o borra solo los suyos, y **no puede reasignar** el teacher (ya existe).
- `GET /api/academic/classgroups/rollover-sources/?from_term=<id>` (docente o admin):
  - Lista **limitada** de los grupos de un cuatrimestre: `[{id, name, subject_name, teacher_name, student_count}]`.
  - Sin `students`, `students_detail`, actividades ni calificaciones.
  - Por defecto `from_term` = el term activo o el más reciente con cierre abierto.
  - **Docente:** solo si la ventana de `from_term` está abierta; si no → 403 `"La importación de alumnos solo está disponible del <rollover_opens> al <rollover_closes>."`.
- `GET /api/academic/classgroups/{id}/rollover-preview/` (mismas reglas de permiso y ventana):
  - Devuelve los alumnos del grupo de origen **solo para escoger a quién importar**: `[{id, matricula, first_name, last_name}]`, sin email ni calificaciones.
- `POST /api/academic/classgroups/rollover/` (docente en ventana, o admin):
  - Body: `{"source_group": 12, "term": 5, "subject": 3, "name": "ISC44", "student_ids": [ … ], "teacher": 7}`.
  - `teacher` solo lo puede enviar el admin; al docente se le asigna él mismo.
  - `student_ids` es opcional (por defecto todos los del origen). Debe ser un subconjunto de los alumnos del origen → si no, 400.
  - El `term` destino no puede estar cerrado.
  - Respeta `unique_together (name, term, subject)` → 400 `"Ya existe el grupo <name> de <materia> en <term>."`.
  - Crea el grupo con `source_group` apuntando al origen. El grupo de origen no se modifica.
  - Responde el grupo creado (mismo serializer que classgroups).

**Retención de archivos**

- `GET /api/academic/terms/{id}/archivo/` (admin): descarga un .zip con los archivos de entregas y actividades del cuatrimestre, organizado por `grupo/actividad/alumno_archivo`. Usar streaming para que no cargue todo en memoria.
- Management command `purgar_archivos --meses 12 [--dry-run]`:
  - Borra del disco los archivos (`student_file`, `teacher_file`) de cuatrimestres **cerrados** hace más de N meses y pone el campo en null.
  - Registra cuántos archivos y cuántos MB liberó.
  - Nunca toca cuatrimestres abiertos.

### 4. Tests

- Solo puede haber un term activo; `activate` desactiva el anterior.
- Term cerrado: docente y alumno reciben 400 al crear actividad, entregar o calificar, y 400 al hacer `join`; el admin sí puede editar.
- `close` con `avanzar_alumnos` incrementa `cuatrimestre` una sola vez por alumno, aunque esté en varios grupos.
- `rollover-sources` y `rollover-preview`: 403 para el docente fuera de la ventana; OK dentro. No exponen email, actividades ni calificaciones.
- `rollover`:
  - Crea un grupo con el docente correcto.
  - Rechaza `student_ids` que no son del origen.
  - Rechaza nombres duplicados.
  - No modifica el origen.
  - Dos docentes pueden importar el mismo origen con materias distintas.
- Terms y subjects: escritura solo admin (el docente recibe 403).
- `purgar_archivos --dry-run` no borra nada; sin dry-run solo afecta cuatrimestres cerrados hace más de N meses.
- `enviar_recordatorios` ignora cuatrimestres cerrados.

---

## Frontend

### 1. Admin — nueva sección "Gestión académica" (`/admin/academico`)

- Agregar a `ADMIN_NAV` (`src/constants/navigations.ts`).
- **Pestaña Cuatrimestres:**
  - Tabla con nombre, fechas, estado (Activo / Abierto / Cerrado) y ventana de importación.
  - Crear o editar en un modal.
  - Acciones: **Activar**, **Cerrar**. Cerrar pide confirmación y ofrece la casilla "Avanzar a los alumnos al siguiente cuatrimestre", y muestra el resumen.
  - **Descargar archivos (.zip)**.
- **Pestaña Materias:** CRUD simple.
- **Pestaña Grupos:**
  - Filtro por cuatrimestre.
  - Crear o editar grupo, cambiando docente, materia y alumnos.
  - **Pasar al siguiente cuatrimestre**: abre el mismo asistente que el docente, pero pudiendo elegir docente y sin restricción de ventana.

### 2. Docente

- **Grupos** (`/docente/grupos`):
  - Por defecto muestra solo el cuatrimestre activo.
  - Selector "Cuatrimestres anteriores" para consultar, en solo lectura.
- **Botón "Importar alumnos de otro grupo"**:
  - Visible solo si `rollover_open_now` del cuatrimestre correspondiente es verdadero.
  - Fuera de la ventana, muestra un aviso con las fechas.
- **Asistente de importación** (`/docente/grupos/importar`):
  1. Elegir el grupo de origen: lista limitada de `rollover-sources`, con buscador por nombre o materia.
  2. Revisar alumnos: la lista de `rollover-preview` con casillas, todas marcadas por defecto, para quitar bajas o reprobados.
  3. Datos del grupo nuevo: nombre (sugerido: se sube el dígito del cuatrimestre, ISC34 → ISC44, editable), materia y cuatrimestre destino (el activo o el siguiente).
  4. Confirmar → `POST rollover` → ir al detalle del grupo nuevo.
- **Grupos de cuatrimestres cerrados:**
  - Se muestran con la etiqueta "Cerrado".
  - Sin botones de crear actividad, equipos ni calificar; los inputs quedan deshabilitados.
  - Si el backend responde 400 de cuatrimestre cerrado, mostrar su mensaje.

### 3. Alumno

- **Inicio y Actividades:** por defecto solo el cuatrimestre activo (`?term=active`).
- Sección o selector **"Cuatrimestres anteriores"** para ver actividades y calificaciones pasadas, sin botones de entrega.
- **"Unirme a un grupo":** solo grupos del cuatrimestre activo.
- **Perfil:** mostrar "Cuatrimestre: N" si existe.

### 4. Archivos a tocar (referencia)

- `src/features/academic/` → tipos (`Term`, campos nuevos de `ClassGroup`), servicio (terms, rollover-sources, rollover-preview, rollover), y `useAcademicData` (parámetro `term`).
- `src/features/docente/` → `GruposDocente`, `GrupoDetalle`, `EntregasTable`, `ActividadesDocente` (solo lectura si está cerrado), y el nuevo `ImportarAlumnos` con su hook.
- `src/features/alumno/` → filtro por cuatrimestre activo y vista de anteriores.
- Nueva feature `src/features/academico-admin/` (componentes, hooks, servicio, `index.ts`) y la página `src/app/(admin)/admin/academico/page.tsx`.
- `src/features/perfil/` → mostrar el cuatrimestre.

### 5. Verificación

- `npx tsc --noEmit`, `npm run lint` (sin errores nuevos) y `npm run build`.
- E2E con Playwright contra `:8000`:
  1. Admin crea el cuatrimestre siguiente con la ventana abierta.
  2. Docente importa ISC34 → ISC44 quitando un alumno. El grupo nuevo tiene los alumnos correctos y el origen no cambió.
  3. Un docente fuera de la ventana no ve el botón, y la API responde 403.
  4. Admin cierra el cuatrimestre anterior con "avanzar alumnos" y el perfil del alumno muestra N+1.
  5. En el grupo cerrado no se puede entregar ni calificar, pero se puede consultar.
  6. Las vistas por defecto solo muestran el cuatrimestre activo, y "Cuatrimestres anteriores" muestra lo viejo.
- Recorrido de todas las rutas de los tres roles sin errores de consola.

⚠️ El `.env` del backend tiene Gmail real: las pruebas no deben disparar correos, salvo a la cuenta del usuario (2234102@upt.edu.mx) si él lo autoriza.
