import { Component, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

interface Option {
  label: string;
  value: number;
}
interface Question {
  id: string;
  label: string;
  description?: string;
  answerIndex?: number;
  options: Option[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('confirmSwal')
  public readonly confirmSwal!: SwalComponent;

  public basePrice = 66;
  public questions: Question[] = [
    {
      id: 'price',
      label: 'Veux-tu augmenter le prix de la place ?',
      description: 'Cela nous permettrait de devenir super riches.',
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
      description:
        "On pense que c'est important et en accord avec les valeurs du festival.",
      options: [
        { label: 'Oui', value: 2 },
        { label: 'Non', value: 0 },
      ],
    },
  ];

  public send() {
    this.confirmSwal.fire();
  }

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
