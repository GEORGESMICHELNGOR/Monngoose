// Importation des modules nécessaires
const mongoose = require('mongoose');
require('dotenv').config();

// Connexion à la base de données MongoDB en utilisant l'URI stockée dans .env
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(err => console.error('Erreur de connexion à MongoDB:', err));


    // Définition du schéma pour une personne
const personSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Nom est une chaîne obligatoire
    age: Number,  // Âge est un nombre
    favoriteFoods: [String]  // favoriteFoods est un tableau de chaînes
});

// Création du modèle basé sur le schéma
const Person = mongoose.model('Person', personSchema);


// Création d'une nouvelle instance de Person
const createAndSavePerson = (done) => {
    const person = new Person({
        name: 'Alice',
        age: 25,
        favoriteFoods: ['Pizza', 'Pasta']
    });

    // Sauvegarde de l'instance de personne dans la base de données
    person.save((err, data) => {
        if (err) return console.error(err);
        done(null, data);
    });
};



// Création de plusieurs personnes en une seule opération
const createManyPeople = (arrayOfPeople, done) => {
    Person.create(arrayOfPeople, (err, people) => {
        if (err) return console.error(err);
        done(null, people);
    });
};



// Trouver toutes les personnes ayant un prénom spécifique
const findPeopleByName = (personName, done) => {
    Person.find({ name: personName }, (err, people) => {
        if (err) return console.error(err);
        done(null, people);
    });
};



// Trouver une seule personne ayant un certain aliment favori
const findOneByFood = (food, done) => {
    Person.findOne({ favoriteFoods: food }, (err, person) => {
        if (err) return console.error(err);
        done(null, person);
    });
};



// Trouver une personne par son _id
const findPersonById = (personId, done) => {
    Person.findById(personId, (err, person) => {
        if (err) return console.error(err);
        done(null, person);
    });
};



// Rechercher une personne par son _id et ajouter "hamburger" à ses aliments favoris
const findEditThenSave = (personId, done) => {
    Person.findById(personId, (err, person) => {
        if (err) return console.error(err);
        
        person.favoriteFoods.push('hamburger');
        person.save((err, updatedPerson) => {
            if (err) return console.error(err);
            done(null, updatedPerson);
        });
    });
};



// Trouver une personne par son nom et mettre à jour son âge à 20 ans
const findAndUpdate = (personName, done) => {
    const ageToSet = 20;

    Person.findOneAndUpdate(
        { name: personName },
        { age: ageToSet },
        { new: true },  // Retourner le document mis à jour
        (err, updatedPerson) => {
            if (err) return console.error(err);
            done(null, updatedPerson);
        }
    );
};


// Supprimer une personne par son _id
const removeById = (personId, done) => {
    Person.findByIdAndRemove(personId, (err, removedPerson) => {
        if (err) return console.error(err);
        done(null, removedPerson);
    });
};



// Supprimer toutes les personnes ayant le nom "Mary"
const removeManyPeople = (done) => {
    Person.remove({ name: 'Mary' }, (err, result) => {
        if (err) return console.error(err);
        done(null, result);
    });
};


// Trouver des personnes qui aiment les burritos, les trier par nom, limiter les résultats à deux et masquer l'âge
const queryChain = (done) => {
    Person.find({ favoriteFoods: 'burritos' })
        .sort({ name: 1 })
        .limit(2)
        .select('-age')
        .exec((err, people) => {
            if (err) return console.error(err);
            done(null, people);
        });
};
