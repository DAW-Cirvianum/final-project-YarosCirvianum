# Descripció Funcional del Frontend (React + Vite)

El frontend s'ha desenvolupat com una **Single Page Application (SPA)** utilitzant React i Vite. L'objectiu principal ha estat crear una interfície intuïtiva i modular, desconectada del backend però comunicant-se eficientment via API REST.

A continuació detallo l'arquitectura i les solucions tècniques implementades:

## Arquitectura i Navegació

L'aplicació s'estructura al voltant de **React Router DOM**, utilitzant rutes niades i protegides per gestionar l'accés.

* **Layout Principal:** He utilitzat un component `AppLayout` que manté l'estructura fixa (`Sidebar` i `Navbar`) mentre canvia el contingut principal (`Outlet`), evitant renderitzats innecessaris.
* **Seguretat:** Totes les rutes privades estan envoltades pel component `ProtectedRoute`, que verifica l'autenticació contra l'AuthContext abans de permetre l'accés.
* **Gestió d'Errors:** S'inclou una ruta *wildcard* (`*`) per gestionar errors 404 i redirigir l'usuari de manera segura.

## Gestió de l'Estat (Context API)

En lloc d'afegir complexitat amb llibreries externes com Redux, he optat per la **Context API** nativa de React per gestionar l'estat global.

1. **AuthContext:** Gestiona la sessió de l'usuari, la persistència del token (localStorage) i les funcions de login/logout.
2. **NotificationContext:** Un sistema global de *Feedback* a l'usuari. Permet llançar notificacions tipus "Toast" (èxit o error) des de qualsevol punt de l'aplicació i permet ensenyar finestres de confirmació custom per accions com "Delete".

## Comunicació amb l'API (Custom Hooks)

Per mantenir el codi més net i polit he intentat minimitzar el codi centralitzant la lògica de les peticions en Hooks personalitzats:

* **useGet:** Hook que gestiona la càrrega de dades (loading states), la paginació (meta dades) i  refresc de llistats.
* **useSubmit:** Centralitza la lògica d'enviament de formularis (POST/PUT), gestionant automàticament els estats de càrrega i, molt important, mapejant els errors de validació del servidor (Laravel) directament als camps del formulari React.
* **Servei API:** Una instància d'Axios configurada amb interceptors per injectar automàticament el *Bearer Token* a cada petició.

## Components i Modularitat

He dissenyat les pantalles (Owners, Devices, Providers, Contracts) seguint un patró mestre-detall reutilitzable:

* **ActionsBar:** Barra superior amb filtres dinàmics i cerca en temps real.
* **FormFields & ViewFields:** He separat la lògica de visualització de la d'edició, permetent reutilitzar els mateixos formularis tant per crear com per editar (passant `initialData`).
* **Components UI:** He creat components com `SelectSearch` (un selector amb autocompletat asíncron) i `Modal` per poder reutilitzar millor el codi i segmentar-lo de forma modular.

## Disseny i Accessibilitat (Tailwind CSS)

El disseny s'ha implementat utilitzant **Tailwind CSS**.

* **Responsive:** El *layout* s'adapta automàticament. Per exemple, les graelles de dades passen d'1 columna a mòbil a 4 columnes a escriptori (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
* **Accessibilitat (ARIA):** He aplicat atributs ARIA (`role`, `aria-label`, `aria-live`) a elements clau com les barres d'accions, missatges d'error i el Dashboard per garantir una bona navegació per teclat i lectors de pantalla.

## Funcionalitats Extra (Dashboard)

El Dashboard principal no només mostra estadístiques estàtiques, sinó que implementa funcionalitats avançades:

* **Polling de Dades:** S'actualitzen les estadístiques i es fa una crida a una API externa periòdicament utilitzant `setInterval` dins del `useEffect`, simulant un comportament en temps real sense recarregar la pàgina.

---

## Resum de Requisits Complerts

| Àrea | Detall de la Implementació |
| :--- | :--- |
| **Rutes** | React Router, Nested Routes, Protected Routes, Gestió 404. |
| **Estat** | Context API per a Autenticació i Notificacions globals. |
| **Formularis** | Validació dual (Client/Servidor), Feedback d'errors en línia. |
| **Dades** | Custom Hooks (useGet, useSubmit), Paginació, Axios Interceptors. |
| **UI/UX** | Tailwind Responsive, Modals, Toasts, ARIA Attributes. |
| **Extra** | Dashboard amb consum d'API externa i actualització periòdica. |