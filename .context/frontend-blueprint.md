# Estándar de Arquitectura Frontend
- **Framework:** React + Vite.
- **Routing:** TanStack Router (File-based).
- **Estilos:** Tailwind CSS (utility-first).
- **Componentes:** Deben ser funcionales, pequeños y exportados por nombre.
- **Carpeta /components:** - `ui/`: Componentes base (botones, inputs de shadcn).
  - `layout/`: Componentes globales (Sidebar, Navbar).
  - `dashboard/`, `inventory/`, `notifications/`: Componentes específicos por dominio.
- **Naming:** PascalCase para archivos de componentes (.tsx), camelCase para funciones.