import { Component, ViewChild } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

interface Option {
  label: string;
  value: number;
}
interface Question {
  id: string;
  hideConclusion?: boolean;
  label: string;
  description?: string;
  answerIndex?: number;
  options: Option[];
  personnalChoice?: boolean;
}

interface QuestionGroup {
  label: string;
  questions: Question[];
  description?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('confirmSwal')
  public readonly confirmSwal!: SwalComponent;
  @ViewChild('errorSwal')
  public readonly errorSwal!: SwalComponent;

  public finished = false;
  public basePrice = 68;
  public questionGroups: QuestionGroup[] = [
    {
      label: 'Bar',
      questions: [
        {
          id: 'alcool-prix',
          label:
            'Combien seriez vous prêt à payer pour une pinte de bière/cidre ou un verre de vin ?',
          description:
            'Les ventes du bar permettent actuellement de garder un prix de billet abordable grâce aux bénéfices générés, le prix de la bière est donc un paramètre très important pour nous.',
          options: [
            { label: '5€00', value: 0 },
            { label: '5€25', value: -1.125 },
            { label: '5€50', value: -2.25 },
          ],
        },
        {
          id: 'soft-prix',
          label:
            "Pour 2,5€ quelle quantité de soft voulez vous? (50 cl l'année dernière)",
          description:
            "Le prix du soft est pensé pour être attractif par rapport au prix d'une boisson alcoolisée, en parallèle nous essayons d'avoir des softs les plus élaborés possibles (à la framboise par exemple).",
          options: [
            { label: '50cl', value: 0 },
            { label: '33cl', value: -0.625 },
          ],
        },
      ],
    },
    {
      label: 'Intendance',
      questions: [
        {
          id: 'bio',
          label:
            'Quelle part de produits bio souhaitez-vous dans les approvisionnements du festival ?',
          description:
            "Afin de diminuer notre impact sur l'environnement (notamment sur la biodiversité) et afin de limiter les risques liés à l'utilisation des produits phytosanitaires pour les producteurs, le bio semble être une voie intéressante à explorer.<br>Bien sûr, intégrer des produits bio dans l'alimentation ne veut pas nécessairement dire diminuer la quantité de produits locaux et/ou en circuits courts. Dans la mesure du possible, nous ferons les trois 😉 mais, toi même tu sais, c'est pas toujours évident.",
          options: [
            { label: '0% de bio soit 100% de non bio', value: 0 },
            { label: '25% de bio soit 75% de non bio', value: 2.1 },
            { label: '50% de bio soit 50% de non bio', value: 4.2 },
            { label: '75% de bio soit 25% de non bio', value: 6.3 },
            { label: '90% de bio soit 10% de non bio', value: 7.56 },
          ],
        },
        {
          id: 'couverts',
          label:
            'Que souhaitez-vous que le festival mette en place pour la gestion des couverts et assiettes pour le repas ?',
          description:
            'Nous envisageons de proposer des couverts et assiettes en acier émaillé, plus jolies et pratiques que les gamelles de camping habituelles.',
          options: [
            {
              label: 'On fournit à toustes des assiettes et des couverts',
              value: 2,
            },
            {
              label: 'On fournit seulement à celles et ceux qui veulent',
              value: 0.6,
            },
            { label: 'On ne fournit à personne', value: 0 },
          ],
        },
        {
          id: 'crepes',
          label:
            'Nous envisageaons de proposer des crêpes à la vente sur le festival.',
          description: 'Seriez vous intéressé.e ?',
          hideConclusion: true,
          options: [
            {
              label: 'Oui',
              value: 0,
            },
            {
              label: 'Non',
              value: 0,
            },
          ],
        },
        {
          id: 'prix-crepes',
          label:
            'A quel prix seriez-vous prêt à payer une crêpe au sucre ou confiture ?',
          description:
            'La vente de crêpes pourrait permettre de diminuer le prix du billet.',
          options: [
            {
              label: '1€',
              value: -1.28,
            },
            {
              label: '1€50',
              value: -2.08,
            },
            {
              label: '2€',
              value: -2.88,
            },
          ],
        },
      ],
    },
    {
      label: 'Transports',
      description:
        "Le bilan carbone du festival réalisé pour l'édition 2021 a montré que plus des 3/4 des GES provenait des transports, voici donc quelques propositions pour réduire ce poste d'émissions :",
      questions: [
        {
          id: 'navette',
          personnalChoice: true,
          label: 'Seriez vous intéressé par une navette ?',
          description:
            "Nous envisageons de proposer une navette de 40 places depuis Paris. Cela permettrait de passer de 10kgCO2 a moins de 5kgCO2 par personne. Le prix de la navette serait de 30€/personne pour l'aller retour.",
          options: [
            { label: 'Non', value: 0 },
            { label: "Oui, uniquement à l'aller", value: 15 },
            { label: 'Oui, Uniquement au retour', value: 15 },
            { label: "Oui, pour l'aller/retour", value: 30 },
          ],
        },
        {
          id: 'prix-navette',
          label:
            "Pour inciter à prendre la navette, quel pourcentage estimez vous qu'il faudrait prendre en charge ?",
          description:
            "Nous envisageons d'inciter les gens à prendre les navettes en prenant en charge une partie du prix de la navette.",
          options: [
            {
              label: '0% soit un prix de navette de 30€ par personne',
              value: 0,
            },
            {
              label: '25% soit un prix de navette de 22,5€ par personne',
              value: 1.5,
            },
            {
              label: '50% soit un prix de navette de 15€ par personne',
              value: 3,
            },
            {
              label: '75% soit un prix de navette de 7,5€ par personne',
              value: 4.5,
            },
            {
              label: '90% soit un prix de navette de 3€ par personne',
              value: 5.4,
            },
          ],
        },
        {
          id: 'cyclistes',
          label:
            "Combien d'équivalent pinte voulez vous que l'on offre aux cyclistes? ",
          description:
            "Nous envisageons aussi d'offrir une boisson à chaque personne qui vient à vélo pour inciter ce moyen de transport particulièrement peu polluant.",
          options: [
            {
              label: '0',
              value: 0,
            },
            {
              label: '1',
              value: 0.252,
            },
            {
              label: '2',
              value: 0.504,
            },
          ],
        },
      ],
    },
    {
      label: 'Programmation',
      questions: [
        {
          id: 'artistes-renommes',
          label: 'Combien d\'artistes "plus renommés" souhaitez-vous voir ?',
          description:
            "Pour des raisons de coût du billet, nous avons décidé de booker des artistes à renommée limitée mais de grande qualité. Certains et certaines d'entre eux nous ont gentillement fait des tarifs pour soutenir les débuts du festival. Merci à eux ! Nous pourrions changer ce fonctionnement et avoir des artistes plus renommés si le prix du billet augmente.",
          options: [
            { label: '0', value: 0 },
            { label: '1', value: 3 },
            { label: '2', value: 6 },
            { label: '3', value: 9 },
            { label: '4', value: 12 },
          ],
        },
        {
          id: 'salaire-inge',
          label: 'Seriez vous prêt.e à payer les techniciens bénévoles ?',
          description:
            "L'an dernier, nous avions la chance d'avoir des amis et connaissance qui ont accepté de venir bénévolement pour nous aider et faire leur travail gratuitement. Cela pour des raisons de coûts. Nous ne sommes pas forcément convaincus de ce parti pris et pensons que, chaque personne professionnelle sur le festival doit pouvoir obtenir un salaire.",
          options: [
            { label: 'non', value: 0 },
            { label: 'oui au prix minimum', value: 3.2 },
            { label: 'oui 10% au dessus du minimum', value: 3.52 },
            { label: 'oui 20% au dessus du minimum', value: 3.84 },
          ],
        },
      ],
    },
    {
      label: 'Autres dépenses',
      questions: [
        {
          id: 'prix-materiel',
          label:
            'Quelle somme souhaitez-vous que nous investissions dans le matériel du festival ? (prix par personne)',
          description:
            "Investir dans du matériel nous permettrait de de gagner en qualité, en confort et en efficacité. Seulement, investir nous demanderait de la place de stockage. Cette place (un box dans un garage) coûterait environ 50€ par mois + le prix de l'investissement. Nous pourrions acheter du matériel d'éclairage, de cuisine, de la décoration etc. Cet investissement serait amorti sur plusieurs années.",
          options: [
            { label: '0', value: 0 },
            {
              label:
                '0.5€ soit 3€ (2,5€ seraient par défaut utilisés par le box)',
              value: 3,
            },
            {
              label:
                '2.5€ soit 5€ (2,5€ seraient par défaut utilisés par le box)',
              value: 5,
            },
          ],
        },
        {
          id: 'caisse-solidarite',
          label:
            'Quelle quantité de places à -50% souhaitez vous mettre à disposition de celles et ceux qui en ont besoin ?',
          description:
            "Le prix du billet augmente cette année à cause de l'inflation. Nous souhaitons permettre au plus grand nombre de personnes de venir à ce festival. Nous proposons donc la mise en place d'une caisse de solidarité.",
          options: [
            { label: '0', value: 0 },
            { label: '10', value: 1.52 },
            { label: '15', value: 2.28 },
            { label: '20', value: 3.04 },
          ],
        },
      ],
    },
  ];

  constructor(private firestore: Firestore) {}

  public send() {
    const answers = this.questionGroups
      .reduce(
        (allQuestions, questionGroup) => [
          ...allQuestions,
          ...questionGroup.questions,
        ],
        [] as Question[]
      )
      .reduce(
        (final, q) => ({
          ...final,
          [q.id + '-label']: q.options[q.answerIndex]?.label ?? 'N/A',
          [q.id + '-value']: q.options[q.answerIndex]?.value ?? 'N/A',
        }),
        { date: new Date(Date.now()) }
      );
    const answerCollection = collection(this.firestore, '/answers');
    addDoc(answerCollection, answers)
      .then(() => {
        this.finished = true;
        this.confirmSwal.fire();
      })
      .catch((e) => {
        console.error(e);
        this.errorSwal.fire();
      });
  }

  public onChange(question: Question) {
    if (question.id === 'prix-navette') {
      const percentage =
        +question.options[question.answerIndex]?.label.split('%')[0] ?? 0;
      const navetteQuestion = this.questionGroups
        .find((qg) => qg.label === 'Transports')
        .questions.find((q) => q.id === 'navette');
      navetteQuestion.options.forEach((o, index) => {
        if (index === 1 || index === 2) {
          o.value = 15 - 15 * (percentage / 100);
        }
        if (index === 3) {
          o.value = 30 - 30 * (percentage / 100);
        }
      });
    }
  }

  public getTotalPrice() {
    return (
      this.basePrice +
      this.questionGroups.reduce(
        (total, questionGroup) =>
          total +
          questionGroup.questions
            .filter((q) => !q.personnalChoice)
            .reduce(
              (totalGroup, question) =>
                totalGroup +
                (question.options[question.answerIndex]?.value ?? 0),
              0
            ),
        0
      )
    );
  }

  public getPrivatePrice() {
    return this.questionGroups.reduce(
      (total, questionGroup) =>
        total +
        questionGroup.questions
          .filter((q) => q.personnalChoice)
          .reduce(
            (totalGroup, question) =>
              totalGroup + (question.options[question.answerIndex]?.value ?? 0),
            0
          ),
      0
    );
  }
}
