# Descripció Funcional del Backend (Laravel)

El backend d'aquest projecte s'ha desenvolupat amb **Laravel 11**, funcionant principalment com una API RESTful per servir al frontend (React), però incloent també una secció d'administració clàssica renderitzada pel servidor (Blade) per complir amb els requisits específics del projecte.

A continuació es detalla l'arquitectura i com s'han resolt els requisits tècnics:

## Base de Dades i Models (ORM)

L'arquitectura de dades supera el mínim de 7 taules requerides, amb relacions ben definides (1:N i N:M) per assegurar la integritat de l'inventari.

### 1. Estructura d'Entitats
* **User:** Gestió d'usuaris amb rols diferenciats (admin i user).
* **Device:** Taula central que emmagatzema l'inventari (ordinadors, perifèrics) i el seu estat.
* **Owner:** Empleats o departaments als quals s'assignen els dispositius.
* **Provider & RentalContract:** Gestió de proveïdors i contractes de rènting, vital per al control de costos.
* **DeviceIncident:** Registre d'incidències tècniques.
* **Invoices & LegacyDevices:** Taules per a facturació i migració de sistemes antics.

### 2. Migracions i Evolució
Per demostrar la capacitat de modificar una base de dades en producció, s'han inclòs migracions de modificació posteriors a la creació inicial:
* 2026_01_16_..._add_notes_to_providers_table.php
* 2026_01_16_..._add_terms_to_rental_contracts_table.php

### 3. Dades de Prova (Seeding)
S'ha implementat el DatabaseSeeder juntament amb Factories per a tots els models, permetent desplegar un entorn de proves amb dades i amb usuaris, dispositius i contractes realistes amb una sola comanda.

---

## API RESTful

La comunicació amb el client (React) es realitza via JSON, seguint una estructura estandarditzada.

### Controladors i Recursos
S'ha utilitzat un helper personalitzat ApiResponse per garantir que totes les respostes (èxit o error) tinguin el mateix format.
* **DeviceController:** CRUD complet de dispositius amb filtres avançats (per estat, tipus, propietari).
* **StatsController (Dashboard):** Agrega estadístiques globals i implementa una funcionalitat extra: connecta amb una API externa (ZenQuotes) per mostrar contingut dinàmic al dashboard.
* **Swagger / OpenAPI:** Documentació automàtica de cada endpoint utilitzant atributs PHP (#[OA\Get], etc.) directament als controladors.

---

## Autenticació i Seguretat

S'ha implementat un sistema híbrid per cobrir tant l'API com la part Web:

1. **API (Laravel Sanctum):** Utilitzat per a l'autenticació del frontend React mitjançant Bearer Tokens.
2. **Web (Sessions):** Utilitzat exclusivament per al panell d'administració Blade.
3. **Login Flexible:** El sistema permet iniciar sessió tant amb Username com amb Email.
4. **Recuperació de Contrasenya:** Implementat a través de RecoveryController per enviar enllaços de restabliment via email.
5. **Rols i Middleware:** S'ha creat el middleware IsAdmin per protegir les rutes sensibles i el panell de gestió.

---

## Panell d'Administració (Blade)

Per complir amb el requisit de tenir funcionalitat "Server-Side Rendered" per a administradors, s'ha creat una àrea independent:

* **Tecnologia:** Vistes Blade pures amb Tailwind CSS.
* **Rutes:** /admin/login i /admin/users.
* **Funcionalitat:** Permet als administradors gestionar els usuaris de l'aplicació (Veure, Crear, Editar, Esborrar) directament des del servidor, sense dependre del client React.

---

## Resum de Requisits Complerts

| Àrea | Detall de la Implementació |
| :--- | :--- |
| **BD** | +7 Taules, Migracions de modificació, Factories & Seeders. |
| **Auth** | Sanctum + Sessions, Login Dual, Reset Password per Email. |
| **API** | JSON estandarditzat, Filtres, Documentació Swagger. |
| **Admin** | Gestió d'usuaris amb Blade (Server-Side). |
| **Extra** | Consum d'API Externa (ZenQuotes) al Dashboard. |