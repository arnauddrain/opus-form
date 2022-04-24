import { Component } from '@angular/core';

interface Option {
  label: string;
  value: number;
}
interface Question {
  id: string;
  label: string;
  answerIndex?: number;
  options: Option[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public basePrice = 60;
  public questions: Question[] = [
    {
      id: 'price',
      label: 'Veux-tu augmenter le prix de la place ?',
      answerIndex: 1,
      options: [
        { label: 'Oui', value: 2 },
        { label: 'Non', value: 0 },
        { label: 'Non je veux même le baisser', value: -2 },
      ],
    },
    {
      id: 'bio',
      label: 'Veux-tu des jus de fruits bio ?',
      options: [
        { label: 'Oui', value: 2 },
        { label: 'Non', value: 0 },
      ],
    },
  ];

  public getTotalPrice(index?: number) {
    return (
      this.basePrice +
      this.questions
        .slice(0, index)
        .reduce(
          (total, question) =>
            total + (question.options[question.answerIndex]?.value ?? 0),
          0
        )
    );
  }
}
