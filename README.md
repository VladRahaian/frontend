# Mini frontend pentru API

**Link public:** https://vladrahaian.github.io/frontend/

**API folosit:** https://jsonplaceholder.typicode.com/posts

## Ce face
- La încărcare face GET și afișează primele 10 postări (stări: se încarcă, eroare, listă goală).
- Formularul trimite un POST cu JSON (`Content-Type: application/json`, body din `FormData`).
- Butonul "Șterge" trimite DELETE; am folosit delegarea evenimentelor (un singur listener pe listă).

## CORS
JSONPlaceholder trimite header-ul `Access-Control-Allow-Origin: *`, deci browserul permite cererile de pe GitHub Pages și nu am avut nevoie de proxy.

## Status codes
- 200: GET și DELETE reușite; 201: POST reușit, adaug elementul în listă fără re-fetch.
- 4xx: afișez mesajul serverului lângă formular; 5xx: mesaj generic.
- Eroare de rețea (fetch aruncă excepție): mesaj generic "Eroare de rețea".
- Verific mereu `response.ok` înainte să citesc răspunsul.
