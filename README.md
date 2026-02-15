# Cours Gestion de Projet — Description du site

Présentation
- Ce site est une version locale et interactive d'un cours de gestion de projet. Il regroupe le contenu pédagogique (textes, définitions, exemples) et propose des outils d'apprentissage : quiz, flashcards, mindmap, prise de notes et suivi de progression.

Principales fonctionnalités
- Navigation par modules : sélectionnez un module dans la colonne de gauche pour afficher son contenu.
- Mindmap interactive : cliquez sur les noeuds pour accéder aux modules correspondants.
- Flashcards : cartes recto/verso cliquables pour réviser des notions clés.
- Quiz intégré : 50 questions avec pagination, indices et feedback immédiat.
- Prise de notes : zone de notes personnelles sauvegardée dans `localStorage`.
- Suivi de progression : barre de progression calculée en fonction du module consulté.
- Mode sombre : bascule entre clair/sombre, persisté via `localStorage`.
- Export (simulé) : bouton d'export pour sauvegarder/partager le contenu (placeholder alert pour la version locale).

Structure des fichiers
- `cours gestion de projet.html` — page principale (HTML). Placez-la dans le dossier racine du projet.
- `styles.css` — styles extraits (CSS).
- `app.js` — logique JavaScript extraite (interactions, quiz, mindmap, notes).
- `README.md` — ce fichier.

Comment utiliser
1. Ouvrez `cours gestion de projet.html` dans votre navigateur (double-clique ou `Fichier > Ouvrir`).
2. Test rapide :
   - Vérifiez la navigation des modules.
   - Cliquez sur des noeuds de la mindmap.
   - Testez une flashcard (cliquez pour retourner la carte).
   - Lancez le quiz, répondez et cliquez sur "Soumettre" pour obtenir le score.
   - Ajoutez du texte dans la zone de notes : il est automatiquement sauvegardé.

Vérification et dépannage
- Ouvrez la console développeur (`F12`) et regardez l'onglet "Console" pour détecter d'éventuelles erreurs JavaScript.
- Vérifiez que `styles.css` et `app.js` sont bien dans le même dossier que `cours gestion de projet.html`.
- Si les clics n'ont aucun effet :
  - Videz le cache (Ctrl+F5) et rechargez la page.
  - Confirmez l'absence d'erreurs dans la console (par ex. syntaxe JavaScript interrompue).

Conseils pour versionner
- Git : exécutez ces commandes dans le dossier du projet pour créer un commit :

```bash
git init
git add "cours gestion de projet.html" styles.css app.js README.md
git commit -m "Split HTML into CSS and JS; add site README"
```

Prochaines améliorations possibles
- Génération d'un PDF d'export réel pour les notes et le contenu du module.
- Ajout d'un petit script de build ou d'un serveur local (ex. `live-server`) pour tester rapidement.
- Transformation du quiz en module réutilisable avec stockage des scores par utilisateur.

Support
- Dites-moi si vous voulez que je :
  - crée le commit Git pour vous,
  - ajoute un script `live-server` dans un `package.json`,
  - améliore l'export PDF ou active des tests unitaires pour le JS.

---
Fait le 15 février 2026 — description mise à jour pour le site local.
