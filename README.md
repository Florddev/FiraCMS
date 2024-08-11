# CMS Laravel avec Système de Plugins (utilisant Laravel Sail)

## Description

Ce projet est un système de gestion de contenu (CMS) basé sur Laravel, intégrant un système de plugins avancé. Il utilise Laravel Sail pour une configuration de développement Docker simplifiée et offre des commandes Artisan personnalisées pour faciliter la gestion des plugins.

## Fonctionnalités principales

1. **Gestion des plugins**
    - Ajout, activation, désactivation et suppression de plugins
    - Détection automatique des nouveaux plugins
    - Gestion des migrations de plugins

2. **Système de hooks**
    - Permet aux plugins d'injecter du contenu à différents endroits du CMS
    - Hooks front-end pour une intégration flexible dans l'interface utilisateur

3. **Migrations automatisées**
    - Exécution automatique des migrations lors de l'activation des plugins
    - Rollback des migrations lors de la suppression des plugins
    - Sauvegarde sécurisée des fichiers de migration

4. **Interface d'administration**
    - Gestion des plugins via une interface utilisateur intuitive
    - Vue d'ensemble des plugins installés et leur statut

5. **Intégration React et Inertia**
    - Utilisation de React pour le front-end
    - Intégration avec Inertia pour une expérience fluide entre le back-end et le front-end

6. **Commandes Artisan personnalisées**
    - Création rapide de nouveaux plugins et de leurs composants

## Exigences

- Docker
- Docker Compose
- Git

## Installation

1. Clonez le repository :
   ```
   git clone https://github.com/votre-repo/cms-laravel-plugins.git
   cd cms-laravel-plugins
   ```

2. Copiez le fichier `.env.example` en `.env` :
   ```
   cp .env.example .env
   ```

3. Démarrez l'environnement Docker avec Sail :
   ```
   ./vendor/bin/sail up -d
   ```

4. Installez les dépendances PHP :
   ```
   ./vendor/bin/sail composer install
   ```

5. Générez la clé d'application :
   ```
   ./vendor/bin/sail artisan key:generate
   ```

6. Exécutez les migrations :
   ```
   ./vendor/bin/sail artisan migrate
   ```

7. Installez les dépendances JavaScript et compilez les assets :
   ```
   ./vendor/bin/sail npm install
   ./vendor/bin/sail npm run dev
   ```

## Configuration

- La configuration de l'environnement de développement est gérée par Laravel Sail et Docker.
- Assurez-vous que le dossier `storage/app/plugin_migrations` existe et a les bonnes permissions dans le conteneur.

## Utilisation

### Gestion des plugins

Utilisez les commandes Artisan personnalisées suivantes pour gérer vos plugins :

1. Créer un nouveau plugin :
   ```
   ./vendor/bin/sail artisan make:plugin PluginName
   ```

2. Créer un contrôleur pour un plugin :
   ```
   ./vendor/bin/sail artisan make:plugin-controller PluginName NouveauController
   ```

3. Créer une migration pour un plugin :
   ```
   ./vendor/bin/sail artisan make:plugin-migration PluginName create_newtables_table
   ```

4. Créer un modèle pour un plugin :
   ```
   ./vendor/bin/sail artisan make:plugin-model PluginName ModelName
   ```

### Activation et désactivation des plugins

Accédez à l'interface d'administration des plugins via `/admin/plugins` dans votre navigateur.

### Système de hooks

Pour utiliser un hook dans un composant React :

```jsx
import { PluginHook } from '../hooks';

function MonComposant() {
  return (
    <div>
      {/* Votre contenu */}
      <PluginHook name="nom-du-hook" />
    </div>
  );
}
```

Dans votre plugin, enregistrez un composant pour ce hook :

```jsx
import { registerHook } from '/resources/js/hooks';
import MonComposantPlugin from './components/MonComposantPlugin';

registerHook('nom-du-hook', MonComposantPlugin);
```

## Structure d'un plugin

Après avoir utilisé la commande `make:plugin`, votre plugin aura la structure suivante :

```
plugins/PluginName/
├── src/
│   ├── Controllers/
│   ├── Models/
│   └── PluginServiceProvider.php
├── resources/
│   ├── js/
│   │   └── components/
│   └── views/
├── database/
│   └── migrations/
├── routes/
│   └── web.php
└── plugin.json
```

## Gestion des migrations

- Les migrations des plugins sont automatiquement exécutées lors de l'activation du plugin.
- En cas de suppression d'un plugin, les migrations sont automatiquement annulées.
- Les fichiers de migration sont sauvegardés pour permettre le rollback même après la suppression des sources du plugin.

## Développement avec Sail

- Utilisez `./vendor/bin/sail` comme préfixe pour toutes les commandes Laravel et npm.
- Pour entrer dans le conteneur : `./vendor/bin/sail shell`
- Pour arrêter l'environnement : `./vendor/bin/sail down`

## Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Forkez le repository
2. Créez une branche pour votre fonctionnalité (`git checkout -b ma-nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajout de quelque chose'`)
4. Poussez vers la branche (`git push origin ma-nouvelle-fonctionnalite`)
5. Créez une nouvelle Pull Request

## Licence

[MIT License](https://opensource.org/licenses/MIT)

## Support

Pour toute question ou problème, veuillez ouvrir un ticket dans la section Issues du repository GitHub.
