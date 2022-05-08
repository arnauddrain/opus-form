const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const fs = require("fs");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://opus-form-3bee7.firebaseio.com",
});

const firestore = admin.firestore();
firestore
  .collection("/answers")
  .listDocuments()
  .then(async (docs) => {
    const promises = [];
    docs.forEach((doc) => {
      promises.push(doc.get());
    });
    const questions = [
      {
        label: "prix pinte",
        id: "alcool-prix",
      },
      {
        label: "quantité soft",
        id: "soft-prix",
      },
      {
        label: "part bio",
        id: "bio",
      },
      {
        label: "gestion couverts",
        id: "couverts",
      },
      {
        label: "crepes",
        id: "crepes",
      },
      {
        label: "prix crepes",
        id: "prix-crepes",
      },
      {
        label: "intéressé navette",
        id: "navette",
      },
      {
        label: "prise en charge navette",
        id: "prix-navette",
      },
      {
        label: "récompense cyclistes",
        id: "cyclistes",
      },
      {
        label: "artistes plus renommés",
        id: "artistes-renommes",
      },
      {
        label: "techniciens bénécoles",
        id: "salaire-inge",
      },
      {
        label: "toilettes",
        id: "toilettes",
      },
      {
        label: "matériel",
        id: "prix-materiel",
      },
      {
        label: "caisse solidarité",
        id: "caisse-solidarite",
      },
    ];
    let output =
      "Date," +
      questions.reduce(
        (line_output, q) =>
          line_output + "Réponse " + q.label + ",Valeur " + q.label + ",",
        ""
      ) +
      "\n";
    const answers = await Promise.all(promises);
    const answersData = answers.map((a) => a.data());
    answersData.forEach((a) => {
      output += new Date(a.date._seconds * 1000) + ",";
      output += questions.reduce(
        (line_output, q) =>
          line_output +
          '"' +
          a[q.id + "-label"] +
          '",' +
          a[q.id + "-value"] +
          ",",
        ""
      );
      output += "\n";
    });
    fs.writeFileSync("./export.csv", output);
  });
