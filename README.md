# NoteLab - Application de prise de notes collaborative

NoteLab est une application de prise de notes collaborative qui permet à plusieurs utilisateurs de créer, modifier et partager des notes en temps réel. Conçue pour être simple, rapide et fluide, NoteLab est idéale pour les équipes, les étudiants ou toute personne souhaitant organiser ses idées en groupe.

## Prérequis

Avant de commencer, assurez-vous que vous avez installé les éléments suivants :

* **Node.js** (version 14 ou supérieure)
* **PostgreSQL** (pour la base de données)

## Installation

### Étapes d'installation

1. **Clonez le repository** :

   ```bash
   git clone https://github.com/PrinceSpecial/notelab.git
   cd notelab
   ```

2. **Installez les dépendances** :

   ```bash
   npm install
   ```

3. **Mettez en place le fichier .env**:

    Créez un fichier .env à la racine de votre projet. Vous devrez ajouter les variables d'environnement nécessaires pour la configuration de la base de données et d'autres services.

    ```bash
    DATABASE_URL=postgresql://user:password@localhost:5432/notelab
    ```

    Vous pouvez copier le fichier .env.example

    ```bash
    cp .env.example .env
    ```

4. **Générez les fichiers nécessaires** :

   ```bash
   npm run generate
   ```

5. **Effectuez les migrations de la base de données** (Assurez-vous que votre serveur PostgreSQL est en cours d'exécution) :

   ```bash
   npm run migrate
   ```

### Démarrage de l'application

Pour lancer l'application, exécutez la commande suivante pour démarrer à la fois le serveur WebSocket et l'application Next.js :

  ```bash
  npm run dev:all
  ```

Cette commande va automatiquement démarrer :

Le serveur WebSocket pour la synchronisation en temps réel des notes.

L'application Next.js pour gérer le front-end.

Votre application sera alors accessible sur `http://localhost:3000`.

## Fonctionnalités

* **Prise de notes collaborative en temps réel** : Éditez vos notes avec d'autres utilisateurs simultanément.
* **Interface simple et intuitive** : Une interface épurée pour se concentrer sur l'essentiel.
* **Partage de notes** : Partagez facilement vos notes avec d'autres utilisateurs.
* **Sauvegarde automatique** : Vos notes sont sauvegardées au fur et à mesure que vous travaillez.

## Technologies utilisées

* **Next.js** pour la partie front-end.
* **PostgreSQL** pour la gestion de la base de données.
* **WebSocket** pour la communication en temps réel entre les utilisateurs.
* **Drizzle** pour l'ORM et les migrations de base de données.

## Contributions

Les contributions sont les bienvenues ! Si vous avez des idées ou souhaitez améliorer NoteLab, n'hésitez pas à ouvrir une *pull request*.

## Auteurs

**Temitayo GBOLAHAN** - Développeur principal  
  [GitHub](https://github.com/PrinceSpecial) | [LinkedIn](https://www.linkedin.com/in/temitayogbolahan/)

## Organisateurs

* **Eudoxie ABOUTA** [LinkedIn](https://www.linkedin.com/in/eudoxieabouta)
* **Romuald AMEGBEJI** [LinkedIn](https://www.linkedin.com/in/romuald-amegbedji)

## License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
