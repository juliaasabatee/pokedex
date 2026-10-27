# 🔴 Pokédex de Kanto - Examen Parcial Enginyeria de Llocs Web

Aquest projecte és la resolució completa i optimitzada de l'Examen Parcial d'Enginyeria de Llocs Web. Està desenvolupat utilitzant **HTML5 semàntic**, **CSS3 (Responsive & Sticky)** i **JavaScript Asíncrono (ES6 / Fetch API)** consumint la [PokéAPI](https://pokeapi.co/).

---

## 📋 Requisits Coberts (10 / 10 Punts)

### 1. Disseny Responsive Sense Scroll Horitzontal (Obligatori)
- Implementat amb reset universal (`box-sizing: border-box`), `max-width: 100vw` i `overflow-x: hidden`.
- Totalment adaptable a pantalles de mòbil, tauleta i ordinador.

### 2. Llista dels 151 Pokémon de Kanto (2.5 Punts)
- Càrrega asíncrona de la regió de Kanto mitjançant l'endpoint `GET https://pokeapi.co/api/v2/pokemon?limit=151`.
- Targetes visuals amb número de Pokédex, nom, imatge oficial (`official-artwork`) i badges amb els seus tipus.

### 3. Detalls del Pokémon al Fer Clic (1.5 Punts)
- En fer clic a qualsevol Pokémon, es mostra al monitor de detalls:
  - Nom
  - ID de la Pokédex
  - Imatge d'alta qualitat (`official-artwork`)
  - Tipus oficials amb colors distintius.

### 4. Afegir a l'Equip (Màxim 6 Pokémon) (1.5 Punts)
- Botó "Afegir a l'equip" a cada targeta i al monitor de detalls.
- Control estricte del límit de 6 Pokémon amb notificació d'alerta.

### 5. Equip Sempre Visible (1.0 Punt)
- Panell fixat a la part superior utilitzant `position: sticky; top: 10px; z-index: 100`.
- Targetes de l'equip amb nom, foto, tipus i botó per treure el Pokémon de l'equip.

### 6. Cercador per Nom o ID (2.5 Punts)
- Consulta a `GET https://pokeapi.co/api/v2/pokemon/{nom}`.
- Gestió d'errors (`respuesta.ok === false`) quan no es troben resultats.
- Botó de prova aleatòria "Sorpresa" inclòs.

### 7. Funcionalitat Extra: Cadenes d'Evolució i Stats Base (1.0 Punt)
- **Cadenes d'Evolució:** En seleccionar un Pokémon, es realitzen peticions secundàries a `pokemon-species` i `evolution-chain` per mostrar visualment tota la línia evolutiva amb imatges clicables.
- **Estadístiques de Combat:** Barres de progrés visuals per a HP, Atac, Defensa i Velocitat.

---

## 📁 Estructura del Repositori
```text
Examen_Pokedex_Kanto/
├── index.html     # Estructura principal i panells de la Pokédex
├── style.css      # Estilos visuals, colors per tipus i maquetació responsive
├── script.js      # Lògica del cercador, equip, PokéAPI i funcionalitat extra
└── README.md      # Documentació i instruccions del repositori
```

## 🚀 Com Executar el Projecte
Simplement obre el fitxer `index.html` en qualsevol navegador web actual o utilitza una extensió com *Live Server* a Visual Studio Code.
